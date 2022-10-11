import showPass from "./js/show-pass";
import fancybox from "./js/fancybox";
import rangeSlider from './js/range-slider';
import theme from './js/theme';
import inputmask from "./js/inputmask";
import scrollTo from "./js/scrollTo";
import tab from 'npm-kit-tab';
import toggle from 'npm-kit-toggle';
import ripple from 'npm-kit-ripple';
import Swiper, { Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy } from 'swiper';


import './index.scss';
import getSupportedEvents from "./js/functions/getSupportedEvents";

Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy]);
Swiper.defaults.touchStartPreventDefault = false
window.Swiper = Swiper
window.ripple = ripple
window.addEventListener('DOMContentLoaded', () => loadHandler())

function loadHandler() {
	fancybox.init()
	showPass.init()
	scrollTo.init()
	rangeSlider.init()
	tab.init()
	toggle.init()
	ripple.init()
	theme.init()
	inputmask.init(document)

	ripple.attach('.btn')
	ripple.attach('.waved')
	ripple.deAttach('.btn--link')

	document.addEventListener('click', clickHandler)

	const canvas = document.querySelector('.code-cursor-wrapper canvas')
	const context = canvas.getContext("2d");
	const { width, height } = canvas.getBoundingClientRect()

	canvas.width = width
	canvas.height = height


	const images = [
		createImg('/img/test-1.jpg'),
		createImg('/img/test-2.jpg'),
		createImg('/img/test-3.jpg'),
	]
	let img = images[0];

	const mask = new Image();
	mask.src = '/img/code-mask.svg';

	const maskContur = new Image();
	maskContur.src = '/img/code-mask-contur.svg';

	let isOver = false;

	document.body.addEventListener(getSupportedEvents().move, throttle(mousemoveHandler, 1000 / 60))
	if (getSupportedEvents().type == 'mouse') {
		document.body.addEventListener(getSupportedEvents().cancel, mouseleaveHandler)
		document.body.addEventListener('mouseenter', mouseenterHandler)
	} else {
		document.body.addEventListener(getSupportedEvents().start, mouseenterHandler)
		document.body.addEventListener(getSupportedEvents().cancel, mouseleaveHandler)
		document.body.addEventListener(getSupportedEvents().end, mouseleaveHandler)
	}


	const rect = {
		x: 0,
		y: 0,
		width: 323,
		height: 297
	}

	const current = {
		x: 0,
		y: 0,
		width: rect.width,
		height: rect.height
	}

	let xTarget = 1085 + rect.width / 2
	let yTarget = 70 + rect.height / 2
	let widthTarget = 0
	let heightTarget = 0
	let key = -1

	let changingImage = false
	let changingImageTimeout1
	let changingImageTimeout2


	function mousemoveHandler(event) {
		isOver = true
		event = eventsUnify(event)

		const { left, top, width, height } = canvas.getBoundingClientRect()
		const { width: docWidth, height: docHeight } = document.body.getBoundingClientRect()

		const offsetX = left + event.clientX
		const offsetY = -top + event.clientY
		xTarget = offsetX;
		yTarget = offsetY;

		const oldSrc = img.src
		img = images[2]

		if (offsetX / width < 1 / 3) {
			img = images[0]
		} else if (offsetX / width < 2 / 3) {
			img = images[1]
		}

		if (oldSrc !== img.src) {
			changingImage = 1

			clearTimeout(changingImageTimeout1)
			clearTimeout(changingImageTimeout2)

			changingImageTimeout1 = setTimeout(() => {
				changingImage = 2
			}, 150)

			changingImageTimeout2 = setTimeout(() => {
				changingImage = 3
			}, 600)
		}
	}



	followMouse()


	function followMouse() {
		key = requestAnimationFrame(followMouse);


		const difference = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			sizeCoof: 0.25
		}

		widthTarget = rect.width
		heightTarget = rect.height

		if (changingImage == 1) {
			widthTarget = rect.width * 1.5
			heightTarget = rect.height * 1.5
			difference.sizeCoof = 0.1
		}

		if (changingImage == 2) {
			widthTarget = rect.width
			heightTarget = rect.height
			difference.sizeCoof = 0.1
		}

		if (changingImage == 3) {
			widthTarget = rect.width
			heightTarget = rect.height
		}

		// if (!isOver) {
		// 	widthTarget = 0
		// 	heightTarget = 0
		// }

		if (!current.x || !current.y) {
			current.x = xTarget;
			current.y = yTarget;
		}

		difference.x = (xTarget - current.x) * 0.125;
		difference.y = (yTarget - current.y) * 0.125;

		if (Math.abs(difference.x) + Math.abs(difference.y) < 0.1) {
			current.x = xTarget;
			current.y = yTarget;
		} else {
			current.x += difference.x;
			current.y += difference.y;
		}

		difference.width = (widthTarget - current.width) * difference.sizeCoof;
		difference.height = (heightTarget - current.height) * difference.sizeCoof;

		if (Math.abs(difference.width) + Math.abs(difference.height) < 0.1) {
			current.width = widthTarget;
			current.height = heightTarget;
		} else {
			current.width += difference.width;
			current.height += difference.height;
		}

		const position = {
			x: current.x - (current.width / 2),
			y: current.y - (current.height / 2)
		}

		// if (current.width == 0 && current.height == 0) {
		// 	current.x = 0
		// 	current.y = 0
		// }


		// console.log(current);

		context.clearRect(0, 0, canvas.width, canvas.height)

		context.globalCompositeOperation = 'source-over';
		context.drawImage(mask, position.x, position.y, current.width, current.height);

		context.globalCompositeOperation = 'source-in';
		context.drawImage(img, position.x, position.y, current.width, current.height);

		context.globalCompositeOperation = 'source-over';
		context.drawImage(maskContur, position.x + 8, position.y + 8, current.width, current.height);
	}

	function mouseleaveHandler(event) {
		setTimeout(() => {
			xTarget = 1085 + rect.width / 2
			yTarget = 70 + rect.height / 2
			isOver = false
		}, 100)
	}

	function mouseenterHandler(event) {
		isOver = true
	}

}

