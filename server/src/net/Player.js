const uuidv4 = require('uuid/v4'),
	EventEmitter = require('events'),
	PLAYER_TIMEOUT_TIME_MS = require('../data/gameConstants').PLAYER_TIMEOUT_TIME_MS;

module.exports = class Player extends EventEmitter {
	constructor(ws, index) {
		super();
		this.socket = ws;
		this.id = uuidv4();
		this.socket.pid = this.id;
		this.hasJoined = false;
		this.name = null;
		this.selecting = false;
		this.index = index;
		this.attacking = false;
		this.moving = false;
		this.beingTimed = false;

		this.attackSource = null;
		this.attackDest = null;

		this.newTroops = 0;
	}
	startTurnTimer(multiplier = 1) {
		if (this.beingTimed) {
			clearTimeout(this.timer);
		}
		let me = this;
		this.timer = setTimeout(me._timerCallback.bind(me), PLAYER_TIMEOUT_TIME_MS * multiplier);
		this.beingTimed = true;
	}
	_timerCallback() {
		if (this.beingTimed) {
			this.emit('timeout');
		}
	}
	turnTimerEnd() {
		if (this.beingTimed) {
			clearTimeout(this.timer);
		}
		this.beingTimed = false;
	}
	send(event, data) {
		let packet = {
			e: event,
			d: data
		}
		this.socket.send(JSON.stringify(packet));
	}
	updateMap(mapState) {
		this.send('map', mapState);
	}
	updateTerritory(id, tState) {
		this.send('territory', {
			id: id,
			state: tState
		});
	}
	startSelectionTurn() {
		this.send('select', 0);
		this.setPhase('select');
		this.selecting = true;
		this.startTurnTimer();
	}
	endSelectionTurn() {
		this.send('selectEnd', 0);
		this.setPhase('wait');
		this.selecting = false;
		this.turnTimerEnd();
	}
	setPhase(phaseString) {
		this.send('phase', phaseString);
	}
	startPlace() {
		this.setPhase('place');
		this.send('newTroops', this.newTroops);
	}
}