module.exports = (attackDie, defenseDie) => {
	let a = attackDie;
	let d = defenseDie;
	let aR = [];
	let dR = [];
	while(a > 0) {
		aR.push(Math.ceil(Math.random() * 6));
		a--;
	}
	while(d > 0) {
		dR.push(Math.ceil(Math.random() * 6));
		d--;
	}
	aR.sort((a, b) => {return b - a});
	dR.sort((a, b) => {return b - a});
	let j = (aR.length<dR.length)?aR.length:dR.length;
	let i = 0;
	let dL = 0;
	let aL = 0;
	while(i<j) {
		if(aR[i] > dR[i]) {
			dL++;
		} else {
			aL++;
		};
		i++;
	}
	return {
		'srcLost': aL,
		'destLost': dL
	}
}