function eventsUnify(e) {
	return e.changedTouches ? e.changedTouches[0] : e;
};

function throttle(func, ms) {

	let isThrottled = false,
		savedArgs,
		savedThis;

	function wrapper() {

		if (isThrottled) { // (2)
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments); // (1)

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false; // (3)
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
}


function addFavorite() {
	const title = document.title;
	const url = document.location;
	try {
		window.external.AddFavorite(url, title);
	} catch (e) {
		try {
			window.sidebar.addPanel(title, url, "");
		} catch (e) {
			if (typeof (opera) == "object") {
				window.rel = "sidebar";
				window.title = title;
				window.url = url;
				return true;
			} else {
				alert('Нажмите Ctrl-D чтобы добавить страницу в закладки');
			}
		}
	}
	return false;
}

function share() {
	const shareData = {
		title: document.title,
		text: 'Разработка и реклама сайтов',
		url: window.location
	}

	navigator.share(shareData);
}

function openNewTab() {
	window.open(window.location)
}

function reload() {
	window.location.reload()
}

// function close() {
// 	if (confirm("Вы хотите закрыть окно?")) {
// 		window.close()
// 	}
// }

function clickHandler(event) {
	if (event.target.closest('[data-add-favorite]')) {
		addFavorite()
	}
	if (event.target.closest('[data-share]')) {
		share()
	}
	if (event.target.closest('[data-reload]')) {
		reload()
	}
	// if (event.target.closest('[data-close]')) {
	// 	close()
	// }
	if (event.target.closest('[data-open-new-tab]')) {
		openNewTab()
	}
}

function createImg(src) {
	const img = new Image()
	img.src = src

	return img
}