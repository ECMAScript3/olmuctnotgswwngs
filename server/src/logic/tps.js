const uws = require('uws'),
	lz4 = require('lz4'),
	
	// data imports
	mapData = require('../data/territoryData'),
	continents = require('../data/continents'),

	// room constants
	consts = require('../data/gameConstants'),
	MAX_PLAYERS_PER_ROOM = consts.MAX_PLAYERS_PER_ROOM,
	EXTRA_TROOPS = consts.EXTRA_TROOPS;

module.exports = (room, player) => {
	// get player's troops per turn
	let me = room,
		tps = 0,
		id = player.index,
		controlledTerritories = 0,
		controlledContinents = [];
	// get controlled territories
	for (const tid in me.map) {
		let t = me.map[tid];
		if (t.owner == id) controlledTerritories++;
	}
	// get controlled continents
	for (const ckey in continents) {
		let continent = continents[ckey],
			controlsContinent = true;
		for (let i = 0; i < continent.length; ++i) {
			let tid = continent[i],
				territory = me.map[tid];
			if (territory.owner != id) {
				controlsContinent = false;
				break;
			}
		}
		if (controlsContinent)
			controlledContinents.push(continent);
	}
	// calculate tps from those two variables

	// territories
	if (controlledTerritories <= 11) {
		tps += 3;
	} else if (controlledTerritories > 11) {
		tps += Math.ceil(controlledTerritories / 3);
	} else {
		console.log('what?');
		return 1;
	}
	// continents
	for (let i = 0; i < controlledContinents.length; ++i) {
		let continent = controlledContinents[i];
		switch (continent) {
			case 'na': tps += 5; break;
			case 'sa': tps += 2; break;
			case 'af': tps += 3; break;
			case 'eu': tps += 5; break;
			case 'as': tps += 7; break;
			case 'au': tps += 2; break;
		}
	}

	return tps;
}