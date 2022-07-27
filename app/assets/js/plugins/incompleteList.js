// incomplete list
// Изначальное колличество видимых можно узказать в data-incomplete-num
_plugins.incompleteList = (function (selector, options) {
	let $el = (typeof selector === 'string') ? document.querySelector(selector) : selector,
		$toggle = $el.querySelector('[incomplete-toggle]'),
		$toggleVal,
		$hiddenEls,
		visibleCount;

	const baseClass = 'js-incomplete';
	const disabledClass = baseClass + '--disabled';
	const listClass = baseClass + '-list';
	const itemClass = baseClass + '-item';
	const expandedListClass = listClass + '--expanded';
	const hiddenItemClass = itemClass + '--hide';
	const btnToggleClass = baseClass + '-toggle';
	const btnToggleMoreClass = btnToggleClass + '--more';

	const settings = {
		visibleBlocks: 8,
		positionToggle: 'outside',
		moreBtnContent: "Еще",
		lessBtnContent: "Скрыть",
	}

	Object.assign(settings, options);

	visibleCount = $el.dataset.visibleCount || settings.visibleBlocks;
	let childrenCount = $el.children.length - ($toggle ? 1 : 0); 
	$el.classList.add(disabledClass);


	if (childrenCount <= +visibleCount) return false;

	$el.classList.remove(disabledClass);

	$hiddenEls = Array.from($el.children).filter(($item, idx) => {
		if ($item.closest('[incomplete-toggle]')) return false;

		$item.classList.add(itemClass);

		if (idx > visibleCount - 1) {
			$item.classList.add(hiddenItemClass);
			return $item;
		}
	});

	if (!$toggle) {
		$toggle = document.createElement('button');
		$toggle.innerHTML = settings.moreBtnContent;

		if (settings.positionToggle === 'inside') {
			$el.insertAdjacentElement('beforeend', $toggle);
		} else {
			$el.insertAdjacentElement('afterend', $toggle);
		}
	}

	const toggleClasses = (settings.toggleClasses)
		? `${settings.toggleClassess} ${btnToggleClass} ${btnToggleMoreClass}`
		: `${btnToggleClass} ${btnToggleMoreClass}`;

	$toggle.className = $toggle.className + " " + toggleClasses;

	$toggleVal = $toggle.querySelector('[incomplete-toggle-val]') || $toggle;

	$toggle.addEventListener('click', function (e) {
		if ($el.classList.contains(expandedListClass)) {
			$el.classList.remove(expandedListClass);
			$toggle.classList.add(btnToggleMoreClass);
			$hiddenEls.map(item => { item.classList.add(hiddenItemClass) });
			$toggleVal.innerHTML = settings.moreBtnContent;
		} else {
			$toggle.classList.remove(btnToggleMoreClass);
			$el.classList.add(expandedListClass);
			$hiddenEls.map(item => { item.classList.remove(hiddenItemClass) });
			$toggleVal.innerHTML = settings.lessBtnContent;
		}
	});
});

const incompleteEls = document.querySelectorAll('.js-incomplete-list');
for (const incompleteEl of incompleteEls) {
	_plugins.incompleteList(incompleteEl);
}