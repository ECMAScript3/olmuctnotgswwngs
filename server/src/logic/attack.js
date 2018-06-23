const polyroll = require('./pollyroll');

module.exports = (room, player) => {
	let sourceId = player.attackSource,
		destId = player.attackDest,
		sourceTerritory = room.map[player.attackSource],
		destTerritory = room.map[player.attackDest],
		attackTroops = sourceTerritory.troops,
		defenseTroops = destTerritory.troops,
		attackRes = polyroll(attackTroops - 1, defenseTroops);
	if (attackRes.attackWon) {
		console.log('player ' + player.index + ' won');
		sourceTerritory.troops = 1;
		destTerritory.troops = attackRes.remaining;
		destTerritory.owner = player;
	} else if (attackRes.defenseWon) {
		console.log('player ' + player.index + ' lost');
		destTerritory.troops = attackRes.remaining;
		sourceTerritory.troops = 1;
	}
	room.broadcastMapState();
}