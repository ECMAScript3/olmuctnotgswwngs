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

module.exports = (room, player) => {
	let me = room,
		p = player;
	player.turnTimerEnd();

	if (player == me.selectingPlayer) {
		console.log('selecting player timed out, chosing for them..');
		if (me.selectedTerritories >= 42) {
			for (const tid in me.map) {
				let t = me.map[tid];
				if (t.owner == player) {
					t.troops++;
					console.log(p.name + ' reinforced territory ' + tid);
					me.selectedTerritories++;
					player.endSelectionTurn();
				}
			}
		} else {
			for (const tid in me.map) {
				let t = me.map[tid];
				if (!t.owner) {
					// take the first unselected territory
					t.isTaken = true;
					t.troops++;
					t.owner = p;
					console.log(p.name + ' chose territory ' + tid);
					me.selectedTerritories++;
					player.endSelectionTurn();
				}
			}
		}
		player.send('selectTimeout', 0);

		if (me.selectedTerritories >= (42 + (EXTRA_TROOPS * MAX_PLAYERS_PER_ROOM /* extra troops */))) {
			// selection phase is over
			console.log('selection phase over');
			me.selectingPlayer = null;

			me.startTurn(me.players[0]);
			return;
		}

		// start selection for the next player
		if (me.players.length == p.index + 1) {
			// last player has chosen
			me.selectingPlayer = me.players[0];
		} else {
			me.selectingPlayer = me.players[p.index + 1];
		}
		me.selectingPlayer.startSelectionTurn();

		player.selecting = false;
		me.broadcastMapState();
	} else {
		console.log('player ' + player.index + ' timed out');
		// force end of player's turn
		player.send('timeout', 0);
		player.attacking = false;
		player.moving = false;
		player.newTroops = 0;
		player.attackSource = null;
		player.attackDest = null;
		me.endTurn(player);
	}
}