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
  require(['vs/editor/editor.main'], monaco => initMonaco(monaco));
}

function initMonaco(monaco) {
  monaco.editor.defineTheme('dracula', Theme.dracula);
  monaco.languages.register({ id: 'nim' });
  monaco.languages.setMonarchTokensProvider('nim', Syntax.highlighter);
  monaco.languages.setLanguageConfiguration('nim', Language.settings);
  monaco.languages.registerCompletionItemProvider('nim', Language.completion);

  const editor = monaco.editor.create(document.getElementById('editor'), {
    automaticLayout: true,
    padding: { top: "45em" },
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

  initAction(editor);
  initTabs(editor);
}

function initAction(editor) {
  editor.addAction({
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
  editor.addAction({
    id: 'nim-output-toggle',
    label: 'Toggle Output Window',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
    run: function (ed) {
      Runner.outputWindowToggle();
      return null;
    }
  });
}

class EditorTab {
  static editor = null;
  static container = null;
  static contextMenu = null;
  static newBtn = null;
  static tabs = [];
  static prevTab = null;

  constructor(fileName, content, language) {
    this.btn = EditorTab.container.appendChild(document.createElement('div'));
    this.btn.innerText = fileName;
    this.btn.addEventListener('click', input => {
      if (input.button == 0)
        this.select();
    });
    this.btn.addEventListener('contextmenu', event => {
      event.preventDefault();
      const x = event.clientX;
      const y = event.clientY;
      EditorTab.contextMenu.style.left = x + 'px';
      EditorTab.contextMenu.style.top = y + 'px';
      EditorTab.contextMenu.style.display = 'block';
    });
    EditorTab.container.appendChild(EditorTab.newBtn);
    this.model = monaco.editor.createModel(content, language);
    this.state = null;
  }
  getData() {
    return { fileName: this.btn.innerText, content: this.model.getValue() }
  }
  select() {
    if (EditorTab.prevTab) {
      EditorTab.prevTab.state = EditorTab.editor.saveViewState();
      EditorTab.prevTab.btn.classList.remove('selected');
    }
    EditorTab.prevTab = this;
    EditorTab.editor.setModel(this.model);
    EditorTab.editor.restoreViewState(this.state);
    EditorTab.editor.focus();
    this.btn.classList.add('selected');
  }
}

function initTabs(editor) {
  EditorTab.editor = editor;
  EditorTab.container = document.getElementById('tabs');
  // TODO: finish context menu
  EditorTab.contextMenu = document.getElementById('tab-context-menu');
  document.addEventListener('click', event => {
    if (event.target.parentNode != EditorTab.contextMenu)
      EditorTab.contextMenu.style.display = 'none';
  });
  EditorTab.newBtn = document.getElementById('new-tab');
  EditorTab.newBtn.addEventListener('click', () => {
    const tab = new EditorTab('src.nim', '', 'nim');
    tab.btn.setAttribute("contenteditable", true);
    EditorTab.tabs.push(tab);
  });

  const nimcode =
    `# Keybindings
# F1           -> command palette
# ctrl + enter -> run your nim code
# ctrl + \`     -> toggle the output window
# esc          -> hide the output window

import std/strformat

const nim = "awesome"
echo "{nim = }".fmt


{.experimental: "overloadableEnums".}

type
  E1 = enum A, B
  E2 = enum A, B

proc testE1(e: E1) = echo typeof e
proc testE2(e: E2) = echo typeof e

testE1 A
testE2 A`

  EditorTab.tabs = [
    new EditorTab('main.nim', nimcode, 'nim'),
    new EditorTab('config.nims', '--define: "release"', 'nim'),
  ];

  EditorTab.tabs[0].select();
}