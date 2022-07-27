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