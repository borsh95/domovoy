// координаты элемента от верха документа
_utils.getOffsetTop = function getOffsetTop(node) {
	return window.pageYOffset + node.getBoundingClientRect().top;
}