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