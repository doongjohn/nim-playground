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

# Snippets
# pragma, import, proc, func

import std/strformat

const nim = "awesome"
echo "{nim = }".fmt`

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
        value: initialsrc
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