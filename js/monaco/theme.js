// monaco theme
//https://github.com/Microsoft/monaco-editor/blob/main/test/playground.generated/customizing-the-appearence-exposed-colors.html

// dracula theme
//https://github.com/dracula/visual-studio-code/blob/master/src/dracula.yml

const BG = '282A36'
const BG_Lighter = '3f435a'
const FG = 'F8F8F2'
const SELECTION = '44475A'
const COMMENT = '6272A4'
const CYAN = '8BE9FD'
const GREEN = '50FA7B'
const ORANGE = 'FFB86C'
const PINK = 'FF79C6'
const PURPLE = 'BD93F9'
const RED = 'FF5555'
const YELLOW = 'F1FA8C'

export const dracula = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      foreground: FG,
      token: '',
    },
    {
      foreground: FG,
      token: 'delimiter',
    },
    {
      foreground: PINK,
      token: 'keyword',
    },
    {
      foreground: COMMENT,
      token: 'comment',
    },
    {
      foreground: YELLOW,
      token: 'string',
    },
    {
      foreground: PINK,
      token: 'keyword.operator',
    },
    {
      foreground: CYAN,
      token: 'type',
    },
    {
      foreground: PURPLE,
      token: 'number',
    },
  ],
  colors: {
    'editor.background': `#${BG}`,
    'editor.foreground': `#${FG}`,
    'editor.selectionBackground': '#383b4a',
    'editor.lineHighlightBackground': '#00000012',
    'editorCursor.foreground': `#${FG}`,
    'editorWhitespace.foreground': `#${BG_Lighter}`,
    'editorIndentGuide.background': `#${BG_Lighter}`,
    'editorLineNumber.foreground': `#${COMMENT}`,
    'editorLineNumber.activeForeground': `#${PURPLE}`,
    'scrollbar.shadow': '#00000050',
  },
}
