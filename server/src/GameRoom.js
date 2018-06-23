const uws = require('uws'),
	lz4 = require('lz4'),
	// net imports
	Player = require('./net/Player'),
	handleMessage = require('./net/msgHandler'),
	handleTimeout = require('./net/playerTimeout'),

	// data imports
	mapData = require('./data/territoryData'),
	continents = require('./data/continents'),

	// logic imports
	tps = require('./logic/tps'),
	attack = require('./logic/attack'),

	// room constants
	consts = require('./data/gameConstants'),
	MAX_PLAYERS_PER_ROOM = consts.MAX_PLAYERS_PER_ROOM,
	EXTRA_TROOPS = consts.EXTRA_TROOPS,
	PLAYER_ATTACK_TIMER_MULTIPLIER = consts.PLAYER_ATTACK_TIMER_MULTIPLIER;

class GameRoom {
	getPlayer(socket) {
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i];
			if (player.id == socket.pid) {
				return player;
			}
		}
		return null;
	}
	getPlayerById(id) {
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i];
			if (player.id == id) {
				return player;
			}
		}
		return null;
	}
	removePlayer(socket) {
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i];
			if (player.id == socket.pid) {
				this.players.splice(i, 1);
				return;
			}
		}
	}
	broadcast(event, data) {
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i];
			player.send(event, data);
		}
	}
	broadcastMap(mapBuffer) {
		for (let i = 0; i < this.players.length; ++i) {
			let player = this.players[i];
			player.socket.send(mapBuffer);
		}
	}
	broadcastMapState() {
		let smap = {};
		for (let tid in this.map) {
			let t = this.map[tid];
			smap[tid] = {
				id: tid,
				troops: (t.troops || 0),
				owner: -1
			}
			if (t.owner) {
				smap[tid].owner = t.owner.index;
			}
		}
		let buffer = lz4.encode(JSON.stringify(smap));
		this.broadcastMap(buffer);
	}
	shutdown(ws, why) {
		let _ws = ws;
		if (ws instanceof Player) _ws = ws.socket;
		ws.send(JSON.stringify({
			e: 'error',
			d: why
		}));
		ws.close();
	}
	startGame() {
		this.gameStarted = true;
		for (let i = 0; i < this.players.length; ++i) {
			this.players[i].send('started', this.players[i].index);
		}
		console.log('starting game on room ' + this.port);
		// round robin territory selection
		this.selectingPlayer = this.players[0];
		this.selectingPlayer.startSelectionTurn();
	}
	startTurn(player) {
		this.activePlayer = player;
		console.log('starting turn for player ' + player.index);
		player.newTroops = tps(this, player);
		player.startTurnTimer();
		player.startPlace();
	}
	startAttackPhase(p) {
		console.log('starting attack phase for player ' + p.index);
		p.setPhase('attack');
		p.attacking = true;
		p.startTurnTimer(PLAYER_ATTACK_TIMER_MULTIPLIER);
	}
	startMovePhase(p) {
		p.turnTimerEnd();
		console.log('starting move phase for player ' + p.index);
		p.setPhase('move');
		p.attacking = false;
		p.moving = true;
	}
	endTurn(oldPlayer) {
		oldPlayer.setPhase('wait');
		// round robin player turns
		let newPlayer;
		if (this.players[oldPlayer.index + 1]) {
			newPlayer = this.players[oldPlayer.index + 1];
		} else {
			newPlayer = this.players[0];
		}
		this.activePlayer = newPlayer;
		this.startTurn(newPlayer);
	}
	init(port, dontStartServer) {
		let me = this;
		if (!dontStartServer) {
			this.server = new uws.Server({
				port: port
			});
		}

		this.port = port;
		this.players = [];
		this.selectingPlayer = null;
		this.selectedTerritories = 0;
		this.gameStarted = false;
		this.joinedPlayers = 0;
		this.activePlayer = null; // player with current turn
		this.map = Object.assign({}, mapData);

		// transform map data
		for (const tid in this.map) {
			let t = this.map[tid];
			delete t.name;
			delete t.url;
			delete t.mapX;
			delete t.mapY;
			delete t.connections;
			if (t.owner)
				delete t.owner;
			if (t.isTaken)
				delete t.isTaken;
			t.id = tid;
			t.troops = 0;
		}

		console.log('started GameRoom on port ' + port);
		if (!dontStartServer) {
			this.server.on('connection', ws => {
				console.log('player open');
				if (me.players.length > MAX_PLAYERS_PER_ROOM) {
					me.shutdown(ws, 'full');
					return;
				}
				let p = new Player(ws, me.players.length);
				p.on('timeout', function() {
					handleTimeout(me, this);
				});
				me.players.push(p);
				ws.on('message', msg => {
					if (typeof msg !== 'string') {
						console.log("bad msg");
						return;
					}
					try {
						msg = JSON.parse(msg);
					} catch (e) {
						console.log('failed to parse msg');
						return;
					}
					if (!msg.e) {
						console.log('bad msg');
						return;
					}
					handleMessage(this, ws, msg.e, msg.d);
				});
				ws.on('close', () => {
					console.log('player close');
					me.removePlayer(ws);
					me.joinedPlayers--;
					if (!me.players.lengh) {
						console.log('no players in room, restarting');
						me.restart();
					}
				});
			});
		}
	}
	constructor(port) {
		this.init(port);
	}
	restart() {
		let me = this,
			_port = me.port;
		me.init(_port, true);
	}
};

module.exports = GameRoom;