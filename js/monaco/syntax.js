export const highlighter = {
  defaultToken: '',

  keywords: [
    'include', 'import', 'from',

    'block',
    'when', 'if', 'elif', 'else',
    'try', 'except', 'finally',
    'while', 'for',
    'switch', 'case',
    'continue', 'break',
    'raise', 'return',
    'yield', 'defer',
    'do', 'discard',

    'var', 'let', 'const',
    'proc', 'func', 'method',
    'converter', 'iterator',
    'macro', 'template', 'mixin', 'bind',

    'type', 'ref',
    'object', 'enum', 'concept',
    'distinct', 'shared',

    'static', 'varargs',
    'sink', 'lent',

    'new', 'assert', 'doAssert',
    'cast', 'addr',
    'typeof', 'sizeof'
  ],

  typeKeywords: [
    'nil', 'pointer', 'ptr',
    'typed', 'untyped', 'typedesc',
    'tuple', 'range', 'array', 'seq', 'set', 'openArray',
    'auto', 'void',
    'byte', 'bool', 'true', 'false',
    'int', 'int8', 'int16', 'int32', 'int64',
    'uint', 'uint8', 'uint16', 'uint32', 'uint64',
    'float', 'float32', 'float64',
    'char', 'string',
    'cchar', 'cuchar', 'cschar',
    'cshort', 'cushort',
    'clong', 'culong', 'clonglong', 'culonglong',
    'cint', 'cuint', 'csize', 'csize_t',
    'cfloat', 'cdouble', 'clongdouble',
    'cstringArray', 'cstring',
  ],

  operators: [
    'not',
    'and', 'or', 'xor', 'of',
    'in', 'notin',
    'is', 'isnot',
    'defined',
    'div', 'mod',
    'shl', 'shr',
    'as',
  ],

  brackets: [
    { open: '{', close: '}', token: 'delimiter.curly' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' }
  ],

  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  specialchars: /\.|:|\+|-|\*|\/|=|>|<|&|\||%|!|\?|~|@|\^|`|\$/,
  ident: /[a-z]+\w*/,
  typeident: /[A-Z]+\w*/,
  procdefs: /proc|func|method|iterator|converter|template|macro/,

  tokenizer: {
    root: [
      { include: '@whitespace' },
      { include: '@numbers' },
      { include: '@strings' },
      { include: '@pragmas' },
      { include: '@comments' },

      [/[{}()\[\]]/, '@brackets'],
      [/[,;]/, 'delimiter'],

      // strings
      [/"[^"]*"/, 'string'],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')([a-z]\w*)/, ['keyword.operator', 'type']],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],

      // type
      [/@typeident/, 'type'],

      // operator
      [/(@specialchars)+/, 'keyword.operator'],

      // keyword, type
      [/@ident/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@operators': 'keyword.operator',
          '@': 'identifier',
        }
      }],
    ],

    whitespace: [
      [/\s+/, 'white'],
    ],

    numbers: [
      [/[-+]?0[bB]([_01]+)/, 'number'],           // binary
      [/[-+]?0[oO]([_0-7]*)/, 'number'],          // octal
      [/[-+]?0[xX]([_a-f0-9]*)/, 'number'],       // hexadecimal
      [/(?=[-+]?[0-9]+)[e\-0-9]+/, 'number'],     // int
      [/[-+]?[0-9]*\.[0-9]+[e\-0-9]+/, 'number'], // float
    ],

    strings: [
      [/""".*"""/, 'string'],
      [/""".*/, 'string', '@endStrings'],
    ],
    endStrings: [
      [/.*"""/, 'string', '@popall'],
      [/.*/, 'string']
    ],

    pragmas: [
      [/\{\./, 'tag', '@endPragmas'],
    ],
    endPragmas: [
      [/.*\.\}/, 'tag', '@popall'],
      [/.*/, 'tag'],
    ],

    comments: [
      [/#(?!\[).*/, 'comment'],
      [/#\[/, 'comment', '@endComments'],
    ],
    endComments: [
      [/#\[/, 'comment', '@endComments'],
      [/\]#/, 'comment', '@pop'],
      [/.*/, 'comment'],
    ],
  }
};