_utils.map = function (interable, callback) {
	let result = [];

	for (let i = 0, max = interable.length; i < max; i++) {
		result.push(callback.call(interable[i], interable[i], i));
	}

	return result;
}


