export const settings = {
  brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
  surroundingPairs: [
    { open: '#[', close: ']#' },
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  autoClosingPairs: [
    { open: '#[', close: ']#' },
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string', 'comment'] },
  ],
  comments: {
    lineComment: "#",
    blockComment: ["#[", "]#"]
  }
};

export const completion = {
  provideCompletionItems: (model, position) => {
    const wordModel = model.getWordAtPosition(position);
    const columnBeforeWord =
      wordModel && wordModel.word.length
        ? position.column - wordModel.word.length
        : 0;

    // Get all the text content before the "word at cursor"
    var textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: Math.abs(columnBeforeWord),
    });

    // custom snippets
    const snippets = [
      {
        label: 'prag',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '{.${1:name}.}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'prag:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '{.${1:name}: ${2:args}.}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'prag exp',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: '{.experimental: "${1:switch}".}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'import',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'import ${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'import std',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'import std/${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'include',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'include ${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'include std',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'include std/${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc[]',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc[]()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'proc[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'proc ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func[]',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func[]()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'func[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'func ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method[]',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method[]()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'method[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'method ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template[]',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template[]()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'template[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'template ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro[]',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro[]()',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'macro[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'macro ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'iterator:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'iterator ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'iterator():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'iterator ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'iterator[]:',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'iterator ${1:name}[${2:T}]: ${3:type}=\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'iterator[]():',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'iterator ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'converter',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'converter ${1:name}(${2:arg}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'block',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'block',
      },
      {
        label: 'when',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'when',
      },
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'if',
      },
      {
        label: 'elif',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'elif',
      },
      {
        label: 'else',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'else',
      },
      {
        label: 'try',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'try',
      },
      {
        label: 'except',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'except',
      },
      {
        label: 'finally',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'finally',
      },
      {
        label: 'while',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'while',
      },
      {
        label: 'for',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'for',
      },
      {
        label: 'switch',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'switch',
      },
      {
        label: 'case',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'case',
      },
      {
        label: 'continue',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'continue',
      },
      {
        label: 'break',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'break',
      },
      {
        label: 'raise',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'raise',
      },
      {
        label: 'return',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'return',
      },
      {
        label: 'yield',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'yield',
      },
      {
        label: 'defer',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'defer',
      },
      {
        label: 'discard',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'discard',
      },
      {
        label: 'var',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'var',
      },
      {
        label: 'let',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'let',
      },
      {
        label: 'const',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'const',
      },
      {
        label: 'mixin',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'mixin',
      },
      {
        label: 'bind',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'bind',
      },
      {
        label: 'type',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'type',
      },
      {
        label: 'ref',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'ref',
      },
      {
        label: 'object',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'object',
      },
      {
        label: 'enum',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'enum',
      },
      {
        label: 'concept',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'concept',
      },
      {
        label: 'distinct',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'distinct',
      },
      {
        label: 'shared',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'shared',
      },
      {
        label: 'static',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'static',
      },
      {
        label: 'varargs',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'varargs',
      },
      {
        label: 'sink',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'sink',
      },
      {
        label: 'lent',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'lent',
      },
      {
        label: 'new',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'new',
      },
      {
        label: 'assert',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'assert',
      },
      {
        label: 'doAssert',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'doAssert',
      },
      {
        label: 'cast',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'cast',
      },
      {
        label: 'addr',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'addr',
      },
      {
        label: 'do',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'do',
      },
      {
        label: 'nil',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'nil',
      },
      {
        label: 'pointer',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'pointer',
      },
      {
        label: 'ptr',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'ptr ${1:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        label: 'typed',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'typed',
      },
      {
        label: 'untyped',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'untyped',
      },
      {
        label: 'typedesc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'typedesc',
      },
      {
        label: 'tuple',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'tuple',
      },
      {
        label: 'range',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'range',
      },
      {
        label: 'array',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'array',
      },
      {
        label: 'seq',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'seq',
      },
      {
        label: 'set',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'set',
      },
      {
        label: 'openArray',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'openArray',
      },
      {
        label: 'auto',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'auto',
      },
      {
        label: 'void',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'void',
      },
      {
        label: 'byte',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'byte',
      },
      {
        label: 'bool',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'bool',
      },
      {
        label: 'true',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'true',
      },
      {
        label: 'false',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'false',
      },
      // TODO: more stuff
    ];

    let words = [...textUntilPosition.matchAll(/\w+/gi)].map((x) => x[0]);
    if (!words) {
      // No words typed; must be almost at begining... just return snippets
      return { suggestions: snippets };
    }

    // Find unique words that do not include my suggestions
    const labels = snippets.map((s) => s.label.toUpperCase());
    words = [
      ...new Set(
        words.filter((w) => labels.every((l) => l !== w.toUpperCase()))
      ),
    ];

    // Return combined suggestions
    return {
      suggestions: [
        ...snippets,
        ...words.map((w) => {
          return {
            kind: monaco.languages.CompletionItemKind.Text,
            label: w,
            insertText: w,
          };
        }),
      ]
    };
  }
};