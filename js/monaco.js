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
        Runner.outputWindowShow();
        Runner.outputWindowText('sending a request to wandbox api...');
        Runner.runNim(EditorTab.tabs);
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
    EditorTab.newBtn = document.getElementById('tab-new');

    // init container
    EditorTab.container.addEventListener('wheel', function (event) {
      // side scroll
      this.scrollLeft += event.deltaY > 0 ? 50 : -50;
    });

    // init new tab button
    EditorTab.newBtn.addEventListener('click', () => {
      const newTab = new EditorTab(`src${EditorTab.counter++}.nim`, '', 'nim');
      // newTab.tab.setAttribute("contenteditable", true);
      EditorTab.tabs.push(newTab);
    });

    // init tab context menu
    // https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724
    // TODO: check name collision when renaming
    document.addEventListener('click', event => {
      if (event.target.parentNode != EditorTab.contextMenu)
        EditorTab.contextMenu.style.display = 'none';
    });

    // create default tabs
    EditorTab.createDefault();
  }
  static createDefault() {
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
`

    // default tabs
    EditorTab.tabs = [
      new EditorTab('main.nim', nimcode, 'nim'),
      new EditorTab('config.nims', nimconfig, 'nim'),
    ];

    // select first tab
    EditorTab.currentTab = EditorTab.tabs[0];
    EditorTab.currentTab.select();
  }

  constructor(fileName, content, language) {
    this.tab = EditorTab.container.appendChild(document.createElement('div'));
    this.tab.innerText = fileName;
    this.tab.addEventListener('click', event => {
      // select this tab on left click
      if (event.button == 0)
        this.select();
    });
    this.tab.addEventListener('contextmenu', event => {
      // disable browser context menu
      event.preventDefault();
      EditorTab.contextTab = event.target;

      // move context menu to cursor postion
      EditorTab.contextMenu.style.left = event.clientX + 'px';
      EditorTab.contextMenu.style.top = event.clientY + 'px';

      // show context menu
      EditorTab.contextMenu.style.display = 'block';
    });
    EditorTab.container.appendChild(EditorTab.newBtn);

    this.model = monaco.editor.createModel(content, language);
    this.state = null;
  }

  getData() {
    return {
      fileName: this.tab.innerText,
      content: this.model.getValue()
    };
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
  remove() {
    let index = EditorTab.tabs.indexOf(this);
    if (index == -1) return;

    // remove from tabs
    EditorTab.tabs.splice(index, 1);
  }
}