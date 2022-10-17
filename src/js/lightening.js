import { throttle } from "./functions";


function mousemoveHandler(event) {
    if (!event.target.closest('.-lightening-')) return;


    const element = event.target.closest('.-lightening-')

    const coord = {
        x: event.clientX - element.getBoundingClientRect().left,
        y: event.clientY - element.getBoundingClientRect().top,

    }

    requestAnimationFrame(()=>{
        element.style.setProperty('--x', `${coord.x}px`)
        element.style.setProperty('--y', `${coord.y}px`)
    })

}


const init = () => {
    document.addEventListener('mousemove', throttle(mousemoveHandler, 1000 / 60))

}

export default { init }