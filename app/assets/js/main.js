const myApp = {
	breakpoints: {
		xxl: 1920,
		xl: 1450,
		lg: 1230,
		md: 1024,
		sm: 768,
		xs: 480,
	},
	utils: {},
	plugins: {},
};
let _utils = myApp.utils;
let _plugins = myApp.plugins;
_utils.forEach = function (interable, callback) {
	this.map(interable, callback);
	return this;
}

// координаты элемента от верха документа
_utils.getOffsetTop = function getOffsetTop(node) {
	return window.pageYOffset + node.getBoundingClientRect().top;
}
_utils.isElem = function (selector) {
	try {
		return document.querySelector(selector) ? true : false;
	} catch (error) {
		return selector instanceof Element;
	}
}

_utils.map = function (interable, callback) {
	let result = [];

	for (let i = 0, max = interable.length; i < max; i++) {
		result.push(callback.call(interable[i], interable[i], i));
	}

	return result;
}



_utils.mapOne = function (interable, callback) {
	const m = this.map(interable, callback);
	return m.length > 1 ? m : m[0];
}



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
_utils.throttle = function (func, ms = 50) {
	let locked = false;

	return function () {
		if (locked) return;

		const context = this;
		const args = arguments;
		locked = true;

		setTimeout(() => {
			func.apply(context, args);
			locked = false;
		}, ms)
	}
}
//slinky menu
function broMenu(selector, options) {
	const $menu = typeof selector === "string" ? document.querySelector(selector) : selector;
	const containerMenu = $menu.querySelector('ul');
	const $level_1 = $menu.lastElementChild;
	const $subMenuList = $menu.querySelectorAll('li > ul');
	const $subMenuLinks = $menu.querySelectorAll('li > a');
	let activated;

	let defaulOptions = {
		nextBtn: '.bro-menu__next-arr',
		arrow: `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M12.219 2.281L10.78 3.72 18.062 11H2v2h16.063l-7.282 7.281 1.438 1.438 9-9 .687-.719-.687-.719z" />
		</svg>
	`
	}

	Object.assign(defaulOptions, options);

	let $activeUl;
	let translate = 0;

	const method = {
		init() {
			if (activated) return;

			$menu.classList.add('bro-menu');
			containerMenu.classList.add('bro-menu__container');

			for (let submenu of $subMenuList) {
				const link = submenu.parentElement.querySelector('li > a');
				submenu.classList.add('bro-menu__submenu');
				link.classList.add('bro-menu__next');

				_addBtnBack(submenu, link);
				_addBtnNext(link);

				activated = true;
			}

			for (const $link of $subMenuLinks) {
				$link.classList.add('active');
			}

			$menu.addEventListener('click', clickHandler);

			window.addEventListener('resize', _setHeighMenu);
		},

		destroy() {
			if (!activated) return;

			const $arrNodes = $menu.querySelectorAll('.bro-menu__arr');

			$menu.removeEventListener('click', clickHandler);
			window.removeEventListener('resize', _setHeighMenu);

			for (const $link of $menu.querySelectorAll('.link')) {
				if ($link.classList.contains('bro-menu__back')) {
					$link.closest('li').remove();
					continue;
				}

				for (const $arr of $arrNodes) {
					$arr.remove();
				}

				$link.classList.remove('link');
				$link.classList.remove('bro-menu__next');
			}

			for (let submenu of $subMenuList) {
				submenu.classList.remove('bro-menu__submenu');
			}

			$activeUl && $activeUl.classList.remove('active');
			$menu.classList.remove('bro-menu');
			containerMenu.classList.remove('bro-menu__container')

			$menu.style.height = '';
			$level_1.style.transform = ``;
			translate = 0;
			activated = false;
		}
	}

	function clickHandler(e) {
		const target = e.target;

		if (target.closest(defaulOptions.nextBtn)) {
			e.preventDefault();

			const $nestedMenu = target.closest('li').querySelector('ul');

			if ($activeUl) $activeUl.classList.remove('active');

			$nestedMenu.classList.add('active');
			$nestedMenu.style.visibility = 'visible';
			translate -= 100;

			$level_1.style.transform = `translateX(${translate}%)`;
			$activeUl = $nestedMenu;

			scrollToVisible($activeUl);
			_setHeighMenu();
		}
		else if (target.closest('.bro-menu__back')) {
			e.preventDefault();

			const $upperMenu = $activeUl.parentElement.closest('ul');
			$upperMenu.classList.add('active');

			$activeUl.style.visibility = '';

			translate += 100;

			$level_1.style.transform = `translateX(${translate}%)`;
			$activeUl.classList.remove('active');
			$activeUl = $upperMenu;
			_setHeighMenu();
		}
	}

	function _addBtnNext(elem) {
		elem.classList.add('link')
		elem.insertAdjacentHTML('beforeend', `
			<span class="bro-menu__next-arr">
				${defaulOptions.arrow}
			</span>
		`);

		elem.lastElementChild.classList.add('bro-menu__arr');
	}

	function _addBtnBack(elem, link) {
		const href = link.getAttribute('href');

		elem.insertAdjacentHTML('afterbegin', `
		<li>
			<a class="bro-menu__back link">
				${defaulOptions.arrow}
				${link.textContent}
			</a>
		</li>
	`);
	}

	function _setHeighMenu() {
		if (!$activeUl) return;

		$menu.style.height = $activeUl.offsetHeight + "px";
	}

	function scrollToVisible(el) {
		if (_getPosAbsWindow(el) > window.pageYOffset) return;

		backToTop(-10, _getPos(el));
	}

	function _getPosAbsWindow(elem) {
		const offsetTop = elem.getBoundingClientRect().top;

		return offsetTop - window.pageYOffset;
	}

	function _getPos(el) {
		return el.getBoundingClientRect().top + window.pageYOffset;
	}

	function backToTop(interval, to) {
		if (window.pageYOffset <= to) return;

		window.scrollBy(0, interval);
		setTimeout(() => {
			backToTop(interval, to)
		}, 0);
	}

	return method;
}
// bTabs
_plugins.bTabs = function (target) {
	let _elemTabs = (typeof target === 'string' ? document.querySelector(target) : target),
		_eventTabsShow,
		_showTab = function (tabsLinkTarget) {
			var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
			tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
			tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.b-tabs__link.active');
			tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.b-tabs__pane.active');
			// если следующая вкладка равна активной, то завершаем работу
			if (tabsLinkTarget === tabsLinkActive) return;
			// удаляем классы у текущих активных элементов
			if (tabsLinkActive !== null) tabsLinkActive.classList.remove('active');

			if (tabsPaneShow !== null) tabsPaneShow.classList.remove('active');
			// добавляем классы к элементам (в завимости от выбранной вкладки)
			tabsLinkTarget.classList.add('active');
			tabsPaneTarget.classList.add('active');
			document.dispatchEvent(_eventTabsShow);
		},
		_switchTabTo = function (tabsLinkIndex) {
			var tabsLinks = _elemTabs.querySelectorAll('.b-tabs__link');
			if (tabsLinks.length > 0) {
				if (tabsLinkIndex > tabsLinks.length) {
					tabsLinkIndex = tabsLinks.length;
				} else if (tabsLinkIndex < 1) {
					tabsLinkIndex = 1;
				}
				_showTab(tabsLinks[tabsLinkIndex - 1]);
			}
		};

	_eventTabsShow = new CustomEvent('tab.show', { detail: _elemTabs });

	_elemTabs.addEventListener('click', function (e) {
		var tabsLinkTarget = e.target;
		// завершаем выполнение функции, если кликнули не по ссылке
		if (!tabsLinkTarget.classList.contains('b-tabs__link')) return;

		e.preventDefault();
		_showTab(tabsLinkTarget);
	});

	return {
		showTab: function (target) {
			_showTab(target);
		},
		switchTabTo: function (index) {
			_switchTabTo(index);
		}
	}
};
/***** CUSTOM PLUGIN ******/
document.addEventListener('click', function (e) {
	const $target = e.target;

	if ($target.closest('[data-copy]:not(.disabled)')) {
		const $dataCopyEl = $target.closest('[data-copy]');
		$dataCopyEl.classList.add('disabled');
		navigator.clipboard.writeText($dataCopyEl.dataset.copy);

		const notificationEl = document.createElement('div');
		notificationEl.className = 'copy-notification';
		notificationEl.textContent = 'Скопированно в буфер обмена';
		$dataCopyEl.append(notificationEl);

		let left = 0 + ($dataCopyEl.offsetWidth - notificationEl.offsetWidth) / 2;
		notificationEl.style.left = left + "px";

		// спозиционируем его сверху от аннотируемого элемента (top-center)
		let coordsNotify = notificationEl.getBoundingClientRect();
		const { top: coordTop, right: coordRight, bottom: coordBottom, left: coordLeft } = coordsNotify;

		if (coordLeft < 0) {
			notificationEl.style.left = "0px";
		}

		if (coordTop < 0) {
			notificationEl.style.top = "100%";
			notificationEl.style.bottom = "auto";
		}

		setTimeout(() => { notificationEl.classList.add('copy-notification--animated') }, 10);
		setTimeout(() => { notificationEl.classList.remove('copy-notification--animated') }, 2010);
		setTimeout(() => {
			notificationEl.remove();
			$dataCopyEl.classList.remove('disabled');
		}, 2500);
	}
});
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

_plugins.fixedElemTop = function (selector) {
	const $el = typeof selector === 'string' ? document.querySelector(selector) : selector;
	const $startingPlace = document.createElement('div');
	const $header = document.querySelector('header');
	$el.insertAdjacentElement('beforebegin', $startingPlace);

	window.addEventListener('scroll', _utils.throttle(
		function () {
			let pageYOffset = window.pageYOffset;
			let isFixedHeader = false;

			if (getComputedStyle($header).position === 'fixed') {
				pageYOffset = _utils.pageYOffsetByNodes($header);
				isFixedHeader = true;
			}

			if (pageYOffset > _utils.getOffsetTop($startingPlace)) {
				$startingPlace.style.height = $el.offsetHeight + 'px';
				$el.classList.add('fixed');
				$el.style.top = isFixedHeader ? $header.offsetHeight + 'px' : '';
			} else {
				$startingPlace.style.height = '';
				$el.classList.remove('fixed');
			}
		}
	), 70)
};
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
// (function (myApp) {
// 	const menu = document.querySelector('#menu') || document.querySelector('.menu');
// 	const mediaQuery = window.matchMedia(`(max-width: ${myApp.breakpoints.md}px)`);
// 	window.m = mediaQuery;
// 	_setLvls(menu, 1);

// 	//Hamburger открытия мобильного меню
// 	if (document.querySelector('.js-toggle-burger')) {
// 		const toggleBtnClass = 'js-toggle-burger';
// 		const bodyEl = document.querySelector('body');
// 		const header = document.querySelector('header');
// 		const $toggleBurger = document.querySelector('.' + toggleBtnClass);
// 		const burgerBlock = document.querySelector('.header__burger');
// 		const burgerInner = burgerBlock.querySelector('.header__burger-inner');

// 		document.addEventListener('click', function (e) {
// 			let $target = e.target;

// 			if ($toggleBurger.contains($target)) {
// 				changingStateHamburger($toggleBurger, 'active');

// 				burgerBlock.style.top = header.offsetHeight + 'px';

// 				let isActive = $toggleBurger.classList.contains('active');

// 				burgerBlock.classList[isActive ? 'add' : 'remove']('open');
// 				burgerInner.style.maxHeight = (isActive) ? `calc(100vh - ${header.offsetHeight}px)` : '';
// 				bodyEl.style.overflow = (isActive) ? 'hidden' : '';
// 			} else if (!burgerInner.contains($target) && $toggleBurger.classList.contains('active')) {
// 				changingStateHamburger($toggleBurger, 'active');
// 				burgerBlock.classList.remove('open');
// 				burgerInner.style.maxHeight = '';
// 				bodyEl.style.overflow = '';
// 			}
// 		});

// 		window.addEventListener('resize', function () {
// 			if (window.innerWidth > myApp.breakpoints.md && burgerBlock.classList.contains('open')) {
// 				changingStateHamburger($toggleBurger, 'active');
// 				burgerBlock.classList.remove('open');
// 				bodyEl.style.overflow = '';
// 			}
// 		});

// 		burgerBlock.addEventListener('click', function (e) {
// 			if (!e.target.contains(burgerBlock)) return;

// 			hamburgerBtn.classList.remove('active');
// 			burgerBlock.classList.remove('open');
// 			bodyEl.style.overflow = '';
// 		});
// 	}

// 	// под меню с гамбургером внутри основного меню
// 	if (document.querySelector('.j-toggle-hang')) {
// 		const hangItemClass = 'menu__item--hang';
// 		const hangOpenItemClass = 'menu__item--hang_open';
// 		const toggleHangItem = 'j-toggle-hang';

// 		document.addEventListener('click', function (e) {
// 			let $target = e.target;

// 			if ($target.closest('.' + toggleHangItem)) {
// 				e.preventDefault();
// 				$target = $target.closest('.' + toggleHangItem);
// 				const $currentItemHang = $target.closest('.' + hangItemClass);

// 				$target.classList.toggle('active');
// 				$currentItemHang.classList.toggle(hangOpenItemClass);

// 				if ($target.querySelector('.hamburger')) {
// 					$target.querySelector('.hamburger').classList.toggle('active');
// 				}
// 			} else if (!$target.closest('.' + hangItemClass) && document.querySelector('.' + hangOpenItemClass)) {
// 				if (window.matchMedia(`(max-width: ${myApp.breakpoints.md}px)`).matches) return;

// 				let $openItemHang = document.querySelector('.' + hangOpenItemClass);
// 				let $activeToggleHang = $openItemHang.querySelector('.j-toggle-hang');

// 				$openItemHang.classList.remove(hangOpenItemClass);
// 				$activeToggleHang.classList.remove('active');

// 				if ($activeToggleHang.querySelector('.hamburger')) {
// 					$activeToggleHang.querySelector('.hamburger').classList.toggle('active');
// 				}
// 			}
// 		})
// 	}

// 	$(menu).on('click', '.js-toggle-submenu', function (e) {
// 		e.preventDefault();
// 		const $trigger = e.target.closest('.js-toggle-submenu');
// 		const $parentItem = e.target.closest('.menu__item');
// 		const $submenu = $parentItem.querySelector('.menu__submenu');

// 		if (!$submenu) return;

// 		$($trigger).toggleClass('js-toggle-submenu--active');
// 		$($parentItem).toggleClass('menu__item--open');
// 		$($submenu).slideToggle(300);
// 	});

// 	function changingStateHamburger($hamburger, changeClass) {
// 		if ($hamburger.classList.contains(changeClass)) {
// 			$hamburger.classList.remove(changeClass);
// 			$hamburger.setAttribute('aria-expanded', 'false');
// 			$hamburger.setAttribute('aria-label', 'Открыть меню');
// 		} else {
// 			$hamburger.classList.add(changeClass);
// 			$hamburger.setAttribute('aria-expanded', 'true');
// 			$hamburger.setAttribute('aria-label', 'Закрыть меню');
// 		}
// 	}

// 	/**
// 	 * Устанавливает lvl submenu
// 	 *
// 	 * @param {Element}
// 	 * @return {undefined}
// 	*/
// 	function _setLvls(menu, initialLvl) {
// 		const $childrenItems = menu.children;
// 		menu.classList.add(`lvl-${initialLvl}`);

// 		for (const $item of $childrenItems) {
// 			const $subMenu = $item.querySelector(`.menu__submenu`);

// 			if ($subMenu) _setLvls($subMenu, initialLvl + 1);
// 		}
// 	}

// }(myApp));

_plugins.NumberSlider = (function () {
	function _plugin(selector, options = {}) {
		this.$el = typeof selector === 'string' ? document.querySelector(selector)
			: selector;
		this.options = Object.assign({
			inputClass: "js-number-slider-input",
			addClass: "js-number-slider-add",
			reduceClass: "js-number-slider-reduce",
			minValue: 1,
		}, options);
		this.$input = this.$el.querySelector(`.${this.options.inputClass}`);
		this.minValue = this.$input.getAttribute('min') || this.options.minValue;

		this.init();
	}

	_plugin.prototype.init = function () {
		this.$el.addEventListener('click', this.clickHander.bind(this));
		this.$input.addEventListener('change', this.inputChangeHandler.bind(this));
	}

	_plugin.prototype.clickHander = function (e) {
		if (e.target.closest(`.${this.options.addClass}`)) {
			const old = parseFloat(this.$input.value) + 1;
			this.$input.value = isFinite(old) ? old : this.minValue;
		} else if (e.target.closest(`.${this.options.reduceClass}`)) {
			let oldValue = parseFloat(this.$input.value);
			if (isNaN(oldValue)) return this.$input.value = this.minValue;
			this.$input.value = (oldValue - 1 <= this.minValue) ? this.minValue : --oldValue;
		}
	}

	_plugin.prototype.inputChangeHandler = function (e) {
		let value = parseFloat(this.$input.value);
		let newValue;

		if (isNaN(value) || value < this.options.minValue) {
			newValue = this.options.minValue;
		} else {
			newValue = value;
		}

		this.$input.value = newValue;
	}

	return _plugin;
}());


// анимация скрола окна браузера
_plugins.scrollWindow = function func() {
	if (func.instance) {
		return func.instance;
	}

	let scrollAnimationId = 0;
	let currentScroll = window.pageYOffset;
	let scrolls = false;

	function _startAmimationScroll(newScrollY, callback) {
		if (!scrolls) {
			currentScroll = window.pageYOffset;
			scrolls = true;
		}

		scrollAnimationId++;
		const deltaScroll = (newScrollY - currentScroll);

		currentScroll += deltaScroll * 0.15;
		window.scrollTo(0, currentScroll);

		if (Math.abs(deltaScroll) > 5) {
			scrollAnimationId = window.requestAnimationFrame(function () {
				_startAmimationScroll(newScrollY);
			})
		} else {
			window.scrollTo(0, newScrollY);
			stopAnimationScroll();

			if (typeof callback === 'function') callback();
		}
	}

	function stopAnimationScroll() {
		window.cancelAnimationFrame(scrollAnimationId);
		scrolls = false;
	}

	return func.instance = {
		get scrollAnimationId() {
			return scrollAnimationId;
		},
		startAmimationScroll() {
			stopAnimationScroll();
			_startAmimationScroll.apply(this, arguments);
		},
		stopAnimationScroll,
	}
};


