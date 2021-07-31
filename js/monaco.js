import * as Runner from './runner.js';
import * as Theme from './monaco/theme.js';
import * as Syntax from './monaco/syntax.js';
import * as Language from './monaco/language.js';

export function init() {
  const proxy = URL.createObjectURL(new Blob([`
self.MonacoEnvironment = {baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'};
importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));
  window.MonacoEnvironment = { getWorkerUrl: () => proxy };

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

  require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' } });
  require(
    ['vs/editor/editor.main'],
    () => {
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

      const modelMain = monaco.editor.createModel(initialsrc);
      const modelConfig = monaco.editor.createModel('--define: "release"');
      
      const tabMain = {
        el: document.getElementById('tab-main'),
        state: null
      };
      const tabConfig = {
        el:  document.getElementById('tab-config'),
        state: null
      };

      editor.setModel(modelMain);
      editor.focus();
      let prevTab = null;

      tabMain.el.addEventListener('click', () => {
        prevTab?.state = editor.saveViewState();
        editor.setModel(modelMain);
        editor.restoreViewState(tabMain.state);
        editor.focus();
      });
      tabConfig.el.addEventListener('click', () => {
        prevTab?.state = editor.saveViewState();
        editor.setModel(modelConfig);
        editor.restoreViewState(tabConfig.state);
        editor.focus();
      });

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
  );
}