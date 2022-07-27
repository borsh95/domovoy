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