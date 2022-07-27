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