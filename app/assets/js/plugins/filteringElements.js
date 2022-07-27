//slinky menu
_plugins.filteringElements = function (selector, options) {
	const $parent = typeof selector === "string" ? document.querySelector(selector) : selector;
	const baseClass = "js-filtering-elements";
	const itemClass = baseClass + "__item";
	const itemHiddenClass = itemClass + "--hidden";

	const $filterCards = document.querySelectorAll('[class*="js-f-"]');
	const $filterToggle = document.querySelectorAll('[data-f]');

	$parent.addEventListener('click', function (e) {
		const $filterBtn = e.target.closest('[data-f]');

		if ($filterBtn) {
			if ($filterBtn.classList.contains('active')) return;

			const filterClass = 'js-f-' + e.target.dataset['f'];
			let hiddenElements = [];

			if ($parent.querySelector('[data-f].active')) {
				$parent.querySelector('[data-f].active').classList.remove('active');
			}

			$filterBtn.classList.add('active');

			for (const $card of $filterCards) {
				$card.classList.remove(itemHiddenClass);

				if (!$card.classList.contains(filterClass) && filterClass !== 'f-all') {
					$card.classList.add(itemHiddenClass);
					hiddenElements.push($card);
				}
			}

			$parent.dispatchEvent(new CustomEvent("filtering", {
				bubbles: true,
				cancelable: true,
				composed: true,
				detail: {
					trigger: $filterBtn,
					hiddenElements
				}
			}));
		}
	});

	$filterToggle[0].click();

	return $parent;
}
