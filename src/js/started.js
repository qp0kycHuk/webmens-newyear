import { createImg, eventsUnify, throttle } from "./functions";
import { getSupportedEvents } from "./functions/getSupportedEvents";



let cover, canvas, context, width, height
const mask = createImg('/img/code-mask.svg');
const maskContur = createImg('/img/code-mask-contur.svg');


let images = [
  createImg('/img/started-work-1.jpg'),
  createImg('/img/started-work-2.jpg'),
  createImg('/img/started-work-3.jpg'),
]

let img = images[0];


let isOver = true;

// init properties of round image
const rect = {
  width: 323,
  height: 297
}



// current properties of object
// change in request animation frame
const current = {
  width: 0,
  height: 0
}

// target properties for object
// calculates when mouse move or someting
const target = {
  width: 0,
  height: 0
}


let key = -1

let changingImage = false
let changingImageTimeout1
let changingImageTimeout2


function init() {

  cover = document.querySelector('.started__logo-wrapper')
  canvas = document.querySelector('.code-cursor-wrapper canvas')
  context = canvas?.getContext("2d");

  if (!canvas) {
    return;
  }

  setSizes()

  followMouse()
  cover.addEventListener(getSupportedEvents().move, throttle(mousemoveHandler, 1000 / 60))

  window.addEventListener('resize', setSizes)

  if (getSupportedEvents().type == 'mouse') {
    cover.addEventListener(getSupportedEvents().cancel, mouseleaveHandler)
    cover.addEventListener('mouseenter', mouseenterHandler)

  } else {
    cover.addEventListener(getSupportedEvents().start, mouseenterHandler)
    cover.addEventListener(getSupportedEvents().cancel, mouseleaveHandler)
    cover.addEventListener(getSupportedEvents().end, mouseleaveHandler)

  }

  document.addEventListener('cheatsuccess', (event) => {
    images = [
      createImg('/img/test-1.jpg'),
      createImg('/img/test-2.jpg'),
      createImg('/img/test-3.jpg'),
    ]

    img = images[0];
  })
}

function setSizes() {
  const size = canvas.getBoundingClientRect()

  canvas.width = width = size.width
  canvas.height = height = size.height

  rect.x = current.x = target.x = (size.width * 1085 / 1920) + rect.width / 2
  rect.y = current.y = target.y = 70 + rect.height / 2
}

function mousemoveHandler(event) {
  isOver = true
  event = eventsUnify(event)

  const { left, top, width, height } = canvas.getBoundingClientRect()
  const { width: coverWidth, left: coverLeft } = cover.getBoundingClientRect()
  const { width: docWidth, height: docHeight } = document.body.getBoundingClientRect()

  const offsetX = left + event.clientX
  const offsetY = -top + event.clientY
  target.x = offsetX;
  target.y = offsetY;

  const oldSrc = img.src

  for (let i = 0; i < images.length; i++) {
    if ((offsetX - coverLeft) / coverWidth <= (i + 1) / images.length) {
      img = images[i]
      break
    }
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

function followMouse() {
  key = requestAnimationFrame(followMouse);

  const difference = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  const coof = {
    x: 0.125,
    y: 0.125,
    width: 0.25,
    height: 0.25,
  }


  // animate image
  target.width = rect.width
  target.height = rect.height

  if (changingImage == 1) {
    target.width *= 1.5
    target.height *= 1.5
    coof.width = coof.height = 0.1
  }

  if (changingImage == 2) {
    target.width = rect.width
    target.height = rect.height
    coof.width = coof.height = 0.1
  }

  if (changingImage == 3) {
    target.width = rect.width
    target.height = rect.height
  }

  if (!isOver) {
    target.width = target.height = 0
    coof.width = coof.height = 0.075
  }

  if (current.width == 0) {
    current.x = false
    current.y = false
  }

  ['x', 'y', 'width', 'height'].forEach((key) => {
    if (current[key] === false) {
      current[key] = target[key];
    }

    difference[key] = (target[key] - current[key]) * coof[key];

    if (Math.abs(difference[key]) < 0.1) {
      current[key] = target[key];
    } else {
      current[key] += difference[key];
    }
  })

  draw(current)

}

function draw(options) {
  const position = {
    x: options.x - (options.width / 2),
    y: options.y - (options.height / 2)
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  // draw mask for picture
  context.globalCompositeOperation = 'source-over';
  context.drawImage(mask, position.x, position.y, options.width, options.height);

  // draw picture
  context.globalCompositeOperation = 'source-in';
  context.drawImage(img, position.x, position.y, options.width, options.height);

  // draw lidne
  context.globalCompositeOperation = 'source-over';
  context.drawImage(maskContur, position.x + 8, position.y + 8, options.width, options.height);
}

function mouseleaveHandler(event) {
  setTimeout(() => {
    // target.x = false
    // target.y = false

    isOver = false
  }, 100)
}

function mouseenterHandler(event) {
  isOver = true
}

export default { init }