export const highlighter = {
  defaultToken: '',
  tokenPostfix: '.nim',

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
    'discard',

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
    'do',
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
  typeident: /[A-Z]+\w*/,
  ident: /[a-z]+\w*/,
  procdefs: /proc|func|method|iterator|converter|template|macro/,

  tokenizer: {
    root: [
      { include: '@whitespace' },
      { include: '@numbers' },

      [/[{}()\[\]]/, '@brackets'],
      [/[,;]/, 'delimiter'],

      // strings
      [/"[^"]*"/, 'string'],

      // characters
      [/'[^\\']'/, 'string'],
      [/(')([a-z]\w*)/, ['keyword.operator', 'type']],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],

      // keyword, type, operator
      [/@typeident/, 'type'],
      [/(@specialchars)+/, 'keyword.operator'],
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
      [/""".*"""/, 'string'],
      [/""".*/, 'string', '@endMultiLineString'],
      [/#(?!\[).*/, 'comment'],
      [/#\[.*/, 'comment', '@endMultiLineComment'],
    ],
    // NOTE: nested comments does not work
    endMultiLineComment: [
      [/.*\]#/, 'comment', '@popall'],
      [/.*/, 'comment']
    ],
    endMultiLineString: [
      [/\\"/, 'string'],
      [/.*"""/, 'string', '@popall'],
      [/.*/, 'string']
    ],

    numbers: [
      [/[-+]?0[bB]([_01]+)/, 'number'],           // binary
      [/[-+]?0[oO]([_0-7]*)/, 'number'],          // octal
      [/[-+]?0[xX]([_a-f0-9]*)/, 'number'],       // hexadecimal
      [/(?=[-+]?[0-9]+)[e\-0-9]+/, 'number'],     // int
      [/[-+]?[0-9]*\.[0-9]+[e\-0-9]+/, 'number'], // float
    ],
  }
};