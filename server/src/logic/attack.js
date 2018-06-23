const polyroll = require('./polyroll');

module.exports = (room, player) => {
	let sourceId = player.attackSource,
		destId = player.attackDest,
		sourceTerritory = room.map[player.attackSource],
		destTerritory = room.map[player.attackDest],
		attackTroops = sourceTerritory.troops,
		defenseTroops = destTerritory.troops,
		attackRes = polyroll(attackTroops - 1, defenseTroops);
	if (attackRes.attackWon) {
		sourceTerritory.troops = 1;
		destTerritory.troops = attackRes.remaining;

		destTerritory.owner = player;
	} else if (attackRes.defenseWon) {
		destTerritory.troops = remaining;
		sourceTerritory.troops = 1;
	}
}