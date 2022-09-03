export const settings = {
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
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
    lineComment: '#',
    blockComment: ['#[', ']#'],
  },
}

export const completion = {
  provideCompletionItems: (model, position) => {
    const wordModel = model.getWordAtPosition(position)
    const columnBeforeWord =
      wordModel && wordModel.word.length ? position.column - wordModel.word.length : 0

    // Get all the text content before the "word at cursor"
    var textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: Math.abs(columnBeforeWord),
    })

    // custom snippets
    const snippets = [
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'prag',
        insertText: '{.${1:name}.}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'prag:',
        insertText: '{.${1:name}: ${2:args}.}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'prag exp',
        insertText: '{.experimental: "${1:switch}".}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'import',
        insertText: 'import ${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'import std',
        insertText: 'import std/${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'include',
        insertText: 'include ${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'include std',
        insertText: 'include std/${1:module}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc',
        insertText: 'proc ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc()',
        insertText: 'proc ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc:',
        insertText: 'proc ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc():',
        insertText: 'proc ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc[]',
        insertText: 'proc ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc[]:',
        insertText: 'proc ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc[]()',
        insertText: 'proc ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'proc[]():',
        insertText: 'proc ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func',
        insertText: 'func ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func()',
        insertText: 'func ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func:',
        insertText: 'func ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func():',
        insertText: 'func ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func[]',
        insertText: 'func ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func[]:',
        insertText: 'func ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func[]()',
        insertText: 'func ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'func[]():',
        insertText: 'func ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method',
        insertText: 'method ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method()',
        insertText: 'method ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method:',
        insertText: 'method ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method():',
        insertText: 'method ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method[]',
        insertText: 'method ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method[]:',
        insertText: 'method ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method[]()',
        insertText: 'method ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'method[]():',
        insertText: 'method ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template',
        insertText: 'template ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template()',
        insertText: 'template ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template:',
        insertText: 'template ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template():',
        insertText: 'template ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template[]',
        insertText: 'template ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template[]:',
        insertText: 'template ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template[]()',
        insertText: 'template ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'template[]():',
        insertText: 'template ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro',
        insertText: 'macro ${1:name} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro()',
        insertText: 'macro ${1:name}(${2:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro:',
        insertText: 'macro ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro():',
        insertText: 'macro ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro[]',
        insertText: 'macro ${1:name}[${2:T}] =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro[]:',
        insertText: 'macro ${1:name}[${2:T}]: ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro[]()',
        insertText: 'macro ${1:name}[${2:T}](${3:args}) =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'macro[]():',
        insertText: 'macro ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'iterator:',
        insertText: 'iterator ${1:name}:${2:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'iterator():',
        insertText: 'iterator ${1:name}(${2:args}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'iterator[]:',
        insertText: 'iterator ${1:name}[${2:T}]: ${3:type}=\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'iterator[]():',
        insertText: 'iterator ${1:name}[${2:T}](${3:args}): ${4:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'converter',
        insertText: 'converter ${1:name}(${2:arg}): ${3:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'block',
        insertText: 'block',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'when',
        insertText: 'when',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'if',
        insertText: 'if',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'elif',
        insertText: 'elif',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'else',
        insertText: 'else',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'try',
        insertText: 'try',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'except',
        insertText: 'except',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'finally',
        insertText: 'finally',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'while',
        insertText: 'while',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'for',
        insertText: 'for',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'switch',
        insertText: 'switch',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'case',
        insertText: 'case',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'continue',
        insertText: 'continue',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'break',
        insertText: 'break',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'raise',
        insertText: 'raise',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'return',
        insertText: 'return',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'yield',
        insertText: 'yield',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'defer',
        insertText: 'defer',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'do',
        insertText: 'do',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'discard',
        insertText: 'discard',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'var',
        insertText: 'var',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'let',
        insertText: 'let',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'const',
        insertText: 'const',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'mixin',
        insertText: 'mixin',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'bind',
        insertText: 'bind',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'type',
        insertText: 'type',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'ref',
        insertText: 'ref',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'object',
        insertText: 'object',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'enum',
        insertText: 'enum',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'concept',
        insertText: 'concept',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'distinct',
        insertText: 'distinct',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'shared',
        insertText: 'shared',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'static',
        insertText: 'static',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'varargs',
        insertText: 'varargs',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'sink',
        insertText: 'sink',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'lent',
        insertText: 'lent',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'new',
        insertText: 'new',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'assert',
        insertText: 'assert',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'doAssert',
        insertText: 'doAssert',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cast',
        insertText: 'cast',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'addr',
        insertText: 'addr',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'typeof',
        insertText: 'typeof',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'sizeof',
        insertText: 'sizeof',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'do',
        insertText: 'do',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'nil',
        insertText: 'nil',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'pointer',
        insertText: 'pointer',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'ptr',
        insertText: 'ptr ${1:type} =\n  ',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'typed',
        insertText: 'typed',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'untyped',
        insertText: 'untyped',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'typedesc',
        insertText: 'typedesc',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'tuple',
        insertText: 'tuple',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'range',
        insertText: 'range',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'array',
        insertText: 'array',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'seq',
        insertText: 'seq',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'set',
        insertText: 'set',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'openArray',
        insertText: 'openArray',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'auto',
        insertText: 'auto',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'void',
        insertText: 'void',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'byte',
        insertText: 'byte',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'bool',
        insertText: 'bool',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'true',
        insertText: 'true',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'false',
        insertText: 'false',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'int',
        insertText: 'int',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'int8',
        insertText: 'int8',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'int16',
        insertText: 'int16',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'int32',
        insertText: 'int32',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'int64',
        insertText: 'int64',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'uint',
        insertText: 'uint',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'uint8',
        insertText: 'uint8',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'uint16',
        insertText: 'uint16',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'uint32',
        insertText: 'uint32',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'uint64',
        insertText: 'uint64',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'float',
        insertText: 'float',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'float32',
        insertText: 'float32',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'float64',
        insertText: 'float64',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'char',
        insertText: 'char',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'string',
        insertText: 'string',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cchar',
        insertText: 'cchar',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cuchar',
        insertText: 'cuchar',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cschar',
        insertText: 'cschar',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cshort',
        insertText: 'cshort',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cushort',
        insertText: 'cushort',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'clong',
        insertText: 'clong',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'culong',
        insertText: 'culong',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'clonglong',
        insertText: 'clonglong',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'culonglong',
        insertText: 'culonglong',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cint',
        insertText: 'cint',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cuint',
        insertText: 'cuint',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'csize',
        insertText: 'csize',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'csize_t',
        insertText: 'csize_t',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cfloat',
        insertText: 'cfloat',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cdouble',
        insertText: 'cdouble',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'clongdouble',
        insertText: 'clongdouble',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cstringArray',
        insertText: 'cstringArray',
      },
      {
        kind: monaco.languages.CompletionItemKind.Snippet,
        label: 'cstring',
        insertText: 'cstring',
      },
      // TODO: more stuff
    ]

    let words = [...textUntilPosition.matchAll(/\w+/gi)].map((x) => x[0])
    if (!words) {
      // No words typed; must be almost at begining... just return snippets
      return { suggestions: snippets }
    }

    // Find unique words that do not include my suggestions
    const labels = snippets.map((s) => s.label.toUpperCase())
    words = [...new Set(words.filter((w) => labels.every((l) => l !== w.toUpperCase())))]

    // Return combined suggestions
    return {
      suggestions: [
        ...snippets,
        ...words.map((w) => {
          return {
            kind: monaco.languages.CompletionItemKind.Text,
            label: w,
            insertText: w,
          }
        }),
      ],
    }
  },
}
