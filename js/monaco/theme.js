// monaco theme
//https://github.com/Microsoft/monaco-editor/blob/main/test/playground.generated/customizing-the-appearence-exposed-colors.html

// dracula theme
//https://github.com/dracula/visual-studio-code/blob/master/src/dracula.yml

const
  BG =
    "282A36",
  BG_Lighter =
    "3f435a",
  FG =
    "F8F8F2",
  SELECTION =
    "44475A",
  COMMENT =
    "6272A4",
  CYAN =
    "8BE9FD",
  GREEN =
    "50FA7B",
  ORANGE =
    "FFB86C",
  PINK =
    "FF79C6",
  PURPLE =
    "BD93F9",
  RED =
    "FF5555",
  YELLOW =
    "F1FA8C";

export const dracula = {
  "base": "vs-dark",
  "inherit": true,
  "rules": [
    {
      "foreground": FG,
      "token": ""
    },
    {
      "foreground": FG,
      "token": "delimiter"
    },
    {
      "foreground": PINK,
      "token": "keyword"
    },
    {
      "foreground": COMMENT,
      "token": "comment"
    },
    {
      "foreground": YELLOW,
      "token": "string"
    },
    {
      "foreground": PINK,
      "token": "keyword.operator"
    },
    {
      "foreground": CYAN,
      "token": "type"
    },
    {
      "foreground": PURPLE,
      "token": "number"
    },
  ],
  "colors": {
    "editor.background": `#${BG}`,
    "editor.foreground": `#${FG}`,
    "editor.selectionBackground": "#383b4a",
    "editor.lineHighlightBackground": "#00000012",
    "editorCursor.foreground": `#${FG}`,
    "editorWhitespace.foreground": `#${BG_Lighter}`,
    "editorIndentGuide.background": `#${BG_Lighter}`,
    "editorLineNumber.foreground": `#${COMMENT}`,
    "editorLineNumber.activeForeground": `#${PURPLE}`,
    "scrollbar.shadow": "#00000050",
  }
}