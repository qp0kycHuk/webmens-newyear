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


	const cover = document.querySelector('.window-content')
	const canvas = cover.querySelector('.code-cursor-wrapper canvas')
	const context = canvas.getContext("2d");
	const { width, height } = canvas.getBoundingClientRect()

	canvas.width = width
	canvas.height = height

	const img = new Image();
	img.src = '/img/code.jpg';

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

	function mousemoveHandler(event) {

		setTimeout(() => {
			if (!isOver) return;
			event = eventsUnify(event)
			context.clearRect(0, 0, canvas.width, canvas.height)

			const { left, top, width, height } = cover.getBoundingClientRect()
			const { width: docWidth } = document.body.getBoundingClientRect()

			const offsetX = event.clientX * (width / docWidth)
			const offsetY = event.clientY - top

			context.globalCompositeOperation = 'source-over';
			context.drawImage(mask, offsetX - (323 / 2), offsetY - (297 / 2), 323, 297);

			context.globalCompositeOperation = 'source-in';
			context.drawImage(img, 0, 0);

			context.globalCompositeOperation = 'source-over';
			context.drawImage(maskContur, offsetX - (323 / 2) + 8, offsetY - (297 / 2) + 8, 323, 297);
		}, 100)

	}

	function mouseleaveHandler(event) {
		isOver = false
		context.clearRect(0, 0, canvas.width, canvas.height)
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

