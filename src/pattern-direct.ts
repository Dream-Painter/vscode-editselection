import * as vscode from 'vscode';
import { Input, IPatternType, PatternSelectCommand } from './select-from-pattern';

export class DirectPattern implements IPatternType {
    private static readonly commandId: string = "edit-selection.direct-pattern-select";
    public readonly placeHolder = "a b ...";
    public readonly prompt = "Keep the first, then the a'th after that, then the b'th after that, ... , then the a'th after that, then the b'th after that, ... , until the end of the initial selections";

    public static register(context: vscode.ExtensionContext) : void {
        context.subscriptions.push(vscode.commands.registerCommand(DirectPattern.commandId, DirectPattern.processInput));
    }

    public static processInput() {
        PatternSelectCommand.processInput(new DirectPattern());
    }

    public validateInput(input: Input): string {
        for (const num of input.numbers) {
            if (num === 0) {
                return "No zeroes allowed";
            }
        }
        return "";
    }

    public newSelections(input: Input, selectionsInit: vscode.Selection[]): vscode.Selection[] {
        let i: number = 0;
        let j: number = 0;
        let newSelections: vscode.Selection[] = [];

        while (i < selectionsInit.length) {
            newSelections.push(selectionsInit[i]);
            i += input.numbers[j];
            j++;
            if (j >= input.numbers.length) {
                j = 0;
            }
        }
        return newSelections;
    }
}