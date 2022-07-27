_utils.isElem = function (selector) {
	try {
		return document.querySelector(selector) ? true : false;
	} catch (error) {
		return selector instanceof Element;
	}
}
