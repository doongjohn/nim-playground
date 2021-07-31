let compile_options = ['--threads:on'];
let wandboxstream = null;

function run(compiler = "", options = [], src = "", cb) {
  // Wandbox API: https://github.com/melpon/wandbox/blob/master/kennel2/API.rst
  // ReadableStream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
  const decoder = new TextDecoder();
  postData('https://wandbox.org/api/compile.ndjson', {
    compiler: compiler,
    code: src,
    'compiler-option-raw': options.join('\n')
  })
    .then(response => {
      const reader = response.getReader();
      wandboxstream ?.cancel();
      wandboxstream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                wandboxstream = null;
                controller.close();
                return;
              }
              controller.enqueue(value);
              const jsons = decoder.decode(value).split('\n');
              for (let i = 0; i < jsons.length - 1; i++)
                cb(JSON.parse(jsons[i]));
              push();
            });
          }
          push();
        }
      });
    })
    .catch(error => console.error(error));
}

const compilers = Object.freeze({
  nim_head: 'nim-head',
});

let output = null;
export function init() {
  // prevent ctrl + s
  document.addEventListener("keydown", e => {
    if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
    }
  }, false);

  // init output window
  output = document.getElementById('output');
  let ctrlDown = false;
  window.addEventListener('keyup', e => ctrlDown = e.key == 'Control' ? false : ctrlDown);
  window.addEventListener('keydown', e => {
    if (e.key == 'Control')
      ctrlDown = true;
    if (e.key == 'Escape')
      outputWindowHide();
    if (ctrlDown && e.key == '`')
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

function printOutput(msg) {
  let str = msg.data;
  switch (msg.type) {
    case 'Control':
      output.textContent += '> 🎁 [Wandbox]: ' + str + '\n';
      break;
    case 'ExitCode':
      output.textContent += '> 📑 [ExitCode]: ' + str + '\n';
      break;
    default:
      // TODO: parse ansi -> https://github.com/drudru/ansi_up
      output.textContent += str;
  }
  output.scrollTop = output.scrollHeight;
}

export function runNim(editor) {
  output.innerText = '';
  run(compilers.nim_head, compile_options, editor.getValue(), printOutput);
}
