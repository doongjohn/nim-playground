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
    padding: { top: "18em" },
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
      Runner.runNim(ed);
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
  static prevTab = null;

  constructor(fileName, content, language) {
    this.btn = EditorTab.container.appendChild(document.createElement('div'));
    this.btn.innerText = fileName;
    this.btn.addEventListener('click', () => {
      this.setTab(EditorTab.editor);
    });
    this.model = monaco.editor.createModel(content, language);
    this.state = null;
  }
  getData() {
    return {
      fileName: this.btn.innerText,
      content: this.model.getValue()
    }
  }
  setTab() {
    if (EditorTab.prevTab)
      EditorTab.prevTab.state = EditorTab.editor.saveViewState();
    EditorTab.prevTab = this;

    EditorTab.editor.setModel(this.model);
    EditorTab.editor.restoreViewState(this.state);
    EditorTab.editor.focus();
  }
}

function initTabs(editor) {
  // TODO: finish tabs

  EditorTab.editor = editor;
  EditorTab.container = document.getElementById('tabs');

  const initialsrc =
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

  new EditorTab('main.nim', initialsrc, 'nim').setTab();
  new EditorTab('config.nims', '--define: "release"', 'nim');
}