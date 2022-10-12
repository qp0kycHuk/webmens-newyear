
import Inputmask from "inputmask";

const init = (cover) => {
  const inputs = cover.querySelectorAll('[type="tel"]');
  const im = new Inputmask("+7 ( 9 9 9 ) 9 9 9 - 9 9 - 9 9");
  im.mask(inputs);

  inputs.forEach(element => {
    element.inputmask.option({ onBeforeMask: phoneValueHandler })
    element.addEventListener('input', inputHandler)
  });
}

function phoneValueHandler(value) {
  let processedValue = value.replace(/\D/g, '');

  if (processedValue.startsWith('89') || processedValue.startsWith('7')) {
    processedValue = processedValue.substr(1)
  }

  return processedValue;
}

function inputHandler(event) {
  let processedValue = event.target.value.replace(/\D/g, '');

  if (processedValue.startsWith('78') || processedValue.startsWith('77')) {
    processedValue = processedValue.substr(1)
  }

  event.target.value = processedValue
}

export default { init }