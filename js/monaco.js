import * as Runner from './runner.js';
import * as Theme from './monaco/theme.js';
import * as Syntax from './monaco/syntax.js';
import * as Language from './monaco/language.js';

export function init() {
  const proxy = URL.createObjectURL(new Blob([`
self.MonacoEnvironment = {baseUrl:'https://unpkg.com/monaco-editor@latest/min/'};
importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));
  window.MonacoEnvironment = { getWorkerUrl: () => proxy };

  require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
  require(['vs/editor/editor.main'], monaco => {
    Monaco.monaco = monaco;
    Monaco.init();
    EditorTab.init();
    EditorTab.initStaticTabs();
  });
}

class Monaco {
  static monaco = null;
  static editor = null;

  static init() {
    const monaco = Monaco.monaco;
    monaco.editor.defineTheme('dracula', Theme.dracula);
    monaco.languages.register({ id: 'nim' });
    monaco.languages.setMonarchTokensProvider('nim', Syntax.highlighter);
    monaco.languages.setLanguageConfiguration('nim', Language.settings);
    monaco.languages.registerCompletionItemProvider('nim', Language.completion);

    Monaco.editor = monaco.editor.create(document.getElementById('editor'), {
      automaticLayout: true,
      padding: { top: "15em" },
      smoothScrolling: true,
      mouseWheelZoom: true,
      cursorSmoothCaretAnimation: true,
      renderWhitespace: 'trailing',
      minimap: { enabled: false },
      suggest: {
        showWords: true,
        showSnippets: true,
        snippetsPreventQuickSuggestions: false,
      },
      snippetSuggestions: 'bottom',
      tabSize: 2,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '16px',
      theme: 'dracula',
      language: 'nim',
    });

    Monaco.editor.addAction({
      id: 'nim-run',
      label: 'Run Nim',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: function (ed) {
        Runner.outputWindowText('sending a request to wandbox api...');
        Runner.outputWindowShow();
        Runner.wandboxRunNim(EditorTab.tabs);
        return null;
      }
    });
    Monaco.editor.addAction({
      id: 'nim-output-toggle',
      label: 'Toggle Output Window',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
      run: function (ed) {
        Runner.outputWindowToggle();
        return null;
      }
    });
  }
}

function getFileExtension(fileName) {
  const fileTypes = {
    nim: 'nim',
    nims: 'nim',
    txt: 'text',
  }

  const dot = fileName.lastIndexOf('.');
  if (dot == -1 || fileName.length == dot - 1)
    return 'text';
  return fileTypes[fileName.substring(dot + 1)];
}

class EditorTabOption {
  constructor(fileName, code) {
    this.fileName = fileName;
    this.code = code;
  }
}
class EditorStaticTabOption {
  constructor(id, code) {
    this.id = id;
    this.code = code;
  }
}

class EditorTab {
  static container = null;
  static contextMenu = null;
  static contextRename = null;
  static contextDelete = null;
  static newBtn = null;

  static tabs = [];
  static currentTab = null;
  static contextTab = null;
  static counter = 0;

  static init() {
    // get elements
    EditorTab.container = document.getElementById('tab-container');
    EditorTab.contextMenu = document.getElementById('tab-context-menu');
    EditorTab.contextRename = document.getElementById('tab-context-rename');
    EditorTab.contextDelete = document.getElementById('tab-context-delete');
    EditorTab.newBtn = document.getElementById('tab-new');

    // init container
    EditorTab.container.addEventListener('wheel', function (event) {
      // side scroll
      this.scrollLeft += event.deltaY > 0 ? 50 : -50;
    });

    // init new tab button
    EditorTab.newBtn.addEventListener('click', () => {
      const newTab = new EditorTab(new EditorTabOption(`src${EditorTab.counter++}.nim`, ''));
      EditorTab.tabs.push(newTab);
    });

    // init tab context menu
    // https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724
    EditorTab.contextMenu.style.display = 'none';
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('mousedown', event => {
      if (event.target.parentNode != EditorTab.contextMenu) {
        EditorTab.contextMenu.style.display = 'none';
      }
    });
    EditorTab.contextRename.addEventListener('mousedown', event => {
      EditorTab.contextTab.setAttribute('contenteditable', true);
      EditorTab.contextTab.focus();
      EditorTab.contextMenu.style.display = 'none';
    });
    EditorTab.contextDelete.addEventListener('mousedown', event => {

    });
  }
  static initStaticTabs() {
    const nimcode =
      `# Keybindings
# F1           -> command palette
# ctrl + enter -> run your nim code
# ctrl + \`     -> toggle the output window
# esc          -> hide the output window

{.experimental: "overloadableEnums".}

import std/strformat

const nim = "awesome"
echo "{nim = }".fmt

type
  E1 = enum A, B
  E2 = enum A, B

proc testE1(e: E1) = echo typeof e
proc testE2(e: E2) = echo typeof e

testE1 A
testE2 A
`

    const nimconfig =
      `--define: "release"
--gc: "orc"
`

    // default tabs
    EditorTab.tabs = [
      new EditorTab(new EditorStaticTabOption('code-main', nimcode)),
      new EditorTab(new EditorStaticTabOption('code-config', nimconfig)),
    ];

    // select first tab
    EditorTab.currentTab = EditorTab.tabs[0];
    EditorTab.currentTab.select();
  }

  constructor(option) {
    // normal tab
    if (option instanceof EditorTabOption) {
      this.tab = document.createElement('div');
      this.tab.innerText = option.fileName;
      this.tab.addEventListener('input', event => {
        if (!this.tab.hasAttribute('contenteditable')) return;

        // check name collision
        let ok = true;
        if (this.tab.innerText == '' || this.tab.innerText.includes('/')) {
          ok = false;
        } else {
          for (const tab of EditorTab.tabs) {
            if (tab != this && tab.tab.innerText == this.tab.innerText + '.nim') {
              ok = false;
              break;
            }
          }
        }

        if (ok) {
          this.tab.classList.remove('tab-rename-err');
          this.tab.classList.add('tab-rename-ok');
        } else {
          this.tab.classList.remove('tab-rename-ok');
          this.tab.classList.add('tab-rename-err');
        }
      });
      this.tab.addEventListener('keydown', event => {
        if (!this.tab.hasAttribute('contenteditable')) return;

        if (event.key == 'Tab' ||
          event.key == ' ' ||
          event.key == '/' ||
          event.key == '\\' ||
          event.key == ' ') {
            event.preventDefault();
        }

        if (event.key == 'Enter' || event.key == 'Escape') {
          event.preventDefault();
          if (this.tab.classList.contains('tab-rename-ok')) {
            this.tab.innerText += '.nim';
            this.tab.removeAttribute("contenteditable");
          }
        }
      });
      this.tab.addEventListener('contextmenu', event => {
        // show context menu
        EditorTab.contextMenu.style.left = event.clientX + 'px';
        EditorTab.contextMenu.style.top = event.clientY + 'px';
        EditorTab.contextMenu.style.display = 'block';

        // set selected tab
        EditorTab.contextTab = event.target;

        console.log(EditorTab.contextTab);
      });

      // append elements
      EditorTab.container.append(this.tab, EditorTab.newBtn);
    }
    // static tab
    else if (option instanceof EditorStaticTabOption) {
      this.tab = document.getElementById(option.id);
    }

    // select this tab on left click
    this.tab.addEventListener('mousedown', event => {
      if (this.tab.hasAttribute('contenteditable')) return;
      if (event.button == 0) this.select();
    });

    // init editor
    this.model = Monaco.monaco.editor.createModel(option.code, 'nim');
    this.state = null;
  }

  getData() {
    return {
      // this naming is for the wandbox api
      file: this.tab.innerText,   // file name
      code: this.model.getValue() // file content
    };
  }
  rename(fileName) {
    Monaco.monaco.editor.setModelLanguage(this.model, getFileExtension(fileName));
  }
  remove() {
    let index = EditorTab.tabs.indexOf(this);
    if (index != -1)
      EditorTab.tabs.splice(index, 1);
  }
  deselect() {
    this.state = Monaco.editor.saveViewState();
    this.tab.classList.remove('selected');
  }
  select() {
    EditorTab.currentTab?.deselect();
    EditorTab.currentTab = this;

    Monaco.editor.setModel(this.model);
    Monaco.editor.restoreViewState(this.state);
    Monaco.editor.focus();
    this.tab.classList.add('selected');
  }
}