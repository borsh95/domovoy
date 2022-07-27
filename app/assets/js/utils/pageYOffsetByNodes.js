_utils.pageYOffsetByNodes = function (node) {
	const args = Array.from(arguments);
	let summHeight = 0;

	if (args.length != 0) {
		summHeight = args.reduce(function (accum, item) {
			return accum + item.offsetHeight;
		}, summHeight)
	}

	return window.pageYOffset + summHeight;
}