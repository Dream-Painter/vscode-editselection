import * as vscode from 'vscode';
import { Input, IPatternType, PatternSelectCommand } from './select-from-pattern';

export class PeriodicPattern implements IPatternType {
    private static readonly commandId: string = "edit-selection.periodic-pattern-select";
    public readonly placeHolder = "period:a b ...";
    public readonly prompt = "For every 'period' selections, keep the a'th and the b'th, and the ...";

    public static register(context: vscode.ExtensionContext) : void {
        context.subscriptions.push(vscode.commands.registerCommand(PeriodicPattern.commandId, PeriodicPattern.processInput));
    }

    public static processInput() {
        PatternSelectCommand.processInput(new PeriodicPattern());
    }

    public validateInput(input: Input): string {
        // no zeroes allowed
        if (input.numbers[0] === 0) {
            return "Period must be >0";
        }
        return "";
    }

    public newSelections(input: Input, selectionsInit: vscode.Selection[]): vscode.Selection[] {
        let period: number = input.numbers[0];
        let takers: number[] = [];

        if (input.numbers.length === 1) {
            // If there are no indices per period given, assume to take the first of every period
            takers = [0];
        } else {
            // filter indices to make sure there are no duplicates and no overflow
            for (let i: number = 1; i < input.numbers.length; i++) {
                let num: number = input.numbers[i] % period;
                if (!takers.includes(num)) {
                    takers.push(num);
                }
            }
        }

        let i: number = 0;
        let newSelections: vscode.Selection[] = [];

        while (i < selectionsInit.length) {
            let broken: boolean = false;
            for (const index of takers) {
                if (i + index < selectionsInit.length) {
                    newSelections.push(selectionsInit[i+index]);
                } else {
                    broken = true;
                    break;
                }
            }

            if (broken) { break; }
            i += period;
        }

        return newSelections;
    }
}