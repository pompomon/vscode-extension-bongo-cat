import * as vscode from 'vscode';
import { DecorationOptions, TextEditorDecorationType, EndOfLine } from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	const UPDATE_DECORATIONS_TIMEOUT = 200;
	const RESET_DECARATIONS_TIMEOUT = 50;
	const extensionPath = context.extensionPath;
	let decorationNumber = 0;

	let timeout: NodeJS.Timer | undefined = undefined;
	const blankDecoration = vscode.window.createTextEditorDecorationType({
	});
	const pawsUpDecoration = vscode.window.createTextEditorDecorationType({
		after: {
			contentIconPath: `${extensionPath}/media/icons/bongo-cat-1.png`,
		},
	});
	const pawsDownDecoration = vscode.window.createTextEditorDecorationType({
		after: {
			contentIconPath: `${extensionPath}/media/icons/bongo-cat-2.png`,
		},
	});
	const rightPawDownDecoration = vscode.window.createTextEditorDecorationType({
		after: {
			contentIconPath: `${extensionPath}/media/icons/bongo-cat-3.png`,
		},
	});
	const leftPawDownDecoration = vscode.window.createTextEditorDecorationType({
		after: {
			contentIconPath: `${extensionPath}/media/icons/bongo-cat-4.png`,
		},
	});
	const decorations = [pawsUpDecoration, leftPawDownDecoration, rightPawDownDecoration, pawsDownDecoration, leftPawDownDecoration, rightPawDownDecoration];

	let activeEditor = vscode.window.activeTextEditor;
	let lastDecorationType:TextEditorDecorationType | null = null;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const decorationType = decorations[decorationNumber];
		// create a decorator type that we use to decorate large numbers
		const text = activeEditor.document.getText();
		const cursorPosition = activeEditor.selection.active;
		// Find closest line end
		const cursorOffset = activeEditor.document.offsetAt(cursorPosition);
		const nextEndOfLine = text.indexOf(activeEditor.document.eol === EndOfLine.LF ? '\n' : '\r\n', cursorOffset);
		const iconPositionEnd = nextEndOfLine > -1 ? nextEndOfLine : text.length;
		// Create decoration positions
		const startPos = activeEditor.document.positionAt(iconPositionEnd - 1);
		const endPos = activeEditor.document.positionAt(iconPositionEnd);
		const decoration: DecorationOptions = {
			range: new vscode.Range(startPos, endPos),
		};
		if (lastDecorationType !== null) {
			activeEditor.setDecorations(lastDecorationType, []);
		}
		activeEditor.setDecorations(decorationType, [decoration]);
		lastDecorationType = decorationType;
		decorationNumber++;
		decorationNumber = decorationNumber % decorations.length;
		timeout = setTimeout(updateDecorations, UPDATE_DECORATIONS_TIMEOUT);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, RESET_DECARATIONS_TIMEOUT);
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(
		(editor) => {
			activeEditor = editor;
			if (editor) {
				triggerUpdateDecorations();
			}
		},
		null,
		context.subscriptions
	);

	vscode.workspace.onDidChangeTextDocument(
		(event) => {
			if (activeEditor && event.document === activeEditor.document) {
				triggerUpdateDecorations();
			}
		},
		null,
		context.subscriptions
	);
}
