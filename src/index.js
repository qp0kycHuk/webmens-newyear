import showPass from "./js/show-pass";
import fancybox from "./js/fancybox";
import rangeSlider from './js/range-slider';
import theme from './js/theme';
import inputmask from "./js/inputmask";
import scrollTo from "./js/scrollTo";
import started from "./js/started";
import cheat from "./js/cheat";
import lightening from "./js/lightening";
import tab from 'npm-kit-tab';
import toggle from 'npm-kit-toggle';
import ripple from 'npm-kit-ripple';
// import Swiper, { Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy } from 'swiper';
import LocomotiveScroll from 'locomotive-scroll';
import ymaps from 'ymaps';


import './scss/index.scss';

// Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy]);
// Swiper.defaults.touchStartPreventDefault = false
// window.Swiper = Swiper
window.ripple = ripple
window.addEventListener('DOMContentLoaded', () => loadHandler())

let scroll;
let mapInited = false

window.addEventListener('load', () => {
	document.body.classList.add('loaded')

	scroll = new LocomotiveScroll({
		el: document.querySelector('[data-scroll-container]'),
		smooth: true,
		lerp: 0.05,
		touchMultiplier: 4,
		tablet: {
			smooth: true,
			breakpoint: 749.98
		}
		// offset: [-1200, -1200]
	});

	scroll.on('scroll', scrollHandler)

	mapsInit()
})


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
	lightening.init()
	started.init()
	cheat.init()

	ripple.attach('.btn')
	ripple.attach('.waved')
	ripple.deAttach('.btn--link')

	document.addEventListener('click', clickHandler)




	window.addEventListener('toggleopen', toggleopenHaandler)
	window.addEventListener('toggleclose', togglecloseHaandler)
}

function scrollHandler(event) {
	if ((window.screen.width > MEDIA.md && event.scroll.y <= 32) ||
		(window.screen.width <= MEDIA.md && window.scrollY <= 0)) {
		document.body.classList.add('scroll-top')
	} else {
		document.body.classList.remove('scroll-top')
	}
}

function toggleopenHaandler(event) {
	if (event.detail.target.classList.contains('-menu-')) {
		document.body.classList.add('menu-open')
	}
}

function togglecloseHaandler(event) {
	if (event.detail.target.classList.contains('-menu-')) {
		document.body.classList.remove('menu-open')
	}
}

// functions for emulate brauser actions in plug page
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

function clickHandler(event) {
	if (event.target.closest('[data-add-favorite]')) {
		addFavorite()
	}
	if (event.target.closest('[data-scroll-to]')) {
		const id = event.target.closest('[data-scroll-to]').getAttribute('data-scroll-to')
		scroll.scrollTo(id)
	}

	if (event.target.closest('[data-share]')) {
		share()
	}

	if (event.target.closest('[data-reload]')) {
		reload()
	}

	if (event.target.closest('[data-open-new-tab]')) {
		openNewTab()
	}
}

function mapsInit() {
	if (mapInited) return;
	if (!document.getElementById('map')) return

	mapInited = true
	ymaps
		.load()
		.then(maps => {
			const map = new maps.Map('map', {
				center: [45.031910, (window.screen.width < MEDIA.lg ? 38.921172 : 38.915172)],
				zoom: 16

			})

			const placemark = new maps.Placemark([45.031910, 38.921172], {}, {
				iconLayout: 'default#image',
				iconImageHref: '../img/geo.png',
				iconImageSize: [68, 68],
				iconImageOffset: [-34, -34]

			})


			map.controls.remove('geolocationControl')
			map.controls.remove('searchControl')
			map.controls.remove('trafficControl')
			map.controls.remove('typeSelector')
			map.controls.remove('fullscreenControl')
			// map.controls.remove('zoomControl')
			map.controls.remove('rulerControl')
			map.behaviors.disable(['scrollZoom'])
			map.geoObjects.add(placemark)
			map.geoObjects.add(placemark_2)
		})
		.catch(error => console.log('Failed to load Yandex Maps', error));
}