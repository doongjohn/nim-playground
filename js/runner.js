// Wandbox API:    https://github.com/melpon/wandbox/blob/master/kennel2/API.rst
// ReadableStream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream

const decoder = new TextDecoder();
let wandboxstream = null;

function wandboxRun(compiler = "", options = [], mainSrc = "", srcFiles = [], onReceiveData) {
  postData('https://wandbox.org/api/compile.ndjson', {
    compiler: compiler,
    'compiler-option-raw': options.join('\n'),
    code: mainSrc,
    codes: srcFiles
  }).then(response => {
    const reader = response.getReader();
    wandboxstream?.cancel();
    wandboxstream = new ReadableStream({
      start(controller) {
        (function loop() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              wandboxstream = null;
              return;
            }

            controller.enqueue(value);
            const jsons = decoder.decode(value).split('\n');
            for (const json of (jsons.pop(), jsons))
              onReceiveData(JSON.parse(json));

            loop();
          });
        })();
      }
    });
  }).catch(error => console.error(error));
}

let output = null;

function isCtrlDown(event) {
  return navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey;
}

export function init() {
  // init output window
  output = document.getElementById('output');

  // prevent browser keys
  document.addEventListener('keydown', event => {
    if (isCtrlDown(event) && event.key == 's') event.preventDefault();
    if (isCtrlDown(event) && event.key == 'p') event.preventDefault();
  });

  // init keyboard shortcuts
  window.addEventListener('keydown', e => {
    if (e.key == 'Escape')
      outputWindowHide();
    if (isCtrlDown(e) && e.key == '`')
      outputWindowToggle();
  });
}
export function outputWindowText(str) {
  output.textContent = str;
}
export function outputWindowShow() {
  output.style.display = '';
}
export function outputWindowHide() {
  output.style.display = 'none';
}
export function outputWindowToggle() {
  output.style.display ? outputWindowShow() : outputWindowHide();
}

function outputWindowUpdate(msg) {
  const str = msg.data;
  switch (msg.type) {
    case 'Control':
      output.textContent += '> 🎁 [Wandbox]: ' + str + '\n';
      break;
    case 'ExitCode':
      output.textContent += '> 📑 [ExitCode]: ' + str + '\n';
      break;
    default:
      // TODO: parse ansi code -> https://github.com/drudru/ansi_up
      output.textContent += str;
  }
  // scroll to bottom
  output.scrollTop = output.scrollHeight;
}


// TODO: get all nim compilers from wandbox
const compilers = Object.freeze({
  nim_head: 'nim-head',
});
let compileOptions = [''];


export function wandboxRunNim(tabs) {
  output.innerText = '';
  wandboxRun(
    compilers.nim_head,
    compileOptions,
    tabs[0].getData().code,                  // main src
    tabs.slice(1).map(tab => tab.getData()), // every other src
    outputWindowUpdate
  );
}
