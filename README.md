# Bongo Cat Decorator

This extension is based on the official [vscode-extension-samples/decorator-sample/](https://github.com/Microsoft/vscode-extension-samples/tree/master/decorator-sample).
It adds Bongo Cat animated icon to the end of the file. 

![Bongo Cat Decorator preview](preview.gif)

## VSCode API

The code uses VSCode's [`TextEditor.setDecorations`](https://code.visualstudio.com/api/references/vscode-api#TextEditor.setDecorations) and [`vscode.window.createTextEditorDecorationType`](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType) APIs.

## Running the code

* `npm install` to initialize the project
* `npm run watch` to start the compiler in watch mode
* open this folder in VS Code and press `F5`
* this will open the `[Extension Development Host]` window, running the extension:
  * Open any document and start typing to see Bongo Cat
