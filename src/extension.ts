import * as vscode from 'vscode';
import { DecorationOptions, TextEditorDecorationType } from 'vscode';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
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
	const decorations = [pawsUpDecoration, pawsDownDecoration];

	let activeEditor = vscode.window.activeTextEditor;
	let lastDecorationType:TextEditorDecorationType | null = null;

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const decorationType = decorations[decorationNumber];
		// create a decorator type that we use to decorate large numbers
		const text = activeEditor.document.getText();
		const startPos = activeEditor.document.positionAt(text.length - 1);
		const endPos = activeEditor.document.positionAt(text.length);
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
		timeout = setTimeout(updateDecorations, 200);
	}

	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 50);
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
