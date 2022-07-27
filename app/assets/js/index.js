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