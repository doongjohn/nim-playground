// Wandbox API:    https://github.com/melpon/wandbox/blob/master/kennel/API.md
// ReadableStream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream

const decoder = new TextDecoder()
let posted = false

function wandboxRun(compiler = '', options = [], mainSrc = '', srcFiles = [], onReceiveData) {
  // cancle previous stream
  // TODO: add time out check
  if (posted) {
    return
  }

  posted = true

  const date = new Date()
  const today = date.today()
  const time = date.timeNow()
  OutputWindow.element.textContent = today + ' ' + time + '\n'
  OutputWindow.element.textContent += 'Sending your code to the wandbox api...\n'

  postData('https://wandbox.org/api/compile.json', {
    compiler: compiler,
    'compiler-option-raw': options.join('\n'),
    code: mainSrc,
    codes: srcFiles,
  })
    .then((response) => {
      const reader = response.getReader()
      new ReadableStream({
        start(controller) {
          reader.read().then(({ done, value }) => {
            controller.enqueue(value)
            const json = decoder.decode(value)
            onReceiveData(JSON.parse(json))

            controller.close()
            posted = false
          })
        },
      })
    })
    .catch((error) => console.error(error))
}

export class OutputWindow {
  static element = null
  static init() {
    OutputWindow.element = document.getElementById('output')
  }
  static setText(text) {
    OutputWindow.element.textContent = text
  }
  static show() {
    OutputWindow.element.style.display = ''
  }
  static hide() {
    OutputWindow.element.style.display = 'none'
  }
  static toggle() {
    OutputWindow.element.style.display ? OutputWindow.show() : OutputWindow.hide()
  }
  static update(jsonMsg) {
    OutputWindow.element.textContent += '\n📄> [compiler output]\n'
    OutputWindow.element.textContent += jsonMsg['compiler_output']

    // NOTE: idk why but wandbox api always gives me compiler error instead of compiler output
    if (jsonMsg['compiler_error']) {
      OutputWindow.element.textContent += '\n📄> [compiler error]\n'
      OutputWindow.element.textContent += jsonMsg['compiler_error']
    }

    // TODO: parse ansi code -> https://github.com/drudru/ansi_up
    OutputWindow.element.textContent += '\n📄> [program output]\n'
    OutputWindow.element.textContent += jsonMsg['program_output']

    if (jsonMsg['program_error']) {
      OutputWindow.element.textContent += '\n📄> [program error]\n'
      OutputWindow.element.textContent += jsonMsg['program_error']
    }

    OutputWindow.element.textContent += '\n📄> [exit status]: '
    OutputWindow.element.textContent += jsonMsg['status']

    // scroll to bottom
    OutputWindow.element.scrollTop = OutputWindow.element.scrollHeight
  }
}

let platfrom = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'

function isCtrlDown(event) {
  return platfrom.match('Mac') ? event.metaKey : event.ctrlKey
}
function isCtrlPlusAnyKey(event, ...keys) {
  return isCtrlDown(event) && [...keys].includes(event.key)
}

export function init() {
  // init output window
  OutputWindow.init()

  // prevent browser keys
  document.addEventListener('keydown', (e) => {
    isCtrlPlusAnyKey(e, 's', 'p') && e.preventDefault()
  })

  // init keyboard shortcuts
  window.addEventListener('keydown', (e) => {
    // hide output window
    if (e.key == 'Escape') OutputWindow.hide()

    // toggle output window
    if (isCtrlPlusAnyKey(e, '`')) OutputWindow.toggle()
  })
}

// TODO: get all nim compilers from wandbox
const compilers = Object.freeze({
  nim_1_6_6: 'nim-1.6.6',
})
// TODO: do I really need this?
let compileOptions = ['']

export function wandboxRunNim(tabs) {
  // request wandbox api
  wandboxRun(
    compilers.nim_1_6_6,
    compileOptions,
    tabs[0].getData().code, // main src
    tabs.slice(1).map((tab) => tab.getData()), // other src
    OutputWindow.update
  )
}
