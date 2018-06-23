const uws = require('uws'),
	lz4 = require('lz4'),

	// data imports
	mapData = require('../data/territoryData'),
	continents = require('../data/continents'),

	// logic imports
	tps = require('../logic/tps'),
	attack = require('../logic/attack'),

	// room constants
	consts = require('../data/gameConstants'),
	MAX_PLAYERS_PER_ROOM = consts.MAX_PLAYERS_PER_ROOM,
	EXTRA_TROOPS = consts.EXTRA_TROOPS;

module.exports = (room, ws, event, data) => {
	let me = room,
		p = me.getPlayer(ws);
	switch (event) {
		case 'join':
			if (me.gameStarted) {
				me.shutdown(ws, 'full');
			}
			if (p.hasJoined) break;
			p.name = data;
			p.hasJoined = true;
			me.joinedPlayers++;
			console.log('player with name "' + p.name + '" joined the lobby');
			p.send('joined', {});
			if (me.joinedPlayers == MAX_PLAYERS_PER_ROOM) {
				me.startGame();
				break;
			}
			break;
		case 'selectionChoice':
			if (!p.selecting) break;
			if (p != me.selectingPlayer) {
				console.log('wrong player submitted selection choice');
				break;
			}
			let selectedId = data,
				t = me.map[selectedId];
			if (t.isTaken) {
				if (t.owner == p) {
					if (me.selectedTerritories >= 42) {
						console.log(p.name + ' reinforced territory ' + data);
						t.troops++;
					} else {
						// cant reinforce territories until every one has been taken
						break;
					}
				} else break;
			} else {
				t.isTaken = true;
				t.troops++;
				t.owner = p;
				console.log(p.name + ' chose territory ' + data);
			}
			me.selectedTerritories++;
			me.broadcastMapState();

			// end selection turn for this player
			p.endSelectionTurn();

			if (me.selectedTerritories >= (42 + (EXTRA_TROOPS * MAX_PLAYERS_PER_ROOM /* extra troops */))) {
				// selection phase is over
				console.log('selection phase over');
				me.selectingPlayer = null;

				me.startTurn(me.players[0]);
				break;
			}
			// start selection for the next player
			if (me.players.length == p.index + 1) {
				// last player has chosen
				me.selectingPlayer = me.players[0];
			} else {
				me.selectingPlayer = me.players[p.index + 1];
			}

			me.selectingPlayer.startSelectionTurn();
			break;
		case 'place':
			if (p.newTroops <= 0) break;
			let tid = data;
			let selectedTerritory = me.map[tid];
			if (!selectedTerritory) break;
			if (selectedTerritory.owner != p) break;
			selectedTerritory.troops++;
			me.broadcastMapState();
			p.newTroops--;
			if (p.newTroops <= 0) {
				console.log('player finished place turn');
				p.turnTimerEnd();
				me.startAttackPhase(p);
			}
			break;
		case 'atk_src':
			if (!p.attacking || !me.map[data]) break;
			if (me.map[data].owner != p) break;
			if (me.map[data].troops < 2) break;
			p.attackSource = data;
			break;
		case 'atk_dst':
			if (!p.attacking || !me.map[data]) break;
			if (me.map[data].owner == p) break;
			p.attackDest = data;
			// ready to attack!
			attack(me, p);
			break;
	}
}