//slider
_plugins.slider = function (selector, option = {}) {
	const $slider = (typeof selector === 'string') ? document.querySelector(selector) : selector;
	const $sliderWrap = $slider.closest('.slider-wrap');

	const setings = {
		navigation: $sliderWrap.querySelector('.slider-nav'),
		pagination: $sliderWrap.querySelector('.slider-pagination'),
		scrollbar: $sliderWrap.querySelector('.slider-scrollbar'),
		options: {
			watchOverflow: true,
			...option,
		}
	}

	Object.assign(setings.options, {
		watchSlidesVisibility: true,
		watchOverflow: true,
		autoplay: (+$slider.dataset.sliderAutoplay > 0) ? {
			delay: +$slider.dataset.sliderAutoplay,
			pauseOnMouseEnter: true,
			disableOnInteraction: false,
		} : '',
		navigation: setings.navigation ? {
			nextEl: $sliderWrap.querySelector('.slider-arr--next'),
			prevEl: $sliderWrap.querySelector('.slider-arr--prev'),
		} : '',
		scrollbar: setings.scrollbar ? {
			el: setings.scrollbar,
			draggable: true,
		} : '',
		pagination: setings.pagination ? {
			el: $sliderWrap.querySelector('.slider-pagination'),
			clickable: true,
		} : '',
	});

	return new Swiper($slider, setings.options);
};

