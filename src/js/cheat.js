


const keys = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
    'Enter'
]
let index = 0;
let isCode = false



function init() {
    document.addEventListener('keyup', keyupHandler)

}

function cheat() {
    const src = '/cheat/index.js';
    const script = document.createElement('script')
    script.src = src
    document.body.appendChild(script)
}


function keyupHandler(event) {
    if (isCode) return
    
    if (event.code == keys[index]) {
        index++
        if (index == keys.length) {
            cheat()

            const customEvent = new CustomEvent('cheatsuccess', {
                bubbles: true,
                cancelable: true,
            });


            event.target.dispatchEvent(customEvent);

            index = 0
            isCode = true
        }
    } else {
        index = 0
    }
}

export default { init }