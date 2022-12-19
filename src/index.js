import fancybox from "./js/fancybox";
import scrollTo from "./js/scrollTo";
import ripple from 'npm-kit-ripple';
import Swiper, { Navigation, Autoplay, } from 'swiper';
import LocomotiveScroll from 'locomotive-scroll';
// import ymaps from 'ymaps';


import './scss/index.scss';

Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Grid, Thumbs, EffectFade, Lazy]);
Swiper.defaults.touchStartPreventDefault = false
window.Swiper = Swiper
window.ripple = ripple
window.addEventListener('DOMContentLoaded', () => loadHandler())

let scroll;
let mapInited = false

window.addEventListener('load', () => {
	document.body.classList.add('loaded')

	scroll = new LocomotiveScroll();

})


function loadHandler() {
	fancybox.init()
	scrollTo.init()
	ripple.init()

	ripple.attach('.btn')
	ripple.attach('.waved')
	ripple.deAttach('.btn--link')

	window.addEventListener('toggleopen', toggleopenHaandler)
	window.addEventListener('toggleclose', togglecloseHaandler)
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

// function mapsInit() {
// 	if (mapInited) return;
// 	if (!document.getElementById('map')) return

// 	mapInited = true
// 	ymaps
// 		.load()
// 		.then(maps => {
// 			const map = new maps.Map('map', {
// 				center: [45.031910, (window.screen.width < MEDIA.lg ? 38.921172 : 38.915172)],
// 				zoom: 16

// 			})

// 			const placemark = new maps.Placemark([45.031910, 38.921172], {}, {
// 				iconLayout: 'default#image',
// 				iconImageHref: '../img/geo.png',
// 				iconImageSize: [68, 68],
// 				iconImageOffset: [-34, -34]

// 			})


// 			map.controls.remove('geolocationControl')
// 			map.controls.remove('searchControl')
// 			map.controls.remove('trafficControl')
// 			map.controls.remove('typeSelector')
// 			map.controls.remove('fullscreenControl')
// 			// map.controls.remove('zoomControl')
// 			map.controls.remove('rulerControl')
// 			map.behaviors.disable(['scrollZoom'])
// 			map.geoObjects.add(placemark)
// 			map.geoObjects.add(placemark_2)
// 		})
// 		.catch(error => console.log('Failed to load Yandex Maps', error));
// }