(function() {
	function findIndex($obj, $item) {
		let index = null;

		$obj.each((i, item) => {
			if (item === $item[0]) {
				index = i;
			}
		});
		
		return index;
	}

	function initTabsItem($tabs, $tabsItemActive) {
		const dataTabs = $tabs.attr('data-tabs');

		if (dataTabs) {
			const $itemsTabs = $tabs.find('.tabs__item');

			$itemsTabs.each(function(i) {
				const $sectionsTabs = $(`[data-tabs="${dataTabs}, ${i}"]`);
				const index = findIndex($itemsTabs, $tabsItemActive);
				const $unloadedSrc = $sectionsTabs.find('[data-src]'); 

				if (index !== i) {
					$sectionsTabs.attr('hidden', true);
				} else {
					$(`[data-tabs="${dataTabs}, ${index}"]`).removeAttr('hidden');

					if ($unloadedSrc.length) {
						$unloadedSrc.each((i, item) => {
							const src = $(item).data('src');
							
							$(item).attr('src', src).removeAttr('data-src');
						});
					}
				}
			});
		}
	
		$tabs.trigger('tabs:change');
	}
	
	$('.tabs').each(function() {
		const $tabs = $(this);
		let $tabsItemActive = $tabs.find('.tabs__item.active');
	
		if ($tabsItemActive.length !== 1) {
			const $tabsItems = $tabs.find('.tabs__item');
	
			$tabsItems.removeClass('active');
			$tabsItems.eq(0).addClass('active');
			$tabsItemActive = $tabsItems.eq(0);
		}
	
		initTabsItem($tabs, $tabsItemActive);
	
		$tabs.trigger("tabs:init");
	});
	
	$(document).on('click', '.tabs__item', function() {
		const $tabsItem = $(this);
		const $tabs = $tabsItem.closest('.tabs');
		const $tabsItems = $tabs.find('.tabs__item');
	
		$tabsItems.not($tabsItem).removeClass('active');
		$tabsItem.addClass('active');
	
		initTabsItem($tabs, $tabsItem);
	});
	
}());
//	modal window
_plugins.modalWindow = (function () {
	const $body = document.querySelector('body'),
		$modals = document.querySelectorAll('.v-modal'),
		triggerSelector = '[data-toggle-modal]',
		btnCloseSelector = '[data-dissmis="modal"]';

	document.addEventListener('click', function (e) {
		const $trigger = e.target.closest(`${triggerSelector}`);

		if ($trigger) {
			const typeModal = $trigger.dataset['toggleModal'];

			if (!typeModal) return;

			for (let $modal of $modals) {
				if ($modal.id && $modal.id === typeModal) {
					$modal.classList.add('active');

					e.preventDefault();
					const scrollBarWidth = window.innerWidth - $body.offsetWidth;
					$body.style.overflow = 'hidden';
					$body.style.paddingRight = scrollBarWidth + "px";
					break;
				}
			}
		} else if (e.target.classList.contains('v-modal') || e.target.closest(`${btnCloseSelector}`)) {
			e.target.closest('.v-modal').classList.remove('active');
			$body.style.overflow = '';
			$body.style.paddingRight = "";
		}

		for (const $modal of $modals) {
			console.log($modal.id);
			if ($modal.id === 'flash') {
				const periodDisplay = $modal.dataset.periodDisplay || 2;
	
				if (!localStorage.lastVisit) {
					show($modal);
				} else if ((Date.now() - +localStorage.lastVisit) / (periodDisplay * 1000 * 3600) >= 1) {
					show($modal);
				}
			}
		}
	
		function show(el) {
			localStorage.setItem('lastVisit', Date.now());
	
			el.classList.add('active');
		}
	});
}());
//video
(function () {
	findVideos();

	function findVideos() {
		let videos = document.querySelectorAll('.video');

		for (let i = 0; i < videos.length; i++) {
			setupVideo(videos[i]);
		}
	}

	// ленивая загрузка видео 
	function setupVideo(video) {
		let link = video.querySelector('.video__link');
		const hrefLink = link.href;
		let media = video.querySelector('.video__media');
		let button = video.querySelector('.video__button');
		let deletedLength = 'https://youtu.be/'.length;
		let videoId = hrefLink.substring(deletedLength, hrefLink.length);
		let youtubeImgSrc = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg';

		media.src = youtubeImgSrc;

		video.addEventListener('click', () => {
			let iframe = createIframe(videoId);

			link.remove();
			button.remove();
			video.appendChild(iframe);
		});

		link.removeAttribute('href');
		video.classList.add('video--enabled');
	}

	function createIframe(id) {
		let iframe = document.createElement('iframe');

		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write;');
		iframe.setAttribute('src', generateURL(id));
		iframe.classList.add('video__media');

		return iframe;
	}

	function generateURL(id) {
		let query = '?rel=0&showinfo=1&autoplay=1';

		return 'https://www.youtube.com/embed/' + id + query;
	}
}());
(function (app) {
	const _utils = app.utils;
	const _plugins = app.plugins;
	const $html = document.documentElement;
	const $body = document.querySelector('body');
	app.$header = document.querySelector('header') || document.querySelector('.header');
	app.scrollingWindow = _plugins.scrollWindow();

	app.isFixedHeader && $html.classList.add('is-fixed-header');

	// 	main slider 
	if (_utils.isElem('.main-slider')) {
		const sliderNode = document.querySelector('.main-slider');

		const swiper = _plugins.slider(sliderNode, {
			grabCursor: true,
			noSwipingClass: 'btn',
			watchSlidesVisibility: true,
			watchOverflow: true,
			speed: 1000,
			autoplay: {
				delay: 4000,
				pauseOnMouseEnter: true,
				disableOnInteraction: false,
			}
		});
	}

	// 	main slider 
	if (_utils.isElem('.catalog-slider')) {
		const sliderEls = document.querySelectorAll('.catalog-slider');

		for (const sliderEl of sliderEls) {
			const swiper = _plugins.slider(sliderEl, {
				grabCursor: true,
				watchSlidesVisibility: true,
				watchOverflow: true,
				slidesPerView: 'auto',
				spaceBetween: 5,
				speed: 1000,
				autoplay: {
					delay: 4000,
					pauseOnMouseEnter: true,
					disableOnInteraction: false,
				},
				breakpoints: {
					300: {
						enabled: false,
					},
					[app.breakpoints.sm]: {
						enabled: true
					}
				}
			});
		}
	}

	// products slider	
	if (_utils.isElem('.products-slider')) {
		const $productsSliders = document.querySelectorAll('.products-slider');

		_utils.forEach($productsSliders, function ($slider) {
			const swiper = _plugins.slider($slider, {
				grabCursor: true,
				loopAdditionalSlides: 1,
				watchSlidesProgress: true,
				watchOverflow: true,
				dynamicBullets: true,
				spaceBetween: 0,
				speed: 1000,
				breakpoints: {
					300: {
						slidesPerView: 1,
						slidesPerGroup: 1,
					},
					500: {
						slidesPerView: 2,
						slidesPerGroup: 2,
					},
					[app.breakpoints.md + 1]: {
						slidesPerView: 2,
						slidesPerGroup: 2,
					},
					[app.breakpoints.lg + 1]: {
						slidesPerView: 3,
						slidesPerGroup: 3,
					},
				}
			});
		});
	}

	//fixed header
	if (_utils.isElem('header')) {
		showHeader('header');
		
		function showHeader(el) {
			const $el = (typeof el === 'string') ? document.querySelector(el) : el;
			const $htmlEl = document.documentElement;
			let fixingIndent = $el.dataset.fixingIndet || $el.offsetHeight + 40;
			let isFixed = false;

			_scrollHandler();

			window.addEventListener('scroll', _scrollHandler)

			window.addEventListener('resize', function () {
				fixingIndent = $el.dataset.fixingIndet || $el.offsetHeight + 40;
			})

			function _scrollHandler() {
				if (window.pageYOffset > fixingIndent) {
					show();
				} else if (window.pageYOffset < fixingIndent) {
					fixed();
				}
			}

			function show() {
				if (isFixed) return;

				$htmlEl.style.paddingTop = $el.offsetHeight + "px";
				$el.classList.add('fixed');
				isFixed = true;
			}

			function fixed() {
				if (!isFixed) return;

				$el.classList.remove('fixed');
				$htmlEl.style.paddingTop = '';
				isFixed = false;
			}

			return {
				show,
				fixed,
			}
		}
	}

	if ($(".filters").length) {
		const $filtersBlock = $(".filters");

		$filtersBlock.on("click", function(e) {
			let targeEl = e.target;

			if (targeEl.closest('.filters__field-title')) {
				const $parent = $(targeEl).closest(".filters__field");
				const $innerField = $parent.find('.filters__field-box');

				if ($parent.hasClass("filters__field--unopened")) {
					$parent.removeClass("filters__field--unopened");
				} else {
					$parent.addClass("filters__field--unopened");
				}
				
				$innerField.slideToggle(300);
			}
		})
	}

	// btn top 
	if (_utils.isElem('.btn-top')) {
		const btnEl = document.querySelector('.btn-top');

		window.addEventListener('scroll', _utils.throttle(function() {
			console.log(332);
			if (window.pageYOffset > (window.innerHeight / 2)) {
				btnEl.classList.add('active');
			} else if (window.pageYOffset < (window.innerHeight / 2) && btnEl.classList.contains('active')) {
				btnEl.classList.remove('active');
			}
		}, 200));
	}

	// product gallery
	// if (_utils.isElem('.gallery')) {
	// 	for (const galleryEl of document.querySelectorAll('.gallery')) {
	// 		gallery(galleryEl);
	// 	}

	// 	function gallery($el) {
	// 		const $fullSlider = $el.querySelector('.gallery__slider');
	// 		const $thumbsSlider = $el.querySelector('.gallery__thumbs');

	// 		/* thumbs */
	// 		let galleryThumbs = new Swiper($thumbsSlider, {
	// 			spaceBetween: 30,
	// 			slidesPerView: "auto",
	// 			watchSlidesProgress: true,
	// 			freeMode: {
	// 				enabled: true,
	// 				sticky: true,
	// 			},
	// 			breakpoints: {
	// 				300: {
	// 					spaceBetween: 17,
	// 				},
	// 				[app.breakpoints.sm]: {
	// 					spaceBetween: 30,
	// 				}
	// 			},
	// 			keyboard: {
	// 				enabled: true,
	// 				onlyInViewport: false
	// 			},
	// 			mousewheel: true,
	// 		});

	// 		let galleryFull = new Swiper($fullSlider, {
	// 			spaceBetween: 10,
	// 			slidesPerView: "auto",
	// 			// autoplay: {
	// 			// 	delay: 5000
	// 			// },
	// 			// navigation: {
	// 			// 	prevEl: $fullSlider.parentElement.querySelector('.slider-arr--prev'),
	// 			// 	nextEl: $fullSlider.parentElement.querySelector('.slider-arr--next'),
	// 			// },
	// 			// keyboard: {
	// 			// 	enabled: true,
	// 			// 	onlyInViewport: false
	// 			// },
	// 			thumbs: {
	// 				swiper: galleryThumbs,
	// 			},
	// 		});
	// 	}
	// }

	

	// if (document.querySelector('.sort')) {
	// 	const sort = document.querySelector('.sort');
	// 	const valueSort = sort.querySelector('.sort__val');
	// 	const activeItem = sort.querySelector('.sort__item.active');
	// 	const toggleClass = 'j-sort-toggle';

	// 	if (activeItem) {
	// 		console.log(activeItem);
	// 		valueSort.textContent = activeItem.textContent;
	// 	}

	// 	document.addEventListener('click', function (e) {
	// 		if (e.target.closest(`.${toggleClass}`)) {
	// 			sort.classList.toggle('active');
	// 		} else if (e.target.closest('.sort__item')) {
	// 			const sortItem = e.target.closest('.sort__item');

	// 			if (sortItem.classList.contains('active')) return;

	// 			valueSort.textContent = sortItem.textContent;
	// 		}

	// 		if (!e.target.closest(`.${toggleClass}`)) {
	// 			sort.classList.remove('active');
	// 		}
	// 	});
	// }

	// if (_utils.isElem('.number-slider')) {
	// 	_utils.forEach(document.querySelectorAll('.number-slider'), function ($slider) {
	// 		new _plugins.NumberSlider($slider);
	// 	})
	// }

	// // фильтрация элементов
	// if (_utils.isElem('.js-bFilter')) {
	// 	for (const $el of document.querySelectorAll('.js-bFilter')) {
	// 		bFilter($el);
	// 	}
	// }

	// // search
	// if (_utils.isElem('[data-search-toggle]') && _utils.isElem('[data-search-panel]')) {
	// 	const $html = document.documentElement;
	// 	const $searchPanel = document.querySelector('[data-search-panel]');
	// 	const $input = $searchPanel.querySelector('input[type="search"]');
	// 	const $innerPanel = $searchPanel.querySelector('.search-panel__inner');
	// 	const $clearBtn = $searchPanel.querySelector('.search-panel__clear')
	// 	const $searchBtnSelector = '[data-search-toggle]';
	// 	const $closePanelSelector = '[data-search-close]';
	// 	const toggleClass = 'open';

	// 	document.addEventListener('click', function (e) {
	// 		if (e.target.closest($searchBtnSelector)) {
	// 			$searchPanel.classList.toggle(toggleClass);

	// 			if ($searchPanel.classList.contains(toggleClass)) {
	// 				if ($input) $input.focus();
	// 				toggleOverflowDocument(true);
	// 			} else {
	// 				toggleOverflowDocument(false);
	// 			}
	// 		} else if ($clearBtn.contains(e.target)) {
	// 			$input.value = "";
	// 			$input.focus();
	// 			$clearBtn.classList.remove('is-clear');
	// 		} else if (e.target.closest($closePanelSelector)
	// 			|| (!e.target.closest('.search-panel__inner') && $searchPanel.classList.contains('open'))) {
	// 			$searchPanel.classList.remove(toggleClass);
	// 			$input.value = '';
	// 			$clearBtn.classList.remove('is-clear');
	// 			toggleOverflowDocument(false);
	// 		}
	// 	});

	// 	$input.addEventListener('keyup', function (e) {
	// 		if (this.value.length !== 0) {
	// 			$clearBtn.classList.add('is-clear');
	// 		} else {
	// 			$clearBtn.classList.remove('is-clear');
	// 		}
	// 	});

	// 	function toggleOverflowDocument(is) {
	// 		if (is) {
	// 			const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
	// 			$html.style.overflow = 'hidden';
	// 			$html.style.paddingRight = scrollBarWidth + "px";
	// 		} else {
	// 			$html.style.overflow = '';
	// 			$html.style.paddingRight = "";
	// 		}
	// 	}
	// }

	// фиксация навигации продукта
	// if (_utils.isElem('.nav-panel')) {
	// 	const $navPanel = document.querySelector('.nav-panel');

	// 	_plugins.fixedElemTop($navPanel);

	// 	const navLinkSelector = '[href*="#"]';
	// 	const $navLinks = $navPanel.querySelectorAll(navLinkSelector);
	// 	const sections = [];
	// 	let indexActiveLink = null;

	// 	for (const $navLink of $navLinks) {
	// 		const hash = $navLink.hash;
	// 		const section = document.querySelector(hash);

	// 		if (section) {
	// 			sections.push(document.querySelector(hash));
	// 		}
	// 	}

	// 	if (sections.length === 0) return;

	// 	setActiveLinkByScroll();

	// 	window.addEventListener('scroll', setActiveLinkByScroll);

	// 	$navPanel.addEventListener('click', function (e) {
	// 		const link = e.target.closest('a[href*="#"]');

	// 		if (!link) return;

	// 		e.preventDefault();
	// 		const sectionId = link.getAttribute('href');
	// 		const section = document.querySelector(sectionId);

	// 		if (!section) return;

	// 		const sectionOffsetTop = _utils.getOffsetTop(section);

	// 		let scrollPoint = sectionOffsetTop - $navPanel.offsetHeight + 10;
	// 		if (app.isFixedHeader) {
	// 			scrollPoint = scrollPoint - app.$header.offsetHeight;
	// 		}

	// 		window.scrollTo(0, scrollPoint);
	// 	})

	// 	function setActiveLinkByScroll() {
	// 		const topSections = sections.map($section => {
	// 			return _utils.getOffsetTop($section);
	// 		});

	// 		let currentActiveIndex = null;
	// 		const firstSectionTopCoords = topSections[0];
	// 		const lastSectionBottomCoords = topSections[topSections.length - 1] + sections[topSections.length - 1].offsetHeight;

	// 		let offsetTopByNodes = _utils.pageYOffsetByNodes($navPanel);

	// 		if (app.isFixedHeader) {
	// 			offsetTopByNodes = _utils.pageYOffsetByNodes($navPanel, app.$header);
	// 		}

	// 		if (offsetTopByNodes < firstSectionTopCoords || offsetTopByNodes > lastSectionBottomCoords) {
	// 			if (indexActiveLink === null) return;

	// 			$navLinks[indexActiveLink].classList.remove('active');
	// 			indexActiveLink = null;
	// 			return;
	// 		}

	// 		for (let i = 0; i < topSections.length; i++) {
	// 			if (offsetTopByNodes > topSections[i]) {
	// 				currentActiveIndex = i;
	// 			}
	// 		}

	// 		if (indexActiveLink !== currentActiveIndex) {
	// 			indexActiveLink = currentActiveIndex;
	// 			changeNavActive($navLinks[indexActiveLink])
	// 		}
	// 	}

	// 	function changeNavActive(newNavLinkNode) {
	// 		for (let i = 0; i < $navLinks.length; i++) {
	// 			$navLinks[i].classList.remove('active');
	// 		}

	// 		newNavLinkNode.classList.add('active');
	// 	}
	// }

	// tel mask
	// if (document.querySelector('input[type="tel"]')) {
	// 	const inputsTel = document.querySelectorAll('input[type="tel"]');
	// 	const im = new Inputmask('+375 (99) 999-99-99');
	// 	im.mask(inputsTel);
	// }
}(myApp));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UuanMiLCJmb3JFYWNoLmpzIiwiZ2V0T2Zmc2V0VG9wLmpzIiwiaXNFbGVtLmpzIiwibWFwLmpzIiwibWFwT25lLmpzIiwicGFnZVlPZmZzZXRCeU5vZGVzLmpzIiwidGhyb3R0bGUuanMiLCJicm8tbWVudS5qcyIsImJUYWJzLmpzIiwiY29weS5qcyIsImZpbHRlcmluZ0VsZW1lbnRzLmpzIiwiZml4ZWRFbGVtZW50LmpzIiwiaW5jb21wbGV0ZUxpc3QuanMiLCJtYWluLW1lbnUuanMiLCJudW1iZXJTbGlkZXIuanMiLCJzY3JvbGxXaW5kb3cuanMiLCJzbGlkZXIuanMiLCJ0YWJzLmpzIiwidi1tb2RhbC5qcyIsInZpZGVvLmpzIiwiaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbXlBcHAgPSB7XHJcblx0YnJlYWtwb2ludHM6IHtcclxuXHRcdHh4bDogMTkyMCxcclxuXHRcdHhsOiAxNDUwLFxyXG5cdFx0bGc6IDEyMzAsXHJcblx0XHRtZDogMTAyNCxcclxuXHRcdHNtOiA3NjgsXHJcblx0XHR4czogNDgwLFxyXG5cdH0sXHJcblx0dXRpbHM6IHt9LFxyXG5cdHBsdWdpbnM6IHt9LFxyXG59O1xyXG5sZXQgX3V0aWxzID0gbXlBcHAudXRpbHM7XHJcbmxldCBfcGx1Z2lucyA9IG15QXBwLnBsdWdpbnM7IiwiX3V0aWxzLmZvckVhY2ggPSBmdW5jdGlvbiAoaW50ZXJhYmxlLCBjYWxsYmFjaykge1xuXHR0aGlzLm1hcChpbnRlcmFibGUsIGNhbGxiYWNrKTtcblx0cmV0dXJuIHRoaXM7XG59XG4iLCIvLyDQutC+0L7RgNC00LjQvdCw0YLRiyDRjdC70LXQvNC10L3RgtCwINC+0YIg0LLQtdGA0YXQsCDQtNC+0LrRg9C80LXQvdGC0LBcclxuX3V0aWxzLmdldE9mZnNldFRvcCA9IGZ1bmN0aW9uIGdldE9mZnNldFRvcChub2RlKSB7XHJcblx0cmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCArIG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG59IiwiX3V0aWxzLmlzRWxlbSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHR0cnkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA/IHRydWUgOiBmYWxzZTtcblx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRyZXR1cm4gc2VsZWN0b3IgaW5zdGFuY2VvZiBFbGVtZW50O1xuXHR9XG59XG4iLCJfdXRpbHMubWFwID0gZnVuY3Rpb24gKGludGVyYWJsZSwgY2FsbGJhY2spIHtcblx0bGV0IHJlc3VsdCA9IFtdO1xuXG5cdGZvciAobGV0IGkgPSAwLCBtYXggPSBpbnRlcmFibGUubGVuZ3RoOyBpIDwgbWF4OyBpKyspIHtcblx0XHRyZXN1bHQucHVzaChjYWxsYmFjay5jYWxsKGludGVyYWJsZVtpXSwgaW50ZXJhYmxlW2ldLCBpKSk7XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5cbiIsIl91dGlscy5tYXBPbmUgPSBmdW5jdGlvbiAoaW50ZXJhYmxlLCBjYWxsYmFjaykge1xuXHRjb25zdCBtID0gdGhpcy5tYXAoaW50ZXJhYmxlLCBjYWxsYmFjayk7XG5cdHJldHVybiBtLmxlbmd0aCA+IDEgPyBtIDogbVswXTtcbn1cblxuXG4iLCJfdXRpbHMucGFnZVlPZmZzZXRCeU5vZGVzID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRjb25zdCBhcmdzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpO1xyXG5cdGxldCBzdW1tSGVpZ2h0ID0gMDtcclxuXHJcblx0aWYgKGFyZ3MubGVuZ3RoICE9IDApIHtcclxuXHRcdHN1bW1IZWlnaHQgPSBhcmdzLnJlZHVjZShmdW5jdGlvbiAoYWNjdW0sIGl0ZW0pIHtcclxuXHRcdFx0cmV0dXJuIGFjY3VtICsgaXRlbS5vZmZzZXRIZWlnaHQ7XHJcblx0XHR9LCBzdW1tSGVpZ2h0KVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHdpbmRvdy5wYWdlWU9mZnNldCArIHN1bW1IZWlnaHQ7XHJcbn0iLCJfdXRpbHMudGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgbXMgPSA1MCkge1xyXG5cdGxldCBsb2NrZWQgPSBmYWxzZTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmIChsb2NrZWQpIHJldHVybjtcclxuXHJcblx0XHRjb25zdCBjb250ZXh0ID0gdGhpcztcclxuXHRcdGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHRsb2NrZWQgPSB0cnVlO1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0XHRsb2NrZWQgPSBmYWxzZTtcclxuXHRcdH0sIG1zKVxyXG5cdH1cclxufSIsIi8vc2xpbmt5IG1lbnVcbmZ1bmN0aW9uIGJyb01lbnUoc2VsZWN0b3IsIG9wdGlvbnMpIHtcblx0Y29uc3QgJG1lbnUgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuXHRjb25zdCBjb250YWluZXJNZW51ID0gJG1lbnUucXVlcnlTZWxlY3RvcigndWwnKTtcblx0Y29uc3QgJGxldmVsXzEgPSAkbWVudS5sYXN0RWxlbWVudENoaWxkO1xuXHRjb25zdCAkc3ViTWVudUxpc3QgPSAkbWVudS5xdWVyeVNlbGVjdG9yQWxsKCdsaSA+IHVsJyk7XG5cdGNvbnN0ICRzdWJNZW51TGlua3MgPSAkbWVudS5xdWVyeVNlbGVjdG9yQWxsKCdsaSA+IGEnKTtcblx0bGV0IGFjdGl2YXRlZDtcblxuXHRsZXQgZGVmYXVsT3B0aW9ucyA9IHtcblx0XHRuZXh0QnRuOiAnLmJyby1tZW51X19uZXh0LWFycicsXG5cdFx0YXJyb3c6IGBcblx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCI+XG5cdFx0PHBhdGggZD1cIk0xMi4yMTkgMi4yODFMMTAuNzggMy43MiAxOC4wNjIgMTFIMnYyaDE2LjA2M2wtNy4yODIgNy4yODEgMS40MzggMS40MzggOS05IC42ODctLjcxOS0uNjg3LS43MTl6XCIgLz5cblx0XHQ8L3N2Zz5cblx0YFxuXHR9XG5cblx0T2JqZWN0LmFzc2lnbihkZWZhdWxPcHRpb25zLCBvcHRpb25zKTtcblxuXHRsZXQgJGFjdGl2ZVVsO1xuXHRsZXQgdHJhbnNsYXRlID0gMDtcblxuXHRjb25zdCBtZXRob2QgPSB7XG5cdFx0aW5pdCgpIHtcblx0XHRcdGlmIChhY3RpdmF0ZWQpIHJldHVybjtcblxuXHRcdFx0JG1lbnUuY2xhc3NMaXN0LmFkZCgnYnJvLW1lbnUnKTtcblx0XHRcdGNvbnRhaW5lck1lbnUuY2xhc3NMaXN0LmFkZCgnYnJvLW1lbnVfX2NvbnRhaW5lcicpO1xuXG5cdFx0XHRmb3IgKGxldCBzdWJtZW51IG9mICRzdWJNZW51TGlzdCkge1xuXHRcdFx0XHRjb25zdCBsaW5rID0gc3VibWVudS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpID4gYScpO1xuXHRcdFx0XHRzdWJtZW51LmNsYXNzTGlzdC5hZGQoJ2Jyby1tZW51X19zdWJtZW51Jyk7XG5cdFx0XHRcdGxpbmsuY2xhc3NMaXN0LmFkZCgnYnJvLW1lbnVfX25leHQnKTtcblxuXHRcdFx0XHRfYWRkQnRuQmFjayhzdWJtZW51LCBsaW5rKTtcblx0XHRcdFx0X2FkZEJ0bk5leHQobGluayk7XG5cblx0XHRcdFx0YWN0aXZhdGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChjb25zdCAkbGluayBvZiAkc3ViTWVudUxpbmtzKSB7XG5cdFx0XHRcdCRsaW5rLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXG5cdFx0XHQkbWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrSGFuZGxlcik7XG5cblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfc2V0SGVpZ2hNZW51KTtcblx0XHR9LFxuXG5cdFx0ZGVzdHJveSgpIHtcblx0XHRcdGlmICghYWN0aXZhdGVkKSByZXR1cm47XG5cblx0XHRcdGNvbnN0ICRhcnJOb2RlcyA9ICRtZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJy5icm8tbWVudV9fYXJyJyk7XG5cblx0XHRcdCRtZW51LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKTtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBfc2V0SGVpZ2hNZW51KTtcblxuXHRcdFx0Zm9yIChjb25zdCAkbGluayBvZiAkbWVudS5xdWVyeVNlbGVjdG9yQWxsKCcubGluaycpKSB7XG5cdFx0XHRcdGlmICgkbGluay5jbGFzc0xpc3QuY29udGFpbnMoJ2Jyby1tZW51X19iYWNrJykpIHtcblx0XHRcdFx0XHQkbGluay5jbG9zZXN0KCdsaScpLnJlbW92ZSgpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yIChjb25zdCAkYXJyIG9mICRhcnJOb2Rlcykge1xuXHRcdFx0XHRcdCRhcnIucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkbGluay5jbGFzc0xpc3QucmVtb3ZlKCdsaW5rJyk7XG5cdFx0XHRcdCRsaW5rLmNsYXNzTGlzdC5yZW1vdmUoJ2Jyby1tZW51X19uZXh0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAobGV0IHN1Ym1lbnUgb2YgJHN1Yk1lbnVMaXN0KSB7XG5cdFx0XHRcdHN1Ym1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYnJvLW1lbnVfX3N1Ym1lbnUnKTtcblx0XHRcdH1cblxuXHRcdFx0JGFjdGl2ZVVsICYmICRhY3RpdmVVbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdCRtZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2Jyby1tZW51Jyk7XG5cdFx0XHRjb250YWluZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2Jyby1tZW51X19jb250YWluZXInKVxuXG5cdFx0XHQkbWVudS5zdHlsZS5oZWlnaHQgPSAnJztcblx0XHRcdCRsZXZlbF8xLnN0eWxlLnRyYW5zZm9ybSA9IGBgO1xuXHRcdFx0dHJhbnNsYXRlID0gMDtcblx0XHRcdGFjdGl2YXRlZCA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihlKSB7XG5cdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cblx0XHRpZiAodGFyZ2V0LmNsb3Nlc3QoZGVmYXVsT3B0aW9ucy5uZXh0QnRuKSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRjb25zdCAkbmVzdGVkTWVudSA9IHRhcmdldC5jbG9zZXN0KCdsaScpLnF1ZXJ5U2VsZWN0b3IoJ3VsJyk7XG5cblx0XHRcdGlmICgkYWN0aXZlVWwpICRhY3RpdmVVbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuXHRcdFx0JG5lc3RlZE1lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHQkbmVzdGVkTWVudS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXHRcdFx0dHJhbnNsYXRlIC09IDEwMDtcblxuXHRcdFx0JGxldmVsXzEuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0cmFuc2xhdGV9JSlgO1xuXHRcdFx0JGFjdGl2ZVVsID0gJG5lc3RlZE1lbnU7XG5cblx0XHRcdHNjcm9sbFRvVmlzaWJsZSgkYWN0aXZlVWwpO1xuXHRcdFx0X3NldEhlaWdoTWVudSgpO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0YXJnZXQuY2xvc2VzdCgnLmJyby1tZW51X19iYWNrJykpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Y29uc3QgJHVwcGVyTWVudSA9ICRhY3RpdmVVbC5wYXJlbnRFbGVtZW50LmNsb3Nlc3QoJ3VsJyk7XG5cdFx0XHQkdXBwZXJNZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG5cdFx0XHQkYWN0aXZlVWwuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuXG5cdFx0XHR0cmFuc2xhdGUgKz0gMTAwO1xuXG5cdFx0XHQkbGV2ZWxfMS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RyYW5zbGF0ZX0lKWA7XG5cdFx0XHQkYWN0aXZlVWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHQkYWN0aXZlVWwgPSAkdXBwZXJNZW51O1xuXHRcdFx0X3NldEhlaWdoTWVudSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9hZGRCdG5OZXh0KGVsZW0pIHtcblx0XHRlbGVtLmNsYXNzTGlzdC5hZGQoJ2xpbmsnKVxuXHRcdGVsZW0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBgXG5cdFx0XHQ8c3BhbiBjbGFzcz1cImJyby1tZW51X19uZXh0LWFyclwiPlxuXHRcdFx0XHQke2RlZmF1bE9wdGlvbnMuYXJyb3d9XG5cdFx0XHQ8L3NwYW4+XG5cdFx0YCk7XG5cblx0XHRlbGVtLmxhc3RFbGVtZW50Q2hpbGQuY2xhc3NMaXN0LmFkZCgnYnJvLW1lbnVfX2FycicpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2FkZEJ0bkJhY2soZWxlbSwgbGluaykge1xuXHRcdGNvbnN0IGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuXG5cdFx0ZWxlbS5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBgXG5cdFx0PGxpPlxuXHRcdFx0PGEgY2xhc3M9XCJicm8tbWVudV9fYmFjayBsaW5rXCI+XG5cdFx0XHRcdCR7ZGVmYXVsT3B0aW9ucy5hcnJvd31cblx0XHRcdFx0JHtsaW5rLnRleHRDb250ZW50fVxuXHRcdFx0PC9hPlxuXHRcdDwvbGk+XG5cdGApO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NldEhlaWdoTWVudSgpIHtcblx0XHRpZiAoISRhY3RpdmVVbCkgcmV0dXJuO1xuXG5cdFx0JG1lbnUuc3R5bGUuaGVpZ2h0ID0gJGFjdGl2ZVVsLm9mZnNldEhlaWdodCArIFwicHhcIjtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjcm9sbFRvVmlzaWJsZShlbCkge1xuXHRcdGlmIChfZ2V0UG9zQWJzV2luZG93KGVsKSA+IHdpbmRvdy5wYWdlWU9mZnNldCkgcmV0dXJuO1xuXG5cdFx0YmFja1RvVG9wKC0xMCwgX2dldFBvcyhlbCkpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2dldFBvc0Fic1dpbmRvdyhlbGVtKSB7XG5cdFx0Y29uc3Qgb2Zmc2V0VG9wID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG5cblx0XHRyZXR1cm4gb2Zmc2V0VG9wIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuXHR9XG5cblx0ZnVuY3Rpb24gX2dldFBvcyhlbCkge1xuXHRcdHJldHVybiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdH1cblxuXHRmdW5jdGlvbiBiYWNrVG9Ub3AoaW50ZXJ2YWwsIHRvKSB7XG5cdFx0aWYgKHdpbmRvdy5wYWdlWU9mZnNldCA8PSB0bykgcmV0dXJuO1xuXG5cdFx0d2luZG93LnNjcm9sbEJ5KDAsIGludGVydmFsKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGJhY2tUb1RvcChpbnRlcnZhbCwgdG8pXG5cdFx0fSwgMCk7XG5cdH1cblxuXHRyZXR1cm4gbWV0aG9kO1xufSIsIi8vIGJUYWJzXHJcbl9wbHVnaW5zLmJUYWJzID0gZnVuY3Rpb24gKHRhcmdldCkge1xyXG5cdGxldCBfZWxlbVRhYnMgPSAodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkgOiB0YXJnZXQpLFxyXG5cdFx0X2V2ZW50VGFic1Nob3csXHJcblx0XHRfc2hvd1RhYiA9IGZ1bmN0aW9uICh0YWJzTGlua1RhcmdldCkge1xyXG5cdFx0XHR2YXIgdGFic1BhbmVUYXJnZXQsIHRhYnNMaW5rQWN0aXZlLCB0YWJzUGFuZVNob3c7XHJcblx0XHRcdHRhYnNQYW5lVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YWJzTGlua1RhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcblx0XHRcdHRhYnNMaW5rQWN0aXZlID0gdGFic0xpbmtUYXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYi10YWJzX19saW5rLmFjdGl2ZScpO1xyXG5cdFx0XHR0YWJzUGFuZVNob3cgPSB0YWJzUGFuZVRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iLXRhYnNfX3BhbmUuYWN0aXZlJyk7XHJcblx0XHRcdC8vINC10YHQu9C4INGB0LvQtdC00YPRjtGJ0LDRjyDQstC60LvQsNC00LrQsCDRgNCw0LLQvdCwINCw0LrRgtC40LLQvdC+0LksINGC0L4g0LfQsNCy0LXRgNGI0LDQtdC8INGA0LDQsdC+0YLRg1xyXG5cdFx0XHRpZiAodGFic0xpbmtUYXJnZXQgPT09IHRhYnNMaW5rQWN0aXZlKSByZXR1cm47XHJcblx0XHRcdC8vINGD0LTQsNC70Y/QtdC8INC60LvQsNGB0YHRiyDRgyDRgtC10LrRg9GJ0LjRhSDQsNC60YLQuNCy0L3Ri9GFINGN0LvQtdC80LXQvdGC0L7QslxyXG5cdFx0XHRpZiAodGFic0xpbmtBY3RpdmUgIT09IG51bGwpIHRhYnNMaW5rQWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0aWYgKHRhYnNQYW5lU2hvdyAhPT0gbnVsbCkgdGFic1BhbmVTaG93LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdFx0XHQvLyDQtNC+0LHQsNCy0LvRj9C10Lwg0LrQu9Cw0YHRgdGLINC6INGN0LvQtdC80LXQvdGC0LDQvCAo0LIg0LfQsNCy0LjQvNC+0YHRgtC4INC+0YIg0LLRi9Cx0YDQsNC90L3QvtC5INCy0LrQu9Cw0LTQutC4KVxyXG5cdFx0XHR0YWJzTGlua1RhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0dGFic1BhbmVUYXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoX2V2ZW50VGFic1Nob3cpO1xyXG5cdFx0fSxcclxuXHRcdF9zd2l0Y2hUYWJUbyA9IGZ1bmN0aW9uICh0YWJzTGlua0luZGV4KSB7XHJcblx0XHRcdHZhciB0YWJzTGlua3MgPSBfZWxlbVRhYnMucXVlcnlTZWxlY3RvckFsbCgnLmItdGFic19fbGluaycpO1xyXG5cdFx0XHRpZiAodGFic0xpbmtzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRpZiAodGFic0xpbmtJbmRleCA+IHRhYnNMaW5rcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdHRhYnNMaW5rSW5kZXggPSB0YWJzTGlua3MubGVuZ3RoO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGFic0xpbmtJbmRleCA8IDEpIHtcclxuXHRcdFx0XHRcdHRhYnNMaW5rSW5kZXggPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRfc2hvd1RhYih0YWJzTGlua3NbdGFic0xpbmtJbmRleCAtIDFdKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0X2V2ZW50VGFic1Nob3cgPSBuZXcgQ3VzdG9tRXZlbnQoJ3RhYi5zaG93JywgeyBkZXRhaWw6IF9lbGVtVGFicyB9KTtcclxuXHJcblx0X2VsZW1UYWJzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdHZhciB0YWJzTGlua1RhcmdldCA9IGUudGFyZ2V0O1xyXG5cdFx0Ly8g0LfQsNCy0LXRgNGI0LDQtdC8INCy0YvQv9C+0LvQvdC10L3QuNC1INGE0YPQvdC60YbQuNC4LCDQtdGB0LvQuCDQutC70LjQutC90YPQu9C4INC90LUg0L/QviDRgdGB0YvQu9C60LVcclxuXHRcdGlmICghdGFic0xpbmtUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdiLXRhYnNfX2xpbmsnKSkgcmV0dXJuO1xyXG5cclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdF9zaG93VGFiKHRhYnNMaW5rVGFyZ2V0KTtcclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHNob3dUYWI6IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuXHRcdFx0X3Nob3dUYWIodGFyZ2V0KTtcclxuXHRcdH0sXHJcblx0XHRzd2l0Y2hUYWJUbzogZnVuY3Rpb24gKGluZGV4KSB7XHJcblx0XHRcdF9zd2l0Y2hUYWJUbyhpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsIi8qKioqKiBDVVNUT00gUExVR0lOICoqKioqKi9cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdGNvbnN0ICR0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcblx0aWYgKCR0YXJnZXQuY2xvc2VzdCgnW2RhdGEtY29weV06bm90KC5kaXNhYmxlZCknKSkge1xyXG5cdFx0Y29uc3QgJGRhdGFDb3B5RWwgPSAkdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWNvcHldJyk7XHJcblx0XHQkZGF0YUNvcHlFbC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xyXG5cdFx0bmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoJGRhdGFDb3B5RWwuZGF0YXNldC5jb3B5KTtcclxuXHJcblx0XHRjb25zdCBub3RpZmljYXRpb25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0bm90aWZpY2F0aW9uRWwuY2xhc3NOYW1lID0gJ2NvcHktbm90aWZpY2F0aW9uJztcclxuXHRcdG5vdGlmaWNhdGlvbkVsLnRleHRDb250ZW50ID0gJ9Ch0LrQvtC/0LjRgNC+0LLQsNC90L3QviDQsiDQsdGD0YTQtdGAINC+0LHQvNC10L3QsCc7XHJcblx0XHQkZGF0YUNvcHlFbC5hcHBlbmQobm90aWZpY2F0aW9uRWwpO1xyXG5cclxuXHRcdGxldCBsZWZ0ID0gMCArICgkZGF0YUNvcHlFbC5vZmZzZXRXaWR0aCAtIG5vdGlmaWNhdGlvbkVsLm9mZnNldFdpZHRoKSAvIDI7XHJcblx0XHRub3RpZmljYXRpb25FbC5zdHlsZS5sZWZ0ID0gbGVmdCArIFwicHhcIjtcclxuXHJcblx0XHQvLyDRgdC/0L7Qt9C40YbQuNC+0L3QuNGA0YPQtdC8INC10LPQviDRgdCy0LXRgNGF0YMg0L7RgiDQsNC90L3QvtGC0LjRgNGD0LXQvNC+0LPQviDRjdC70LXQvNC10L3RgtCwICh0b3AtY2VudGVyKVxyXG5cdFx0bGV0IGNvb3Jkc05vdGlmeSA9IG5vdGlmaWNhdGlvbkVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0Y29uc3QgeyB0b3A6IGNvb3JkVG9wLCByaWdodDogY29vcmRSaWdodCwgYm90dG9tOiBjb29yZEJvdHRvbSwgbGVmdDogY29vcmRMZWZ0IH0gPSBjb29yZHNOb3RpZnk7XHJcblxyXG5cdFx0aWYgKGNvb3JkTGVmdCA8IDApIHtcclxuXHRcdFx0bm90aWZpY2F0aW9uRWwuc3R5bGUubGVmdCA9IFwiMHB4XCI7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvb3JkVG9wIDwgMCkge1xyXG5cdFx0XHRub3RpZmljYXRpb25FbC5zdHlsZS50b3AgPSBcIjEwMCVcIjtcclxuXHRcdFx0bm90aWZpY2F0aW9uRWwuc3R5bGUuYm90dG9tID0gXCJhdXRvXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7IG5vdGlmaWNhdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ2NvcHktbm90aWZpY2F0aW9uLS1hbmltYXRlZCcpIH0sIDEwKTtcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4geyBub3RpZmljYXRpb25FbC5jbGFzc0xpc3QucmVtb3ZlKCdjb3B5LW5vdGlmaWNhdGlvbi0tYW5pbWF0ZWQnKSB9LCAyMDEwKTtcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRub3RpZmljYXRpb25FbC5yZW1vdmUoKTtcclxuXHRcdFx0JGRhdGFDb3B5RWwuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcclxuXHRcdH0sIDI1MDApO1xyXG5cdH1cclxufSk7IiwiLy9zbGlua3kgbWVudVxuX3BsdWdpbnMuZmlsdGVyaW5nRWxlbWVudHMgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdGlvbnMpIHtcblx0Y29uc3QgJHBhcmVudCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIiA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XG5cdGNvbnN0IGJhc2VDbGFzcyA9IFwianMtZmlsdGVyaW5nLWVsZW1lbnRzXCI7XG5cdGNvbnN0IGl0ZW1DbGFzcyA9IGJhc2VDbGFzcyArIFwiX19pdGVtXCI7XG5cdGNvbnN0IGl0ZW1IaWRkZW5DbGFzcyA9IGl0ZW1DbGFzcyArIFwiLS1oaWRkZW5cIjtcblxuXHRjb25zdCAkZmlsdGVyQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3MqPVwianMtZi1cIl0nKTtcblx0Y29uc3QgJGZpbHRlclRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWZdJyk7XG5cblx0JHBhcmVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0Y29uc3QgJGZpbHRlckJ0biA9IGUudGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWZdJyk7XG5cblx0XHRpZiAoJGZpbHRlckJ0bikge1xuXHRcdFx0aWYgKCRmaWx0ZXJCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBmaWx0ZXJDbGFzcyA9ICdqcy1mLScgKyBlLnRhcmdldC5kYXRhc2V0WydmJ107XG5cdFx0XHRsZXQgaGlkZGVuRWxlbWVudHMgPSBbXTtcblxuXHRcdFx0aWYgKCRwYXJlbnQucXVlcnlTZWxlY3RvcignW2RhdGEtZl0uYWN0aXZlJykpIHtcblx0XHRcdFx0JHBhcmVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1mXS5hY3RpdmUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblx0XHRcdH1cblxuXHRcdFx0JGZpbHRlckJ0bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuXHRcdFx0Zm9yIChjb25zdCAkY2FyZCBvZiAkZmlsdGVyQ2FyZHMpIHtcblx0XHRcdFx0JGNhcmQuY2xhc3NMaXN0LnJlbW92ZShpdGVtSGlkZGVuQ2xhc3MpO1xuXG5cdFx0XHRcdGlmICghJGNhcmQuY2xhc3NMaXN0LmNvbnRhaW5zKGZpbHRlckNsYXNzKSAmJiBmaWx0ZXJDbGFzcyAhPT0gJ2YtYWxsJykge1xuXHRcdFx0XHRcdCRjYXJkLmNsYXNzTGlzdC5hZGQoaXRlbUhpZGRlbkNsYXNzKTtcblx0XHRcdFx0XHRoaWRkZW5FbGVtZW50cy5wdXNoKCRjYXJkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQkcGFyZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZmlsdGVyaW5nXCIsIHtcblx0XHRcdFx0YnViYmxlczogdHJ1ZSxcblx0XHRcdFx0Y2FuY2VsYWJsZTogdHJ1ZSxcblx0XHRcdFx0Y29tcG9zZWQ6IHRydWUsXG5cdFx0XHRcdGRldGFpbDoge1xuXHRcdFx0XHRcdHRyaWdnZXI6ICRmaWx0ZXJCdG4sXG5cdFx0XHRcdFx0aGlkZGVuRWxlbWVudHNcblx0XHRcdFx0fVxuXHRcdFx0fSkpO1xuXHRcdH1cblx0fSk7XG5cblx0JGZpbHRlclRvZ2dsZVswXS5jbGljaygpO1xuXG5cdHJldHVybiAkcGFyZW50O1xufVxuIiwiX3BsdWdpbnMuZml4ZWRFbGVtVG9wID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcblx0Y29uc3QgJGVsID0gdHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIDogc2VsZWN0b3I7XHJcblx0Y29uc3QgJHN0YXJ0aW5nUGxhY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRjb25zdCAkaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZGVyJyk7XHJcblx0JGVsLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCAkc3RhcnRpbmdQbGFjZSk7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBfdXRpbHMudGhyb3R0bGUoXHJcblx0XHRmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxldCBwYWdlWU9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuXHRcdFx0bGV0IGlzRml4ZWRIZWFkZXIgPSBmYWxzZTtcclxuXHJcblx0XHRcdGlmIChnZXRDb21wdXRlZFN0eWxlKCRoZWFkZXIpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XHJcblx0XHRcdFx0cGFnZVlPZmZzZXQgPSBfdXRpbHMucGFnZVlPZmZzZXRCeU5vZGVzKCRoZWFkZXIpO1xyXG5cdFx0XHRcdGlzRml4ZWRIZWFkZXIgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAocGFnZVlPZmZzZXQgPiBfdXRpbHMuZ2V0T2Zmc2V0VG9wKCRzdGFydGluZ1BsYWNlKSkge1xyXG5cdFx0XHRcdCRzdGFydGluZ1BsYWNlLnN0eWxlLmhlaWdodCA9ICRlbC5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRcdCRlbC5jbGFzc0xpc3QuYWRkKCdmaXhlZCcpO1xyXG5cdFx0XHRcdCRlbC5zdHlsZS50b3AgPSBpc0ZpeGVkSGVhZGVyID8gJGhlYWRlci5vZmZzZXRIZWlnaHQgKyAncHgnIDogJyc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JHN0YXJ0aW5nUGxhY2Uuc3R5bGUuaGVpZ2h0ID0gJyc7XHJcblx0XHRcdFx0JGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpLCA3MClcclxufTsiLCIvLyBpbmNvbXBsZXRlIGxpc3RcclxuLy8g0JjQt9C90LDRh9Cw0LvRjNC90L7QtSDQutC+0LvQu9C40YfQtdGB0YLQstC+INCy0LjQtNC40LzRi9GFINC80L7QttC90L4g0YPQt9C60LDQt9Cw0YLRjCDQsiBkYXRhLWluY29tcGxldGUtbnVtXHJcbl9wbHVnaW5zLmluY29tcGxldGVMaXN0ID0gKGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0aW9ucykge1xyXG5cdGxldCAkZWwgPSAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSA6IHNlbGVjdG9yLFxyXG5cdFx0JHRvZ2dsZSA9ICRlbC5xdWVyeVNlbGVjdG9yKCdbaW5jb21wbGV0ZS10b2dnbGVdJyksXHJcblx0XHQkdG9nZ2xlVmFsLFxyXG5cdFx0JGhpZGRlbkVscyxcclxuXHRcdHZpc2libGVDb3VudDtcclxuXHJcblx0Y29uc3QgYmFzZUNsYXNzID0gJ2pzLWluY29tcGxldGUnO1xyXG5cdGNvbnN0IGRpc2FibGVkQ2xhc3MgPSBiYXNlQ2xhc3MgKyAnLS1kaXNhYmxlZCc7XHJcblx0Y29uc3QgbGlzdENsYXNzID0gYmFzZUNsYXNzICsgJy1saXN0JztcclxuXHRjb25zdCBpdGVtQ2xhc3MgPSBiYXNlQ2xhc3MgKyAnLWl0ZW0nO1xyXG5cdGNvbnN0IGV4cGFuZGVkTGlzdENsYXNzID0gbGlzdENsYXNzICsgJy0tZXhwYW5kZWQnO1xyXG5cdGNvbnN0IGhpZGRlbkl0ZW1DbGFzcyA9IGl0ZW1DbGFzcyArICctLWhpZGUnO1xyXG5cdGNvbnN0IGJ0blRvZ2dsZUNsYXNzID0gYmFzZUNsYXNzICsgJy10b2dnbGUnO1xyXG5cdGNvbnN0IGJ0blRvZ2dsZU1vcmVDbGFzcyA9IGJ0blRvZ2dsZUNsYXNzICsgJy0tbW9yZSc7XHJcblxyXG5cdGNvbnN0IHNldHRpbmdzID0ge1xyXG5cdFx0dmlzaWJsZUJsb2NrczogOCxcclxuXHRcdHBvc2l0aW9uVG9nZ2xlOiAnb3V0c2lkZScsXHJcblx0XHRtb3JlQnRuQ29udGVudDogXCLQldGJ0LVcIixcclxuXHRcdGxlc3NCdG5Db250ZW50OiBcItCh0LrRgNGL0YLRjFwiLFxyXG5cdH1cclxuXHJcblx0T2JqZWN0LmFzc2lnbihzZXR0aW5ncywgb3B0aW9ucyk7XHJcblxyXG5cdHZpc2libGVDb3VudCA9ICRlbC5kYXRhc2V0LnZpc2libGVDb3VudCB8fCBzZXR0aW5ncy52aXNpYmxlQmxvY2tzO1xyXG5cdGxldCBjaGlsZHJlbkNvdW50ID0gJGVsLmNoaWxkcmVuLmxlbmd0aCAtICgkdG9nZ2xlID8gMSA6IDApOyBcclxuXHQkZWwuY2xhc3NMaXN0LmFkZChkaXNhYmxlZENsYXNzKTtcclxuXHJcblxyXG5cdGlmIChjaGlsZHJlbkNvdW50IDw9ICt2aXNpYmxlQ291bnQpIHJldHVybiBmYWxzZTtcclxuXHJcblx0JGVsLmNsYXNzTGlzdC5yZW1vdmUoZGlzYWJsZWRDbGFzcyk7XHJcblxyXG5cdCRoaWRkZW5FbHMgPSBBcnJheS5mcm9tKCRlbC5jaGlsZHJlbikuZmlsdGVyKCgkaXRlbSwgaWR4KSA9PiB7XHJcblx0XHRpZiAoJGl0ZW0uY2xvc2VzdCgnW2luY29tcGxldGUtdG9nZ2xlXScpKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0JGl0ZW0uY2xhc3NMaXN0LmFkZChpdGVtQ2xhc3MpO1xyXG5cclxuXHRcdGlmIChpZHggPiB2aXNpYmxlQ291bnQgLSAxKSB7XHJcblx0XHRcdCRpdGVtLmNsYXNzTGlzdC5hZGQoaGlkZGVuSXRlbUNsYXNzKTtcclxuXHRcdFx0cmV0dXJuICRpdGVtO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRpZiAoISR0b2dnbGUpIHtcclxuXHRcdCR0b2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuXHRcdCR0b2dnbGUuaW5uZXJIVE1MID0gc2V0dGluZ3MubW9yZUJ0bkNvbnRlbnQ7XHJcblxyXG5cdFx0aWYgKHNldHRpbmdzLnBvc2l0aW9uVG9nZ2xlID09PSAnaW5zaWRlJykge1xyXG5cdFx0XHQkZWwuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmVlbmQnLCAkdG9nZ2xlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRlbC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgJHRvZ2dsZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCB0b2dnbGVDbGFzc2VzID0gKHNldHRpbmdzLnRvZ2dsZUNsYXNzZXMpXHJcblx0XHQ/IGAke3NldHRpbmdzLnRvZ2dsZUNsYXNzZXNzfSAke2J0blRvZ2dsZUNsYXNzfSAke2J0blRvZ2dsZU1vcmVDbGFzc31gXHJcblx0XHQ6IGAke2J0blRvZ2dsZUNsYXNzfSAke2J0blRvZ2dsZU1vcmVDbGFzc31gO1xyXG5cclxuXHQkdG9nZ2xlLmNsYXNzTmFtZSA9ICR0b2dnbGUuY2xhc3NOYW1lICsgXCIgXCIgKyB0b2dnbGVDbGFzc2VzO1xyXG5cclxuXHQkdG9nZ2xlVmFsID0gJHRvZ2dsZS5xdWVyeVNlbGVjdG9yKCdbaW5jb21wbGV0ZS10b2dnbGUtdmFsXScpIHx8ICR0b2dnbGU7XHJcblxyXG5cdCR0b2dnbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCRlbC5jbGFzc0xpc3QuY29udGFpbnMoZXhwYW5kZWRMaXN0Q2xhc3MpKSB7XHJcblx0XHRcdCRlbC5jbGFzc0xpc3QucmVtb3ZlKGV4cGFuZGVkTGlzdENsYXNzKTtcclxuXHRcdFx0JHRvZ2dsZS5jbGFzc0xpc3QuYWRkKGJ0blRvZ2dsZU1vcmVDbGFzcyk7XHJcblx0XHRcdCRoaWRkZW5FbHMubWFwKGl0ZW0gPT4geyBpdGVtLmNsYXNzTGlzdC5hZGQoaGlkZGVuSXRlbUNsYXNzKSB9KTtcclxuXHRcdFx0JHRvZ2dsZVZhbC5pbm5lckhUTUwgPSBzZXR0aW5ncy5tb3JlQnRuQ29udGVudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCR0b2dnbGUuY2xhc3NMaXN0LnJlbW92ZShidG5Ub2dnbGVNb3JlQ2xhc3MpO1xyXG5cdFx0XHQkZWwuY2xhc3NMaXN0LmFkZChleHBhbmRlZExpc3RDbGFzcyk7XHJcblx0XHRcdCRoaWRkZW5FbHMubWFwKGl0ZW0gPT4geyBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoaGlkZGVuSXRlbUNsYXNzKSB9KTtcclxuXHRcdFx0JHRvZ2dsZVZhbC5pbm5lckhUTUwgPSBzZXR0aW5ncy5sZXNzQnRuQ29udGVudDtcclxuXHRcdH1cclxuXHR9KTtcclxufSk7XHJcblxyXG5jb25zdCBpbmNvbXBsZXRlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWluY29tcGxldGUtbGlzdCcpO1xyXG5mb3IgKGNvbnN0IGluY29tcGxldGVFbCBvZiBpbmNvbXBsZXRlRWxzKSB7XHJcblx0X3BsdWdpbnMuaW5jb21wbGV0ZUxpc3QoaW5jb21wbGV0ZUVsKTtcclxufSIsIi8vIChmdW5jdGlvbiAobXlBcHApIHtcclxuLy8gXHRjb25zdCBtZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lbnUnKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWVudScpO1xyXG4vLyBcdGNvbnN0IG1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHtteUFwcC5icmVha3BvaW50cy5tZH1weClgKTtcclxuLy8gXHR3aW5kb3cubSA9IG1lZGlhUXVlcnk7XHJcbi8vIFx0X3NldEx2bHMobWVudSwgMSk7XHJcblxyXG4vLyBcdC8vSGFtYnVyZ2VyINC+0YLQutGA0YvRgtC40Y8g0LzQvtCx0LjQu9GM0L3QvtCz0L4g0LzQtdC90Y5cclxuLy8gXHRpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXRvZ2dsZS1idXJnZXInKSkge1xyXG4vLyBcdFx0Y29uc3QgdG9nZ2xlQnRuQ2xhc3MgPSAnanMtdG9nZ2xlLWJ1cmdlcic7XHJcbi8vIFx0XHRjb25zdCBib2R5RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbi8vIFx0XHRjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkZXInKTtcclxuLy8gXHRcdGNvbnN0ICR0b2dnbGVCdXJnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIHRvZ2dsZUJ0bkNsYXNzKTtcclxuLy8gXHRcdGNvbnN0IGJ1cmdlckJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnVyZ2VyJyk7XHJcbi8vIFx0XHRjb25zdCBidXJnZXJJbm5lciA9IGJ1cmdlckJsb2NrLnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2J1cmdlci1pbm5lcicpO1xyXG5cclxuLy8gXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuLy8gXHRcdFx0bGV0ICR0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcbi8vIFx0XHRcdGlmICgkdG9nZ2xlQnVyZ2VyLmNvbnRhaW5zKCR0YXJnZXQpKSB7XHJcbi8vIFx0XHRcdFx0Y2hhbmdpbmdTdGF0ZUhhbWJ1cmdlcigkdG9nZ2xlQnVyZ2VyLCAnYWN0aXZlJyk7XHJcblxyXG4vLyBcdFx0XHRcdGJ1cmdlckJsb2NrLnN0eWxlLnRvcCA9IGhlYWRlci5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG5cclxuLy8gXHRcdFx0XHRsZXQgaXNBY3RpdmUgPSAkdG9nZ2xlQnVyZ2VyLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJyk7XHJcblxyXG4vLyBcdFx0XHRcdGJ1cmdlckJsb2NrLmNsYXNzTGlzdFtpc0FjdGl2ZSA/ICdhZGQnIDogJ3JlbW92ZSddKCdvcGVuJyk7XHJcbi8vIFx0XHRcdFx0YnVyZ2VySW5uZXIuc3R5bGUubWF4SGVpZ2h0ID0gKGlzQWN0aXZlKSA/IGBjYWxjKDEwMHZoIC0gJHtoZWFkZXIub2Zmc2V0SGVpZ2h0fXB4KWAgOiAnJztcclxuLy8gXHRcdFx0XHRib2R5RWwuc3R5bGUub3ZlcmZsb3cgPSAoaXNBY3RpdmUpID8gJ2hpZGRlbicgOiAnJztcclxuLy8gXHRcdFx0fSBlbHNlIGlmICghYnVyZ2VySW5uZXIuY29udGFpbnMoJHRhcmdldCkgJiYgJHRvZ2dsZUJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSB7XHJcbi8vIFx0XHRcdFx0Y2hhbmdpbmdTdGF0ZUhhbWJ1cmdlcigkdG9nZ2xlQnVyZ2VyLCAnYWN0aXZlJyk7XHJcbi8vIFx0XHRcdFx0YnVyZ2VyQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpO1xyXG4vLyBcdFx0XHRcdGJ1cmdlcklubmVyLnN0eWxlLm1heEhlaWdodCA9ICcnO1xyXG4vLyBcdFx0XHRcdGJvZHlFbC5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG4vLyBcdFx0XHR9XHJcbi8vIFx0XHR9KTtcclxuXHJcbi8vIFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4vLyBcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPiBteUFwcC5icmVha3BvaW50cy5tZCAmJiBidXJnZXJCbG9jay5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW4nKSkge1xyXG4vLyBcdFx0XHRcdGNoYW5naW5nU3RhdGVIYW1idXJnZXIoJHRvZ2dsZUJ1cmdlciwgJ2FjdGl2ZScpO1xyXG4vLyBcdFx0XHRcdGJ1cmdlckJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW4nKTtcclxuLy8gXHRcdFx0XHRib2R5RWwuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuLy8gXHRcdFx0fVxyXG4vLyBcdFx0fSk7XHJcblxyXG4vLyBcdFx0YnVyZ2VyQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4vLyBcdFx0XHRpZiAoIWUudGFyZ2V0LmNvbnRhaW5zKGJ1cmdlckJsb2NrKSkgcmV0dXJuO1xyXG5cclxuLy8gXHRcdFx0aGFtYnVyZ2VyQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4vLyBcdFx0XHRidXJnZXJCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcbi8vIFx0XHRcdGJvZHlFbC5zdHlsZS5vdmVyZmxvdyA9ICcnO1xyXG4vLyBcdFx0fSk7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHQvLyDQv9C+0LQg0LzQtdC90Y4g0YEg0LPQsNC80LHRg9GA0LPQtdGA0L7QvCDQstC90YPRgtGA0Lgg0L7RgdC90L7QstC90L7Qs9C+INC80LXQvdGOXHJcbi8vIFx0aWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qLXRvZ2dsZS1oYW5nJykpIHtcclxuLy8gXHRcdGNvbnN0IGhhbmdJdGVtQ2xhc3MgPSAnbWVudV9faXRlbS0taGFuZyc7XHJcbi8vIFx0XHRjb25zdCBoYW5nT3Blbkl0ZW1DbGFzcyA9ICdtZW51X19pdGVtLS1oYW5nX29wZW4nO1xyXG4vLyBcdFx0Y29uc3QgdG9nZ2xlSGFuZ0l0ZW0gPSAnai10b2dnbGUtaGFuZyc7XHJcblxyXG4vLyBcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4vLyBcdFx0XHRsZXQgJHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cclxuLy8gXHRcdFx0aWYgKCR0YXJnZXQuY2xvc2VzdCgnLicgKyB0b2dnbGVIYW5nSXRlbSkpIHtcclxuLy8gXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vIFx0XHRcdFx0JHRhcmdldCA9ICR0YXJnZXQuY2xvc2VzdCgnLicgKyB0b2dnbGVIYW5nSXRlbSk7XHJcbi8vIFx0XHRcdFx0Y29uc3QgJGN1cnJlbnRJdGVtSGFuZyA9ICR0YXJnZXQuY2xvc2VzdCgnLicgKyBoYW5nSXRlbUNsYXNzKTtcclxuXHJcbi8vIFx0XHRcdFx0JHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuLy8gXHRcdFx0XHQkY3VycmVudEl0ZW1IYW5nLmNsYXNzTGlzdC50b2dnbGUoaGFuZ09wZW5JdGVtQ2xhc3MpO1xyXG5cclxuLy8gXHRcdFx0XHRpZiAoJHRhcmdldC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJykpIHtcclxuLy8gXHRcdFx0XHRcdCR0YXJnZXQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlcicpLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4vLyBcdFx0XHRcdH1cclxuLy8gXHRcdFx0fSBlbHNlIGlmICghJHRhcmdldC5jbG9zZXN0KCcuJyArIGhhbmdJdGVtQ2xhc3MpICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgaGFuZ09wZW5JdGVtQ2xhc3MpKSB7XHJcbi8vIFx0XHRcdFx0aWYgKHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke215QXBwLmJyZWFrcG9pbnRzLm1kfXB4KWApLm1hdGNoZXMpIHJldHVybjtcclxuXHJcbi8vIFx0XHRcdFx0bGV0ICRvcGVuSXRlbUhhbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIGhhbmdPcGVuSXRlbUNsYXNzKTtcclxuLy8gXHRcdFx0XHRsZXQgJGFjdGl2ZVRvZ2dsZUhhbmcgPSAkb3Blbkl0ZW1IYW5nLnF1ZXJ5U2VsZWN0b3IoJy5qLXRvZ2dsZS1oYW5nJyk7XHJcblxyXG4vLyBcdFx0XHRcdCRvcGVuSXRlbUhhbmcuY2xhc3NMaXN0LnJlbW92ZShoYW5nT3Blbkl0ZW1DbGFzcyk7XHJcbi8vIFx0XHRcdFx0JGFjdGl2ZVRvZ2dsZUhhbmcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblxyXG4vLyBcdFx0XHRcdGlmICgkYWN0aXZlVG9nZ2xlSGFuZy5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyJykpIHtcclxuLy8gXHRcdFx0XHRcdCRhY3RpdmVUb2dnbGVIYW5nLnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuLy8gXHRcdFx0XHR9XHJcbi8vIFx0XHRcdH1cclxuLy8gXHRcdH0pXHJcbi8vIFx0fVxyXG5cclxuLy8gXHQkKG1lbnUpLm9uKCdjbGljaycsICcuanMtdG9nZ2xlLXN1Ym1lbnUnLCBmdW5jdGlvbiAoZSkge1xyXG4vLyBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4vLyBcdFx0Y29uc3QgJHRyaWdnZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuanMtdG9nZ2xlLXN1Ym1lbnUnKTtcclxuLy8gXHRcdGNvbnN0ICRwYXJlbnRJdGVtID0gZS50YXJnZXQuY2xvc2VzdCgnLm1lbnVfX2l0ZW0nKTtcclxuLy8gXHRcdGNvbnN0ICRzdWJtZW51ID0gJHBhcmVudEl0ZW0ucXVlcnlTZWxlY3RvcignLm1lbnVfX3N1Ym1lbnUnKTtcclxuXHJcbi8vIFx0XHRpZiAoISRzdWJtZW51KSByZXR1cm47XHJcblxyXG4vLyBcdFx0JCgkdHJpZ2dlcikudG9nZ2xlQ2xhc3MoJ2pzLXRvZ2dsZS1zdWJtZW51LS1hY3RpdmUnKTtcclxuLy8gXHRcdCQoJHBhcmVudEl0ZW0pLnRvZ2dsZUNsYXNzKCdtZW51X19pdGVtLS1vcGVuJyk7XHJcbi8vIFx0XHQkKCRzdWJtZW51KS5zbGlkZVRvZ2dsZSgzMDApO1xyXG4vLyBcdH0pO1xyXG5cclxuLy8gXHRmdW5jdGlvbiBjaGFuZ2luZ1N0YXRlSGFtYnVyZ2VyKCRoYW1idXJnZXIsIGNoYW5nZUNsYXNzKSB7XHJcbi8vIFx0XHRpZiAoJGhhbWJ1cmdlci5jbGFzc0xpc3QuY29udGFpbnMoY2hhbmdlQ2xhc3MpKSB7XHJcbi8vIFx0XHRcdCRoYW1idXJnZXIuY2xhc3NMaXN0LnJlbW92ZShjaGFuZ2VDbGFzcyk7XHJcbi8vIFx0XHRcdCRoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbi8vIFx0XHRcdCRoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9Ce0YLQutGA0YvRgtGMINC80LXQvdGOJyk7XHJcbi8vIFx0XHR9IGVsc2Uge1xyXG4vLyBcdFx0XHQkaGFtYnVyZ2VyLmNsYXNzTGlzdC5hZGQoY2hhbmdlQ2xhc3MpO1xyXG4vLyBcdFx0XHQkaGFtYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbi8vIFx0XHRcdCRoYW1idXJnZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ9CX0LDQutGA0YvRgtGMINC80LXQvdGOJyk7XHJcbi8vIFx0XHR9XHJcbi8vIFx0fVxyXG5cclxuLy8gXHQvKipcclxuLy8gXHQgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiBsdmwgc3VibWVudVxyXG4vLyBcdCAqXHJcbi8vIFx0ICogQHBhcmFtIHtFbGVtZW50fVxyXG4vLyBcdCAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuLy8gXHQqL1xyXG4vLyBcdGZ1bmN0aW9uIF9zZXRMdmxzKG1lbnUsIGluaXRpYWxMdmwpIHtcclxuLy8gXHRcdGNvbnN0ICRjaGlsZHJlbkl0ZW1zID0gbWVudS5jaGlsZHJlbjtcclxuLy8gXHRcdG1lbnUuY2xhc3NMaXN0LmFkZChgbHZsLSR7aW5pdGlhbEx2bH1gKTtcclxuXHJcbi8vIFx0XHRmb3IgKGNvbnN0ICRpdGVtIG9mICRjaGlsZHJlbkl0ZW1zKSB7XHJcbi8vIFx0XHRcdGNvbnN0ICRzdWJNZW51ID0gJGl0ZW0ucXVlcnlTZWxlY3RvcihgLm1lbnVfX3N1Ym1lbnVgKTtcclxuXHJcbi8vIFx0XHRcdGlmICgkc3ViTWVudSkgX3NldEx2bHMoJHN1Yk1lbnUsIGluaXRpYWxMdmwgKyAxKTtcclxuLy8gXHRcdH1cclxuLy8gXHR9XHJcblxyXG4vLyB9KG15QXBwKSk7IiwiXHJcbl9wbHVnaW5zLk51bWJlclNsaWRlciA9IChmdW5jdGlvbiAoKSB7XHJcblx0ZnVuY3Rpb24gX3BsdWdpbihzZWxlY3Rvciwgb3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLiRlbCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxyXG5cdFx0XHQ6IHNlbGVjdG9yO1xyXG5cdFx0dGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XHJcblx0XHRcdGlucHV0Q2xhc3M6IFwianMtbnVtYmVyLXNsaWRlci1pbnB1dFwiLFxyXG5cdFx0XHRhZGRDbGFzczogXCJqcy1udW1iZXItc2xpZGVyLWFkZFwiLFxyXG5cdFx0XHRyZWR1Y2VDbGFzczogXCJqcy1udW1iZXItc2xpZGVyLXJlZHVjZVwiLFxyXG5cdFx0XHRtaW5WYWx1ZTogMSxcclxuXHRcdH0sIG9wdGlvbnMpO1xyXG5cdFx0dGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLm9wdGlvbnMuaW5wdXRDbGFzc31gKTtcclxuXHRcdHRoaXMubWluVmFsdWUgPSB0aGlzLiRpbnB1dC5nZXRBdHRyaWJ1dGUoJ21pbicpIHx8IHRoaXMub3B0aW9ucy5taW5WYWx1ZTtcclxuXHJcblx0XHR0aGlzLmluaXQoKTtcclxuXHR9XHJcblxyXG5cdF9wbHVnaW4ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tIYW5kZXIuYmluZCh0aGlzKSk7XHJcblx0XHR0aGlzLiRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLmlucHV0Q2hhbmdlSGFuZGxlci5iaW5kKHRoaXMpKTtcclxuXHR9XHJcblxyXG5cdF9wbHVnaW4ucHJvdG90eXBlLmNsaWNrSGFuZGVyID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldC5jbG9zZXN0KGAuJHt0aGlzLm9wdGlvbnMuYWRkQ2xhc3N9YCkpIHtcclxuXHRcdFx0Y29uc3Qgb2xkID0gcGFyc2VGbG9hdCh0aGlzLiRpbnB1dC52YWx1ZSkgKyAxO1xyXG5cdFx0XHR0aGlzLiRpbnB1dC52YWx1ZSA9IGlzRmluaXRlKG9sZCkgPyBvbGQgOiB0aGlzLm1pblZhbHVlO1xyXG5cdFx0fSBlbHNlIGlmIChlLnRhcmdldC5jbG9zZXN0KGAuJHt0aGlzLm9wdGlvbnMucmVkdWNlQ2xhc3N9YCkpIHtcclxuXHRcdFx0bGV0IG9sZFZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLiRpbnB1dC52YWx1ZSk7XHJcblx0XHRcdGlmIChpc05hTihvbGRWYWx1ZSkpIHJldHVybiB0aGlzLiRpbnB1dC52YWx1ZSA9IHRoaXMubWluVmFsdWU7XHJcblx0XHRcdHRoaXMuJGlucHV0LnZhbHVlID0gKG9sZFZhbHVlIC0gMSA8PSB0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiAtLW9sZFZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0X3BsdWdpbi5wcm90b3R5cGUuaW5wdXRDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCB2YWx1ZSA9IHBhcnNlRmxvYXQodGhpcy4kaW5wdXQudmFsdWUpO1xyXG5cdFx0bGV0IG5ld1ZhbHVlO1xyXG5cclxuXHRcdGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPCB0aGlzLm9wdGlvbnMubWluVmFsdWUpIHtcclxuXHRcdFx0bmV3VmFsdWUgPSB0aGlzLm9wdGlvbnMubWluVmFsdWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuZXdWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuJGlucHV0LnZhbHVlID0gbmV3VmFsdWU7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gX3BsdWdpbjtcclxufSgpKTtcclxuXHJcbiIsIi8vINCw0L3QuNC80LDRhtC40Y8g0YHQutGA0L7Qu9CwINC+0LrQvdCwINCx0YDQsNGD0LfQtdGA0LBcbl9wbHVnaW5zLnNjcm9sbFdpbmRvdyA9IGZ1bmN0aW9uIGZ1bmMoKSB7XG5cdGlmIChmdW5jLmluc3RhbmNlKSB7XG5cdFx0cmV0dXJuIGZ1bmMuaW5zdGFuY2U7XG5cdH1cblxuXHRsZXQgc2Nyb2xsQW5pbWF0aW9uSWQgPSAwO1xuXHRsZXQgY3VycmVudFNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcblx0bGV0IHNjcm9sbHMgPSBmYWxzZTtcblxuXHRmdW5jdGlvbiBfc3RhcnRBbWltYXRpb25TY3JvbGwobmV3U2Nyb2xsWSwgY2FsbGJhY2spIHtcblx0XHRpZiAoIXNjcm9sbHMpIHtcblx0XHRcdGN1cnJlbnRTY3JvbGwgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG5cdFx0XHRzY3JvbGxzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRzY3JvbGxBbmltYXRpb25JZCsrO1xuXHRcdGNvbnN0IGRlbHRhU2Nyb2xsID0gKG5ld1Njcm9sbFkgLSBjdXJyZW50U2Nyb2xsKTtcblxuXHRcdGN1cnJlbnRTY3JvbGwgKz0gZGVsdGFTY3JvbGwgKiAwLjE1O1xuXHRcdHdpbmRvdy5zY3JvbGxUbygwLCBjdXJyZW50U2Nyb2xsKTtcblxuXHRcdGlmIChNYXRoLmFicyhkZWx0YVNjcm9sbCkgPiA1KSB7XG5cdFx0XHRzY3JvbGxBbmltYXRpb25JZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRfc3RhcnRBbWltYXRpb25TY3JvbGwobmV3U2Nyb2xsWSk7XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgbmV3U2Nyb2xsWSk7XG5cdFx0XHRzdG9wQW5pbWF0aW9uU2Nyb2xsKCk7XG5cblx0XHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc3RvcEFuaW1hdGlvblNjcm9sbCgpIHtcblx0XHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoc2Nyb2xsQW5pbWF0aW9uSWQpO1xuXHRcdHNjcm9sbHMgPSBmYWxzZTtcblx0fVxuXG5cdHJldHVybiBmdW5jLmluc3RhbmNlID0ge1xuXHRcdGdldCBzY3JvbGxBbmltYXRpb25JZCgpIHtcblx0XHRcdHJldHVybiBzY3JvbGxBbmltYXRpb25JZDtcblx0XHR9LFxuXHRcdHN0YXJ0QW1pbWF0aW9uU2Nyb2xsKCkge1xuXHRcdFx0c3RvcEFuaW1hdGlvblNjcm9sbCgpO1xuXHRcdFx0X3N0YXJ0QW1pbWF0aW9uU2Nyb2xsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fSxcblx0XHRzdG9wQW5pbWF0aW9uU2Nyb2xsLFxuXHR9XG59O1xuXG4iLCIvL3NsaWRlclxuX3BsdWdpbnMuc2xpZGVyID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRpb24gPSB7fSkge1xuXHRjb25zdCAkc2xpZGVyID0gKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgOiBzZWxlY3Rvcjtcblx0Y29uc3QgJHNsaWRlcldyYXAgPSAkc2xpZGVyLmNsb3Nlc3QoJy5zbGlkZXItd3JhcCcpO1xuXG5cdGNvbnN0IHNldGluZ3MgPSB7XG5cdFx0bmF2aWdhdGlvbjogJHNsaWRlcldyYXAucXVlcnlTZWxlY3RvcignLnNsaWRlci1uYXYnKSxcblx0XHRwYWdpbmF0aW9uOiAkc2xpZGVyV3JhcC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLXBhZ2luYXRpb24nKSxcblx0XHRzY3JvbGxiYXI6ICRzbGlkZXJXcmFwLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItc2Nyb2xsYmFyJyksXG5cdFx0b3B0aW9uczoge1xuXHRcdFx0d2F0Y2hPdmVyZmxvdzogdHJ1ZSxcblx0XHRcdC4uLm9wdGlvbixcblx0XHR9XG5cdH1cblxuXHRPYmplY3QuYXNzaWduKHNldGluZ3Mub3B0aW9ucywge1xuXHRcdHdhdGNoU2xpZGVzVmlzaWJpbGl0eTogdHJ1ZSxcblx0XHR3YXRjaE92ZXJmbG93OiB0cnVlLFxuXHRcdGF1dG9wbGF5OiAoKyRzbGlkZXIuZGF0YXNldC5zbGlkZXJBdXRvcGxheSA+IDApID8ge1xuXHRcdFx0ZGVsYXk6ICskc2xpZGVyLmRhdGFzZXQuc2xpZGVyQXV0b3BsYXksXG5cdFx0XHRwYXVzZU9uTW91c2VFbnRlcjogdHJ1ZSxcblx0XHRcdGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcblx0XHR9IDogJycsXG5cdFx0bmF2aWdhdGlvbjogc2V0aW5ncy5uYXZpZ2F0aW9uID8ge1xuXHRcdFx0bmV4dEVsOiAkc2xpZGVyV3JhcC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWFyci0tbmV4dCcpLFxuXHRcdFx0cHJldkVsOiAkc2xpZGVyV3JhcC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWFyci0tcHJldicpLFxuXHRcdH0gOiAnJyxcblx0XHRzY3JvbGxiYXI6IHNldGluZ3Muc2Nyb2xsYmFyID8ge1xuXHRcdFx0ZWw6IHNldGluZ3Muc2Nyb2xsYmFyLFxuXHRcdFx0ZHJhZ2dhYmxlOiB0cnVlLFxuXHRcdH0gOiAnJyxcblx0XHRwYWdpbmF0aW9uOiBzZXRpbmdzLnBhZ2luYXRpb24gPyB7XG5cdFx0XHRlbDogJHNsaWRlcldyYXAucXVlcnlTZWxlY3RvcignLnNsaWRlci1wYWdpbmF0aW9uJyksXG5cdFx0XHRjbGlja2FibGU6IHRydWUsXG5cdFx0fSA6ICcnLFxuXHR9KTtcblxuXHRyZXR1cm4gbmV3IFN3aXBlcigkc2xpZGVyLCBzZXRpbmdzLm9wdGlvbnMpO1xufTtcbiIsIihmdW5jdGlvbigpIHtcclxuXHRmdW5jdGlvbiBmaW5kSW5kZXgoJG9iaiwgJGl0ZW0pIHtcclxuXHRcdGxldCBpbmRleCA9IG51bGw7XHJcblxyXG5cdFx0JG9iai5lYWNoKChpLCBpdGVtKSA9PiB7XHJcblx0XHRcdGlmIChpdGVtID09PSAkaXRlbVswXSkge1xyXG5cdFx0XHRcdGluZGV4ID0gaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdHJldHVybiBpbmRleDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGluaXRUYWJzSXRlbSgkdGFicywgJHRhYnNJdGVtQWN0aXZlKSB7XHJcblx0XHRjb25zdCBkYXRhVGFicyA9ICR0YWJzLmF0dHIoJ2RhdGEtdGFicycpO1xyXG5cclxuXHRcdGlmIChkYXRhVGFicykge1xyXG5cdFx0XHRjb25zdCAkaXRlbXNUYWJzID0gJHRhYnMuZmluZCgnLnRhYnNfX2l0ZW0nKTtcclxuXHJcblx0XHRcdCRpdGVtc1RhYnMuZWFjaChmdW5jdGlvbihpKSB7XHJcblx0XHRcdFx0Y29uc3QgJHNlY3Rpb25zVGFicyA9ICQoYFtkYXRhLXRhYnM9XCIke2RhdGFUYWJzfSwgJHtpfVwiXWApO1xyXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gZmluZEluZGV4KCRpdGVtc1RhYnMsICR0YWJzSXRlbUFjdGl2ZSk7XHJcblx0XHRcdFx0Y29uc3QgJHVubG9hZGVkU3JjID0gJHNlY3Rpb25zVGFicy5maW5kKCdbZGF0YS1zcmNdJyk7IFxyXG5cclxuXHRcdFx0XHRpZiAoaW5kZXggIT09IGkpIHtcclxuXHRcdFx0XHRcdCRzZWN0aW9uc1RhYnMuYXR0cignaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCQoYFtkYXRhLXRhYnM9XCIke2RhdGFUYWJzfSwgJHtpbmRleH1cIl1gKS5yZW1vdmVBdHRyKCdoaWRkZW4nKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoJHVubG9hZGVkU3JjLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHQkdW5sb2FkZWRTcmMuZWFjaCgoaSwgaXRlbSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IHNyYyA9ICQoaXRlbSkuZGF0YSgnc3JjJyk7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0JChpdGVtKS5hdHRyKCdzcmMnLCBzcmMpLnJlbW92ZUF0dHIoJ2RhdGEtc3JjJyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHJcblx0XHQkdGFicy50cmlnZ2VyKCd0YWJzOmNoYW5nZScpO1xyXG5cdH1cclxuXHRcclxuXHQkKCcudGFicycpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zdCAkdGFicyA9ICQodGhpcyk7XHJcblx0XHRsZXQgJHRhYnNJdGVtQWN0aXZlID0gJHRhYnMuZmluZCgnLnRhYnNfX2l0ZW0uYWN0aXZlJyk7XHJcblx0XHJcblx0XHRpZiAoJHRhYnNJdGVtQWN0aXZlLmxlbmd0aCAhPT0gMSkge1xyXG5cdFx0XHRjb25zdCAkdGFic0l0ZW1zID0gJHRhYnMuZmluZCgnLnRhYnNfX2l0ZW0nKTtcclxuXHRcclxuXHRcdFx0JHRhYnNJdGVtcy5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdCR0YWJzSXRlbXMuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHQkdGFic0l0ZW1BY3RpdmUgPSAkdGFic0l0ZW1zLmVxKDApO1xyXG5cdFx0fVxyXG5cdFxyXG5cdFx0aW5pdFRhYnNJdGVtKCR0YWJzLCAkdGFic0l0ZW1BY3RpdmUpO1xyXG5cdFxyXG5cdFx0JHRhYnMudHJpZ2dlcihcInRhYnM6aW5pdFwiKTtcclxuXHR9KTtcclxuXHRcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnRhYnNfX2l0ZW0nLCBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnN0ICR0YWJzSXRlbSA9ICQodGhpcyk7XHJcblx0XHRjb25zdCAkdGFicyA9ICR0YWJzSXRlbS5jbG9zZXN0KCcudGFicycpO1xyXG5cdFx0Y29uc3QgJHRhYnNJdGVtcyA9ICR0YWJzLmZpbmQoJy50YWJzX19pdGVtJyk7XHJcblx0XHJcblx0XHQkdGFic0l0ZW1zLm5vdCgkdGFic0l0ZW0pLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdCR0YWJzSXRlbS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHJcblx0XHRpbml0VGFic0l0ZW0oJHRhYnMsICR0YWJzSXRlbSk7XHJcblx0fSk7XHJcblx0XHJcbn0oKSk7IiwiLy9cdG1vZGFsIHdpbmRvd1xyXG5fcGx1Z2lucy5tb2RhbFdpbmRvdyA9IChmdW5jdGlvbiAoKSB7XHJcblx0Y29uc3QgJGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksXHJcblx0XHQkbW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnYtbW9kYWwnKSxcclxuXHRcdHRyaWdnZXJTZWxlY3RvciA9ICdbZGF0YS10b2dnbGUtbW9kYWxdJyxcclxuXHRcdGJ0bkNsb3NlU2VsZWN0b3IgPSAnW2RhdGEtZGlzc21pcz1cIm1vZGFsXCJdJztcclxuXHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0Y29uc3QgJHRyaWdnZXIgPSBlLnRhcmdldC5jbG9zZXN0KGAke3RyaWdnZXJTZWxlY3Rvcn1gKTtcclxuXHJcblx0XHRpZiAoJHRyaWdnZXIpIHtcclxuXHRcdFx0Y29uc3QgdHlwZU1vZGFsID0gJHRyaWdnZXIuZGF0YXNldFsndG9nZ2xlTW9kYWwnXTtcclxuXHJcblx0XHRcdGlmICghdHlwZU1vZGFsKSByZXR1cm47XHJcblxyXG5cdFx0XHRmb3IgKGxldCAkbW9kYWwgb2YgJG1vZGFscykge1xyXG5cdFx0XHRcdGlmICgkbW9kYWwuaWQgJiYgJG1vZGFsLmlkID09PSB0eXBlTW9kYWwpIHtcclxuXHRcdFx0XHRcdCRtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRjb25zdCBzY3JvbGxCYXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gJGJvZHkub2Zmc2V0V2lkdGg7XHJcblx0XHRcdFx0XHQkYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdFx0XHRcdFx0JGJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc2Nyb2xsQmFyV2lkdGggKyBcInB4XCI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2LW1vZGFsJykgfHwgZS50YXJnZXQuY2xvc2VzdChgJHtidG5DbG9zZVNlbGVjdG9yfWApKSB7XHJcblx0XHRcdGUudGFyZ2V0LmNsb3Nlc3QoJy52LW1vZGFsJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdCRib2R5LnN0eWxlLm92ZXJmbG93ID0gJyc7XHJcblx0XHRcdCRib2R5LnN0eWxlLnBhZGRpbmdSaWdodCA9IFwiXCI7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChjb25zdCAkbW9kYWwgb2YgJG1vZGFscykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygkbW9kYWwuaWQpO1xyXG5cdFx0XHRpZiAoJG1vZGFsLmlkID09PSAnZmxhc2gnKSB7XHJcblx0XHRcdFx0Y29uc3QgcGVyaW9kRGlzcGxheSA9ICRtb2RhbC5kYXRhc2V0LnBlcmlvZERpc3BsYXkgfHwgMjtcclxuXHRcclxuXHRcdFx0XHRpZiAoIWxvY2FsU3RvcmFnZS5sYXN0VmlzaXQpIHtcclxuXHRcdFx0XHRcdHNob3coJG1vZGFsKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKChEYXRlLm5vdygpIC0gK2xvY2FsU3RvcmFnZS5sYXN0VmlzaXQpIC8gKHBlcmlvZERpc3BsYXkgKiAxMDAwICogMzYwMCkgPj0gMSkge1xyXG5cdFx0XHRcdFx0c2hvdygkbW9kYWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFxyXG5cdFx0ZnVuY3Rpb24gc2hvdyhlbCkge1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnbGFzdFZpc2l0JywgRGF0ZS5ub3coKSk7XHJcblx0XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59KCkpOyIsIi8vdmlkZW9cclxuKGZ1bmN0aW9uICgpIHtcclxuXHRmaW5kVmlkZW9zKCk7XHJcblxyXG5cdGZ1bmN0aW9uIGZpbmRWaWRlb3MoKSB7XHJcblx0XHRsZXQgdmlkZW9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnZpZGVvJyk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB2aWRlb3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0c2V0dXBWaWRlbyh2aWRlb3NbaV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8g0LvQtdC90LjQstCw0Y8g0LfQsNCz0YDRg9C30LrQsCDQstC40LTQtdC+IFxyXG5cdGZ1bmN0aW9uIHNldHVwVmlkZW8odmlkZW8pIHtcclxuXHRcdGxldCBsaW5rID0gdmlkZW8ucXVlcnlTZWxlY3RvcignLnZpZGVvX19saW5rJyk7XHJcblx0XHRjb25zdCBocmVmTGluayA9IGxpbmsuaHJlZjtcclxuXHRcdGxldCBtZWRpYSA9IHZpZGVvLnF1ZXJ5U2VsZWN0b3IoJy52aWRlb19fbWVkaWEnKTtcclxuXHRcdGxldCBidXR0b24gPSB2aWRlby5xdWVyeVNlbGVjdG9yKCcudmlkZW9fX2J1dHRvbicpO1xyXG5cdFx0bGV0IGRlbGV0ZWRMZW5ndGggPSAnaHR0cHM6Ly95b3V0dS5iZS8nLmxlbmd0aDtcclxuXHRcdGxldCB2aWRlb0lkID0gaHJlZkxpbmsuc3Vic3RyaW5nKGRlbGV0ZWRMZW5ndGgsIGhyZWZMaW5rLmxlbmd0aCk7XHJcblx0XHRsZXQgeW91dHViZUltZ1NyYyA9ICdodHRwczovL2kueXRpbWcuY29tL3ZpLycgKyB2aWRlb0lkICsgJy9tYXhyZXNkZWZhdWx0LmpwZyc7XHJcblxyXG5cdFx0bWVkaWEuc3JjID0geW91dHViZUltZ1NyYztcclxuXHJcblx0XHR2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0bGV0IGlmcmFtZSA9IGNyZWF0ZUlmcmFtZSh2aWRlb0lkKTtcclxuXHJcblx0XHRcdGxpbmsucmVtb3ZlKCk7XHJcblx0XHRcdGJ1dHRvbi5yZW1vdmUoKTtcclxuXHRcdFx0dmlkZW8uYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxpbmsucmVtb3ZlQXR0cmlidXRlKCdocmVmJyk7XHJcblx0XHR2aWRlby5jbGFzc0xpc3QuYWRkKCd2aWRlby0tZW5hYmxlZCcpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY3JlYXRlSWZyYW1lKGlkKSB7XHJcblx0XHRsZXQgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XHJcblxyXG5cdFx0aWZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3dmdWxsc2NyZWVuJywgJycpO1xyXG5cdFx0aWZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3cnLCAnYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsnKTtcclxuXHRcdGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGdlbmVyYXRlVVJMKGlkKSk7XHJcblx0XHRpZnJhbWUuY2xhc3NMaXN0LmFkZCgndmlkZW9fX21lZGlhJyk7XHJcblxyXG5cdFx0cmV0dXJuIGlmcmFtZTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdlbmVyYXRlVVJMKGlkKSB7XHJcblx0XHRsZXQgcXVlcnkgPSAnP3JlbD0wJnNob3dpbmZvPTEmYXV0b3BsYXk9MSc7XHJcblxyXG5cdFx0cmV0dXJuICdodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgaWQgKyBxdWVyeTtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcclxuXHRjb25zdCBfdXRpbHMgPSBhcHAudXRpbHM7XHJcblx0Y29uc3QgX3BsdWdpbnMgPSBhcHAucGx1Z2lucztcclxuXHRjb25zdCAkaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHRjb25zdCAkYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHRhcHAuJGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKTtcclxuXHRhcHAuc2Nyb2xsaW5nV2luZG93ID0gX3BsdWdpbnMuc2Nyb2xsV2luZG93KCk7XHJcblxyXG5cdGFwcC5pc0ZpeGVkSGVhZGVyICYmICRodG1sLmNsYXNzTGlzdC5hZGQoJ2lzLWZpeGVkLWhlYWRlcicpO1xyXG5cclxuXHQvLyBcdG1haW4gc2xpZGVyIFxyXG5cdGlmIChfdXRpbHMuaXNFbGVtKCcubWFpbi1zbGlkZXInKSkge1xyXG5cdFx0Y29uc3Qgc2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLXNsaWRlcicpO1xyXG5cclxuXHRcdGNvbnN0IHN3aXBlciA9IF9wbHVnaW5zLnNsaWRlcihzbGlkZXJOb2RlLCB7XHJcblx0XHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRcdG5vU3dpcGluZ0NsYXNzOiAnYnRuJyxcclxuXHRcdFx0d2F0Y2hTbGlkZXNWaXNpYmlsaXR5OiB0cnVlLFxyXG5cdFx0XHR3YXRjaE92ZXJmbG93OiB0cnVlLFxyXG5cdFx0XHRzcGVlZDogMTAwMCxcclxuXHRcdFx0YXV0b3BsYXk6IHtcclxuXHRcdFx0XHRkZWxheTogNDAwMCxcclxuXHRcdFx0XHRwYXVzZU9uTW91c2VFbnRlcjogdHJ1ZSxcclxuXHRcdFx0XHRkaXNhYmxlT25JbnRlcmFjdGlvbjogZmFsc2UsXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gXHRtYWluIHNsaWRlciBcclxuXHRpZiAoX3V0aWxzLmlzRWxlbSgnLmNhdGFsb2ctc2xpZGVyJykpIHtcclxuXHRcdGNvbnN0IHNsaWRlckVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jYXRhbG9nLXNsaWRlcicpO1xyXG5cclxuXHRcdGZvciAoY29uc3Qgc2xpZGVyRWwgb2Ygc2xpZGVyRWxzKSB7XHJcblx0XHRcdGNvbnN0IHN3aXBlciA9IF9wbHVnaW5zLnNsaWRlcihzbGlkZXJFbCwge1xyXG5cdFx0XHRcdGdyYWJDdXJzb3I6IHRydWUsXHJcblx0XHRcdFx0d2F0Y2hTbGlkZXNWaXNpYmlsaXR5OiB0cnVlLFxyXG5cdFx0XHRcdHdhdGNoT3ZlcmZsb3c6IHRydWUsXHJcblx0XHRcdFx0c2xpZGVzUGVyVmlldzogJ2F1dG8nLFxyXG5cdFx0XHRcdHNwYWNlQmV0d2VlbjogNSxcclxuXHRcdFx0XHRzcGVlZDogMTAwMCxcclxuXHRcdFx0XHRhdXRvcGxheToge1xyXG5cdFx0XHRcdFx0ZGVsYXk6IDQwMDAsXHJcblx0XHRcdFx0XHRwYXVzZU9uTW91c2VFbnRlcjogdHJ1ZSxcclxuXHRcdFx0XHRcdGRpc2FibGVPbkludGVyYWN0aW9uOiBmYWxzZSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGJyZWFrcG9pbnRzOiB7XHJcblx0XHRcdFx0XHQzMDA6IHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlZDogZmFsc2UsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0W2FwcC5icmVha3BvaW50cy5zbV06IHtcclxuXHRcdFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBwcm9kdWN0cyBzbGlkZXJcdFxyXG5cdGlmIChfdXRpbHMuaXNFbGVtKCcucHJvZHVjdHMtc2xpZGVyJykpIHtcclxuXHRcdGNvbnN0ICRwcm9kdWN0c1NsaWRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvZHVjdHMtc2xpZGVyJyk7XHJcblxyXG5cdFx0X3V0aWxzLmZvckVhY2goJHByb2R1Y3RzU2xpZGVycywgZnVuY3Rpb24gKCRzbGlkZXIpIHtcclxuXHRcdFx0Y29uc3Qgc3dpcGVyID0gX3BsdWdpbnMuc2xpZGVyKCRzbGlkZXIsIHtcclxuXHRcdFx0XHRncmFiQ3Vyc29yOiB0cnVlLFxyXG5cdFx0XHRcdGxvb3BBZGRpdGlvbmFsU2xpZGVzOiAxLFxyXG5cdFx0XHRcdHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXHJcblx0XHRcdFx0d2F0Y2hPdmVyZmxvdzogdHJ1ZSxcclxuXHRcdFx0XHRkeW5hbWljQnVsbGV0czogdHJ1ZSxcclxuXHRcdFx0XHRzcGFjZUJldHdlZW46IDAsXHJcblx0XHRcdFx0c3BlZWQ6IDEwMDAsXHJcblx0XHRcdFx0YnJlYWtwb2ludHM6IHtcclxuXHRcdFx0XHRcdDMwMDoge1xyXG5cdFx0XHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAxLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNQZXJHcm91cDogMSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQ1MDA6IHtcclxuXHRcdFx0XHRcdFx0c2xpZGVzUGVyVmlldzogMixcclxuXHRcdFx0XHRcdFx0c2xpZGVzUGVyR3JvdXA6IDIsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0W2FwcC5icmVha3BvaW50cy5tZCArIDFdOiB7XHJcblx0XHRcdFx0XHRcdHNsaWRlc1BlclZpZXc6IDIsXHJcblx0XHRcdFx0XHRcdHNsaWRlc1Blckdyb3VwOiAyLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFthcHAuYnJlYWtwb2ludHMubGcgKyAxXToge1xyXG5cdFx0XHRcdFx0XHRzbGlkZXNQZXJWaWV3OiAzLFxyXG5cdFx0XHRcdFx0XHRzbGlkZXNQZXJHcm91cDogMyxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly9maXhlZCBoZWFkZXJcclxuXHRpZiAoX3V0aWxzLmlzRWxlbSgnaGVhZGVyJykpIHtcclxuXHRcdHNob3dIZWFkZXIoJ2hlYWRlcicpO1xyXG5cdFx0XHJcblx0XHRmdW5jdGlvbiBzaG93SGVhZGVyKGVsKSB7XHJcblx0XHRcdGNvbnN0ICRlbCA9ICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpIDogZWw7XHJcblx0XHRcdGNvbnN0ICRodG1sRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblx0XHRcdGxldCBmaXhpbmdJbmRlbnQgPSAkZWwuZGF0YXNldC5maXhpbmdJbmRldCB8fCAkZWwub2Zmc2V0SGVpZ2h0ICsgNDA7XHJcblx0XHRcdGxldCBpc0ZpeGVkID0gZmFsc2U7XHJcblxyXG5cdFx0XHRfc2Nyb2xsSGFuZGxlcigpO1xyXG5cclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIF9zY3JvbGxIYW5kbGVyKVxyXG5cclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRmaXhpbmdJbmRlbnQgPSAkZWwuZGF0YXNldC5maXhpbmdJbmRldCB8fCAkZWwub2Zmc2V0SGVpZ2h0ICsgNDA7XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfc2Nyb2xsSGFuZGxlcigpIHtcclxuXHRcdFx0XHRpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gZml4aW5nSW5kZW50KSB7XHJcblx0XHRcdFx0XHRzaG93KCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPCBmaXhpbmdJbmRlbnQpIHtcclxuXHRcdFx0XHRcdGZpeGVkKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzaG93KCkge1xyXG5cdFx0XHRcdGlmIChpc0ZpeGVkKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdCRodG1sRWwuc3R5bGUucGFkZGluZ1RvcCA9ICRlbC5vZmZzZXRIZWlnaHQgKyBcInB4XCI7XHJcblx0XHRcdFx0JGVsLmNsYXNzTGlzdC5hZGQoJ2ZpeGVkJyk7XHJcblx0XHRcdFx0aXNGaXhlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIGZpeGVkKCkge1xyXG5cdFx0XHRcdGlmICghaXNGaXhlZCkgcmV0dXJuO1xyXG5cclxuXHRcdFx0XHQkZWwuY2xhc3NMaXN0LnJlbW92ZSgnZml4ZWQnKTtcclxuXHRcdFx0XHQkaHRtbEVsLnN0eWxlLnBhZGRpbmdUb3AgPSAnJztcclxuXHRcdFx0XHRpc0ZpeGVkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0c2hvdyxcclxuXHRcdFx0XHRmaXhlZCxcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCQoXCIuZmlsdGVyc1wiKS5sZW5ndGgpIHtcclxuXHRcdGNvbnN0ICRmaWx0ZXJzQmxvY2sgPSAkKFwiLmZpbHRlcnNcIik7XHJcblxyXG5cdFx0JGZpbHRlcnNCbG9jay5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0bGV0IHRhcmdlRWwgPSBlLnRhcmdldDtcclxuXHJcblx0XHRcdGlmICh0YXJnZUVsLmNsb3Nlc3QoJy5maWx0ZXJzX19maWVsZC10aXRsZScpKSB7XHJcblx0XHRcdFx0Y29uc3QgJHBhcmVudCA9ICQodGFyZ2VFbCkuY2xvc2VzdChcIi5maWx0ZXJzX19maWVsZFwiKTtcclxuXHRcdFx0XHRjb25zdCAkaW5uZXJGaWVsZCA9ICRwYXJlbnQuZmluZCgnLmZpbHRlcnNfX2ZpZWxkLWJveCcpO1xyXG5cclxuXHRcdFx0XHRpZiAoJHBhcmVudC5oYXNDbGFzcyhcImZpbHRlcnNfX2ZpZWxkLS11bm9wZW5lZFwiKSkge1xyXG5cdFx0XHRcdFx0JHBhcmVudC5yZW1vdmVDbGFzcyhcImZpbHRlcnNfX2ZpZWxkLS11bm9wZW5lZFwiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0JHBhcmVudC5hZGRDbGFzcyhcImZpbHRlcnNfX2ZpZWxkLS11bm9wZW5lZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0JGlubmVyRmllbGQuc2xpZGVUb2dnbGUoMzAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdC8vIGJ0biB0b3AgXHJcblx0aWYgKF91dGlscy5pc0VsZW0oJy5idG4tdG9wJykpIHtcclxuXHRcdGNvbnN0IGJ0bkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi10b3AnKTtcclxuXHJcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgX3V0aWxzLnRocm90dGxlKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZygzMzIpO1xyXG5cdFx0XHRpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpKSB7XHJcblx0XHRcdFx0YnRuRWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAod2luZG93LnBhZ2VZT2Zmc2V0IDwgKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICYmIGJ0bkVsLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuXHRcdFx0XHRidG5FbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSwgMjAwKSk7XHJcblx0fVxyXG5cclxuXHQvLyBwcm9kdWN0IGdhbGxlcnlcclxuXHQvLyBpZiAoX3V0aWxzLmlzRWxlbSgnLmdhbGxlcnknKSkge1xyXG5cdC8vIFx0Zm9yIChjb25zdCBnYWxsZXJ5RWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmdhbGxlcnknKSkge1xyXG5cdC8vIFx0XHRnYWxsZXJ5KGdhbGxlcnlFbCk7XHJcblx0Ly8gXHR9XHJcblxyXG5cdC8vIFx0ZnVuY3Rpb24gZ2FsbGVyeSgkZWwpIHtcclxuXHQvLyBcdFx0Y29uc3QgJGZ1bGxTbGlkZXIgPSAkZWwucXVlcnlTZWxlY3RvcignLmdhbGxlcnlfX3NsaWRlcicpO1xyXG5cdC8vIFx0XHRjb25zdCAkdGh1bWJzU2xpZGVyID0gJGVsLnF1ZXJ5U2VsZWN0b3IoJy5nYWxsZXJ5X190aHVtYnMnKTtcclxuXHJcblx0Ly8gXHRcdC8qIHRodW1icyAqL1xyXG5cdC8vIFx0XHRsZXQgZ2FsbGVyeVRodW1icyA9IG5ldyBTd2lwZXIoJHRodW1ic1NsaWRlciwge1xyXG5cdC8vIFx0XHRcdHNwYWNlQmV0d2VlbjogMzAsXHJcblx0Ly8gXHRcdFx0c2xpZGVzUGVyVmlldzogXCJhdXRvXCIsXHJcblx0Ly8gXHRcdFx0d2F0Y2hTbGlkZXNQcm9ncmVzczogdHJ1ZSxcclxuXHQvLyBcdFx0XHRmcmVlTW9kZToge1xyXG5cdC8vIFx0XHRcdFx0ZW5hYmxlZDogdHJ1ZSxcclxuXHQvLyBcdFx0XHRcdHN0aWNreTogdHJ1ZSxcclxuXHQvLyBcdFx0XHR9LFxyXG5cdC8vIFx0XHRcdGJyZWFrcG9pbnRzOiB7XHJcblx0Ly8gXHRcdFx0XHQzMDA6IHtcclxuXHQvLyBcdFx0XHRcdFx0c3BhY2VCZXR3ZWVuOiAxNyxcclxuXHQvLyBcdFx0XHRcdH0sXHJcblx0Ly8gXHRcdFx0XHRbYXBwLmJyZWFrcG9pbnRzLnNtXToge1xyXG5cdC8vIFx0XHRcdFx0XHRzcGFjZUJldHdlZW46IDMwLFxyXG5cdC8vIFx0XHRcdFx0fVxyXG5cdC8vIFx0XHRcdH0sXHJcblx0Ly8gXHRcdFx0a2V5Ym9hcmQ6IHtcclxuXHQvLyBcdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0Ly8gXHRcdFx0XHRvbmx5SW5WaWV3cG9ydDogZmFsc2VcclxuXHQvLyBcdFx0XHR9LFxyXG5cdC8vIFx0XHRcdG1vdXNld2hlZWw6IHRydWUsXHJcblx0Ly8gXHRcdH0pO1xyXG5cclxuXHQvLyBcdFx0bGV0IGdhbGxlcnlGdWxsID0gbmV3IFN3aXBlcigkZnVsbFNsaWRlciwge1xyXG5cdC8vIFx0XHRcdHNwYWNlQmV0d2VlbjogMTAsXHJcblx0Ly8gXHRcdFx0c2xpZGVzUGVyVmlldzogXCJhdXRvXCIsXHJcblx0Ly8gXHRcdFx0Ly8gYXV0b3BsYXk6IHtcclxuXHQvLyBcdFx0XHQvLyBcdGRlbGF5OiA1MDAwXHJcblx0Ly8gXHRcdFx0Ly8gfSxcclxuXHQvLyBcdFx0XHQvLyBuYXZpZ2F0aW9uOiB7XHJcblx0Ly8gXHRcdFx0Ly8gXHRwcmV2RWw6ICRmdWxsU2xpZGVyLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlci1hcnItLXByZXYnKSxcclxuXHQvLyBcdFx0XHQvLyBcdG5leHRFbDogJGZ1bGxTbGlkZXIucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVyLWFyci0tbmV4dCcpLFxyXG5cdC8vIFx0XHRcdC8vIH0sXHJcblx0Ly8gXHRcdFx0Ly8ga2V5Ym9hcmQ6IHtcclxuXHQvLyBcdFx0XHQvLyBcdGVuYWJsZWQ6IHRydWUsXHJcblx0Ly8gXHRcdFx0Ly8gXHRvbmx5SW5WaWV3cG9ydDogZmFsc2VcclxuXHQvLyBcdFx0XHQvLyB9LFxyXG5cdC8vIFx0XHRcdHRodW1iczoge1xyXG5cdC8vIFx0XHRcdFx0c3dpcGVyOiBnYWxsZXJ5VGh1bWJzLFxyXG5cdC8vIFx0XHRcdH0sXHJcblx0Ly8gXHRcdH0pO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0XHJcblxyXG5cdC8vIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc29ydCcpKSB7XHJcblx0Ly8gXHRjb25zdCBzb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvcnQnKTtcclxuXHQvLyBcdGNvbnN0IHZhbHVlU29ydCA9IHNvcnQucXVlcnlTZWxlY3RvcignLnNvcnRfX3ZhbCcpO1xyXG5cdC8vIFx0Y29uc3QgYWN0aXZlSXRlbSA9IHNvcnQucXVlcnlTZWxlY3RvcignLnNvcnRfX2l0ZW0uYWN0aXZlJyk7XHJcblx0Ly8gXHRjb25zdCB0b2dnbGVDbGFzcyA9ICdqLXNvcnQtdG9nZ2xlJztcclxuXHJcblx0Ly8gXHRpZiAoYWN0aXZlSXRlbSkge1xyXG5cdC8vIFx0XHRjb25zb2xlLmxvZyhhY3RpdmVJdGVtKTtcclxuXHQvLyBcdFx0dmFsdWVTb3J0LnRleHRDb250ZW50ID0gYWN0aXZlSXRlbS50ZXh0Q29udGVudDtcclxuXHQvLyBcdH1cclxuXHJcblx0Ly8gXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0Ly8gXHRcdGlmIChlLnRhcmdldC5jbG9zZXN0KGAuJHt0b2dnbGVDbGFzc31gKSkge1xyXG5cdC8vIFx0XHRcdHNvcnQuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblx0Ly8gXHRcdH0gZWxzZSBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnNvcnRfX2l0ZW0nKSkge1xyXG5cdC8vIFx0XHRcdGNvbnN0IHNvcnRJdGVtID0gZS50YXJnZXQuY2xvc2VzdCgnLnNvcnRfX2l0ZW0nKTtcclxuXHJcblx0Ly8gXHRcdFx0aWYgKHNvcnRJdGVtLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHJldHVybjtcclxuXHJcblx0Ly8gXHRcdFx0dmFsdWVTb3J0LnRleHRDb250ZW50ID0gc29ydEl0ZW0udGV4dENvbnRlbnQ7XHJcblx0Ly8gXHRcdH1cclxuXHJcblx0Ly8gXHRcdGlmICghZS50YXJnZXQuY2xvc2VzdChgLiR7dG9nZ2xlQ2xhc3N9YCkpIHtcclxuXHQvLyBcdFx0XHRzb3J0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcclxuXHQvLyB9XHJcblxyXG5cdC8vIGlmIChfdXRpbHMuaXNFbGVtKCcubnVtYmVyLXNsaWRlcicpKSB7XHJcblx0Ly8gXHRfdXRpbHMuZm9yRWFjaChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubnVtYmVyLXNsaWRlcicpLCBmdW5jdGlvbiAoJHNsaWRlcikge1xyXG5cdC8vIFx0XHRuZXcgX3BsdWdpbnMuTnVtYmVyU2xpZGVyKCRzbGlkZXIpO1xyXG5cdC8vIFx0fSlcclxuXHQvLyB9XHJcblxyXG5cdC8vIC8vINGE0LjQu9GM0YLRgNCw0YbQuNGPINGN0LvQtdC80LXQvdGC0L7QslxyXG5cdC8vIGlmIChfdXRpbHMuaXNFbGVtKCcuanMtYkZpbHRlcicpKSB7XHJcblx0Ly8gXHRmb3IgKGNvbnN0ICRlbCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYkZpbHRlcicpKSB7XHJcblx0Ly8gXHRcdGJGaWx0ZXIoJGVsKTtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cdC8vIC8vIHNlYXJjaFxyXG5cdC8vIGlmIChfdXRpbHMuaXNFbGVtKCdbZGF0YS1zZWFyY2gtdG9nZ2xlXScpICYmIF91dGlscy5pc0VsZW0oJ1tkYXRhLXNlYXJjaC1wYW5lbF0nKSkge1xyXG5cdC8vIFx0Y29uc3QgJGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblx0Ly8gXHRjb25zdCAkc2VhcmNoUGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zZWFyY2gtcGFuZWxdJyk7XHJcblx0Ly8gXHRjb25zdCAkaW5wdXQgPSAkc2VhcmNoUGFuZWwucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInNlYXJjaFwiXScpO1xyXG5cdC8vIFx0Y29uc3QgJGlubmVyUGFuZWwgPSAkc2VhcmNoUGFuZWwucXVlcnlTZWxlY3RvcignLnNlYXJjaC1wYW5lbF9faW5uZXInKTtcclxuXHQvLyBcdGNvbnN0ICRjbGVhckJ0biA9ICRzZWFyY2hQYW5lbC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLXBhbmVsX19jbGVhcicpXHJcblx0Ly8gXHRjb25zdCAkc2VhcmNoQnRuU2VsZWN0b3IgPSAnW2RhdGEtc2VhcmNoLXRvZ2dsZV0nO1xyXG5cdC8vIFx0Y29uc3QgJGNsb3NlUGFuZWxTZWxlY3RvciA9ICdbZGF0YS1zZWFyY2gtY2xvc2VdJztcclxuXHQvLyBcdGNvbnN0IHRvZ2dsZUNsYXNzID0gJ29wZW4nO1xyXG5cclxuXHQvLyBcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHQvLyBcdFx0aWYgKGUudGFyZ2V0LmNsb3Nlc3QoJHNlYXJjaEJ0blNlbGVjdG9yKSkge1xyXG5cdC8vIFx0XHRcdCRzZWFyY2hQYW5lbC5jbGFzc0xpc3QudG9nZ2xlKHRvZ2dsZUNsYXNzKTtcclxuXHJcblx0Ly8gXHRcdFx0aWYgKCRzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnModG9nZ2xlQ2xhc3MpKSB7XHJcblx0Ly8gXHRcdFx0XHRpZiAoJGlucHV0KSAkaW5wdXQuZm9jdXMoKTtcclxuXHQvLyBcdFx0XHRcdHRvZ2dsZU92ZXJmbG93RG9jdW1lbnQodHJ1ZSk7XHJcblx0Ly8gXHRcdFx0fSBlbHNlIHtcclxuXHQvLyBcdFx0XHRcdHRvZ2dsZU92ZXJmbG93RG9jdW1lbnQoZmFsc2UpO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fSBlbHNlIGlmICgkY2xlYXJCdG4uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcblx0Ly8gXHRcdFx0JGlucHV0LnZhbHVlID0gXCJcIjtcclxuXHQvLyBcdFx0XHQkaW5wdXQuZm9jdXMoKTtcclxuXHQvLyBcdFx0XHQkY2xlYXJCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaXMtY2xlYXInKTtcclxuXHQvLyBcdFx0fSBlbHNlIGlmIChlLnRhcmdldC5jbG9zZXN0KCRjbG9zZVBhbmVsU2VsZWN0b3IpXHJcblx0Ly8gXHRcdFx0fHwgKCFlLnRhcmdldC5jbG9zZXN0KCcuc2VhcmNoLXBhbmVsX19pbm5lcicpICYmICRzZWFyY2hQYW5lbC5jbGFzc0xpc3QuY29udGFpbnMoJ29wZW4nKSkpIHtcclxuXHQvLyBcdFx0XHQkc2VhcmNoUGFuZWwuY2xhc3NMaXN0LnJlbW92ZSh0b2dnbGVDbGFzcyk7XHJcblx0Ly8gXHRcdFx0JGlucHV0LnZhbHVlID0gJyc7XHJcblx0Ly8gXHRcdFx0JGNsZWFyQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWNsZWFyJyk7XHJcblx0Ly8gXHRcdFx0dG9nZ2xlT3ZlcmZsb3dEb2N1bWVudChmYWxzZSk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH0pO1xyXG5cclxuXHQvLyBcdCRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XHJcblx0Ly8gXHRcdGlmICh0aGlzLnZhbHVlLmxlbmd0aCAhPT0gMCkge1xyXG5cdC8vIFx0XHRcdCRjbGVhckJ0bi5jbGFzc0xpc3QuYWRkKCdpcy1jbGVhcicpO1xyXG5cdC8vIFx0XHR9IGVsc2Uge1xyXG5cdC8vIFx0XHRcdCRjbGVhckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdpcy1jbGVhcicpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcclxuXHJcblx0Ly8gXHRmdW5jdGlvbiB0b2dnbGVPdmVyZmxvd0RvY3VtZW50KGlzKSB7XHJcblx0Ly8gXHRcdGlmIChpcykge1xyXG5cdC8vIFx0XHRcdGNvbnN0IHNjcm9sbEJhcldpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSBkb2N1bWVudC5ib2R5Lm9mZnNldFdpZHRoO1xyXG5cdC8vIFx0XHRcdCRodG1sLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblx0Ly8gXHRcdFx0JGh0bWwuc3R5bGUucGFkZGluZ1JpZ2h0ID0gc2Nyb2xsQmFyV2lkdGggKyBcInB4XCI7XHJcblx0Ly8gXHRcdH0gZWxzZSB7XHJcblx0Ly8gXHRcdFx0JGh0bWwuc3R5bGUub3ZlcmZsb3cgPSAnJztcclxuXHQvLyBcdFx0XHQkaHRtbC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBcIlwiO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvLyDRhNC40LrRgdCw0YbQuNGPINC90LDQstC40LPQsNGG0LjQuCDQv9GA0L7QtNGD0LrRgtCwXHJcblx0Ly8gaWYgKF91dGlscy5pc0VsZW0oJy5uYXYtcGFuZWwnKSkge1xyXG5cdC8vIFx0Y29uc3QgJG5hdlBhbmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1wYW5lbCcpO1xyXG5cclxuXHQvLyBcdF9wbHVnaW5zLmZpeGVkRWxlbVRvcCgkbmF2UGFuZWwpO1xyXG5cclxuXHQvLyBcdGNvbnN0IG5hdkxpbmtTZWxlY3RvciA9ICdbaHJlZio9XCIjXCJdJztcclxuXHQvLyBcdGNvbnN0ICRuYXZMaW5rcyA9ICRuYXZQYW5lbC5xdWVyeVNlbGVjdG9yQWxsKG5hdkxpbmtTZWxlY3Rvcik7XHJcblx0Ly8gXHRjb25zdCBzZWN0aW9ucyA9IFtdO1xyXG5cdC8vIFx0bGV0IGluZGV4QWN0aXZlTGluayA9IG51bGw7XHJcblxyXG5cdC8vIFx0Zm9yIChjb25zdCAkbmF2TGluayBvZiAkbmF2TGlua3MpIHtcclxuXHQvLyBcdFx0Y29uc3QgaGFzaCA9ICRuYXZMaW5rLmhhc2g7XHJcblx0Ly8gXHRcdGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhhc2gpO1xyXG5cclxuXHQvLyBcdFx0aWYgKHNlY3Rpb24pIHtcclxuXHQvLyBcdFx0XHRzZWN0aW9ucy5wdXNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaGFzaCkpO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9XHJcblxyXG5cdC8vIFx0aWYgKHNlY3Rpb25zLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuXHQvLyBcdHNldEFjdGl2ZUxpbmtCeVNjcm9sbCgpO1xyXG5cclxuXHQvLyBcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzZXRBY3RpdmVMaW5rQnlTY3JvbGwpO1xyXG5cclxuXHQvLyBcdCRuYXZQYW5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblx0Ly8gXHRcdGNvbnN0IGxpbmsgPSBlLnRhcmdldC5jbG9zZXN0KCdhW2hyZWYqPVwiI1wiXScpO1xyXG5cclxuXHQvLyBcdFx0aWYgKCFsaW5rKSByZXR1cm47XHJcblxyXG5cdC8vIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0Ly8gXHRcdGNvbnN0IHNlY3Rpb25JZCA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcblx0Ly8gXHRcdGNvbnN0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlY3Rpb25JZCk7XHJcblxyXG5cdC8vIFx0XHRpZiAoIXNlY3Rpb24pIHJldHVybjtcclxuXHJcblx0Ly8gXHRcdGNvbnN0IHNlY3Rpb25PZmZzZXRUb3AgPSBfdXRpbHMuZ2V0T2Zmc2V0VG9wKHNlY3Rpb24pO1xyXG5cclxuXHQvLyBcdFx0bGV0IHNjcm9sbFBvaW50ID0gc2VjdGlvbk9mZnNldFRvcCAtICRuYXZQYW5lbC5vZmZzZXRIZWlnaHQgKyAxMDtcclxuXHQvLyBcdFx0aWYgKGFwcC5pc0ZpeGVkSGVhZGVyKSB7XHJcblx0Ly8gXHRcdFx0c2Nyb2xsUG9pbnQgPSBzY3JvbGxQb2ludCAtIGFwcC4kaGVhZGVyLm9mZnNldEhlaWdodDtcclxuXHQvLyBcdFx0fVxyXG5cclxuXHQvLyBcdFx0d2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbFBvaW50KTtcclxuXHQvLyBcdH0pXHJcblxyXG5cdC8vIFx0ZnVuY3Rpb24gc2V0QWN0aXZlTGlua0J5U2Nyb2xsKCkge1xyXG5cdC8vIFx0XHRjb25zdCB0b3BTZWN0aW9ucyA9IHNlY3Rpb25zLm1hcCgkc2VjdGlvbiA9PiB7XHJcblx0Ly8gXHRcdFx0cmV0dXJuIF91dGlscy5nZXRPZmZzZXRUb3AoJHNlY3Rpb24pO1xyXG5cdC8vIFx0XHR9KTtcclxuXHJcblx0Ly8gXHRcdGxldCBjdXJyZW50QWN0aXZlSW5kZXggPSBudWxsO1xyXG5cdC8vIFx0XHRjb25zdCBmaXJzdFNlY3Rpb25Ub3BDb29yZHMgPSB0b3BTZWN0aW9uc1swXTtcclxuXHQvLyBcdFx0Y29uc3QgbGFzdFNlY3Rpb25Cb3R0b21Db29yZHMgPSB0b3BTZWN0aW9uc1t0b3BTZWN0aW9ucy5sZW5ndGggLSAxXSArIHNlY3Rpb25zW3RvcFNlY3Rpb25zLmxlbmd0aCAtIDFdLm9mZnNldEhlaWdodDtcclxuXHJcblx0Ly8gXHRcdGxldCBvZmZzZXRUb3BCeU5vZGVzID0gX3V0aWxzLnBhZ2VZT2Zmc2V0QnlOb2RlcygkbmF2UGFuZWwpO1xyXG5cclxuXHQvLyBcdFx0aWYgKGFwcC5pc0ZpeGVkSGVhZGVyKSB7XHJcblx0Ly8gXHRcdFx0b2Zmc2V0VG9wQnlOb2RlcyA9IF91dGlscy5wYWdlWU9mZnNldEJ5Tm9kZXMoJG5hdlBhbmVsLCBhcHAuJGhlYWRlcik7XHJcblx0Ly8gXHRcdH1cclxuXHJcblx0Ly8gXHRcdGlmIChvZmZzZXRUb3BCeU5vZGVzIDwgZmlyc3RTZWN0aW9uVG9wQ29vcmRzIHx8IG9mZnNldFRvcEJ5Tm9kZXMgPiBsYXN0U2VjdGlvbkJvdHRvbUNvb3Jkcykge1xyXG5cdC8vIFx0XHRcdGlmIChpbmRleEFjdGl2ZUxpbmsgPT09IG51bGwpIHJldHVybjtcclxuXHJcblx0Ly8gXHRcdFx0JG5hdkxpbmtzW2luZGV4QWN0aXZlTGlua10uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0Ly8gXHRcdFx0aW5kZXhBY3RpdmVMaW5rID0gbnVsbDtcclxuXHQvLyBcdFx0XHRyZXR1cm47XHJcblx0Ly8gXHRcdH1cclxuXHJcblx0Ly8gXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdG9wU2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHQvLyBcdFx0XHRpZiAob2Zmc2V0VG9wQnlOb2RlcyA+IHRvcFNlY3Rpb25zW2ldKSB7XHJcblx0Ly8gXHRcdFx0XHRjdXJyZW50QWN0aXZlSW5kZXggPSBpO1xyXG5cdC8vIFx0XHRcdH1cclxuXHQvLyBcdFx0fVxyXG5cclxuXHQvLyBcdFx0aWYgKGluZGV4QWN0aXZlTGluayAhPT0gY3VycmVudEFjdGl2ZUluZGV4KSB7XHJcblx0Ly8gXHRcdFx0aW5kZXhBY3RpdmVMaW5rID0gY3VycmVudEFjdGl2ZUluZGV4O1xyXG5cdC8vIFx0XHRcdGNoYW5nZU5hdkFjdGl2ZSgkbmF2TGlua3NbaW5kZXhBY3RpdmVMaW5rXSlcclxuXHQvLyBcdFx0fVxyXG5cdC8vIFx0fVxyXG5cclxuXHQvLyBcdGZ1bmN0aW9uIGNoYW5nZU5hdkFjdGl2ZShuZXdOYXZMaW5rTm9kZSkge1xyXG5cdC8vIFx0XHRmb3IgKGxldCBpID0gMDsgaSA8ICRuYXZMaW5rcy5sZW5ndGg7IGkrKykge1xyXG5cdC8vIFx0XHRcdCRuYXZMaW5rc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHQvLyBcdFx0fVxyXG5cclxuXHQvLyBcdFx0bmV3TmF2TGlua05vZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvLyB0ZWwgbWFza1xyXG5cdC8vIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGVsXCJdJykpIHtcclxuXHQvLyBcdGNvbnN0IGlucHV0c1RlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nKTtcclxuXHQvLyBcdGNvbnN0IGltID0gbmV3IElucHV0bWFzaygnKzM3NSAoOTkpIDk5OS05OS05OScpO1xyXG5cdC8vIFx0aW0ubWFzayhpbnB1dHNUZWwpO1xyXG5cdC8vIH1cclxufShteUFwcCkpOyJdfQ==
