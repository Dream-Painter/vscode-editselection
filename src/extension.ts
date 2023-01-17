import * as vscode from 'vscode';
import { DirectPattern } from './pattern-direct';
import { PeriodicPattern } from './pattern-periodic';

export function activate(context: vscode.ExtensionContext) {
	
    DirectPattern.register(context);
    PeriodicPattern.register(context);
}

export function deactivate() {}
