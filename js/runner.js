// Wandbox API:    https://github.com/melpon/wandbox/blob/master/kennel2/API.rst
// ReadableStream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream

const decoder = new TextDecoder();
let wandboxstream = null;

function wandboxRun(compiler = "", options = [], mainSrc = "", srcFiles = [], onReceiveData) {
  OutputWindow.element.textContent += 'Sending your code to the wandbox api...\n'
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
            jsons.pop() // discard first value of the jsons
            for (const json of jsons){
              onReceiveData(JSON.parse(json));
            }

            loop();
          });
        })();
      }
    });
  }).catch(error => console.error(error));
}


export class OutputWindow {
  static element = null;
  static init() {
    OutputWindow.element = document.getElementById('output');
  }
  static setText(text) {
    OutputWindow.element.textContent = text;
  }
  static show() {
    OutputWindow.element.style.display = '';
  }
  static hide() {
    OutputWindow.element.style.display = 'none';
  }
  static toggle() {
    OutputWindow.element.style.display ? OutputWindow.show() : OutputWindow.hide();
  }
  static update(msg) {
    const { type, data } = msg;
    switch (type) {
      case 'Control':
        OutputWindow.element.textContent += `> 🎁 [Wandbox]: ${data}\n`;
        break;
      case 'ExitCode':
        OutputWindow.element.textContent += `> 📑 [ExitCode]: ${data}\n`;
        break;
      default:
        // TODO: parse ansi code -> https://github.com/drudru/ansi_up
        OutputWindow.element.textContent += data;
    }
    // scroll to bottom
    OutputWindow.element.scrollTop = OutputWindow.element.scrollHeight;
  }
}

let platfrom = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'

function isCtrlDown(event) {
  return platfrom.match('Mac') ? event.metaKey : event.ctrlKey;
}
function isCtrlPlusAnyKey(event, ...keys) {
  return isCtrlDown(event) && [...keys].includes(event.key);
}


export function init() {
  // init output window
  OutputWindow.init();

  // prevent browser keys
  document.addEventListener('keydown', e => {
    isCtrlPlusAnyKey(e, 's', 'p') && e.preventDefault();
  });

  // init keyboard shortcuts
  window.addEventListener('keydown', e => {
    // hide output window
    if (e.key == 'Escape')
      OutputWindow.hide();

    // toggle output window
    if (isCtrlPlusAnyKey(e, '`'))
      OutputWindow.toggle();
  });
}


// TODO: get all nim compilers from wandbox
const compilers = Object.freeze({
  nim_164: 'nim-1.6.4',
});
// TODO: do I really need this?
let compileOptions = [''];


export function wandboxRunNim(tabs) {
  output.innerText = '';
  wandboxRun(
    compilers.nim_164,
    compileOptions,
    tabs[0].getData().code,                  // main src
    tabs.slice(1).map(tab => tab.getData()), // other src
    OutputWindow.update
  );
}
