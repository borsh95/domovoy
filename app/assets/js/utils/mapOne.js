_utils.mapOne = function (interable, callback) {
	const m = this.map(interable, callback);
	return m.length > 1 ? m : m[0];
}


