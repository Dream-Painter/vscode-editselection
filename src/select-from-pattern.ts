import * as vscode from 'vscode';

export interface IPatternType {
    readonly placeHolder: string;
    readonly prompt: string;

    validateInput(input: Input): string;
    newSelections(input: Input, selectionsInit: vscode.Selection[]): vscode.Selection[]
}

export class PatternSelectCommand {

    public static processInput(patternType: IPatternType): void {
        let editorInit : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (editorInit !== undefined) {
            let editor: vscode.TextEditor = editorInit;

            // Get all selections as starts with, and sort them from top-left to bottom-right
            let selectionsInit: vscode.Selection[] = editor.selections.slice(0).sort(this.selectionSorter);

            // Should never happen, due to "enablement" of editorHasMultipleSelections
            if (selectionsInit.length <= 1) { return; }

            // Ask for user input
            let inputOptions: vscode.InputBoxOptions = {};

            inputOptions.placeHolder = patternType.placeHolder;
            inputOptions.prompt = patternType.prompt;
               
            inputOptions.validateInput = value => {
                // Parse input
                const input: Input = Input.parse(value);

                // Check if there are errors
                let error: string = input.findErrors();
                if (error.length > 0) {
                    return error;
                }
                error = patternType.validateInput(input);
                if (error.length > 0) {
                    return error;
                }

                // perform preview of current valid value
                this.perform(input,selectionsInit,editor,patternType);

                // null, as in: no errors found
                return null;
            };

            // User pressed [Enter] or cancelled the inputbox
            vscode.window.showInputBox(inputOptions).then(value => {
                const input: Input = Input.parse(value);
                // Seeing as the validate/preview already did the work: only undo in case of cancel
                if (!input.valid || input.undo) {
                    // Give input, which will result in same state as before
                    this.perform(new Input(false,true),selectionsInit,editor,patternType);
                }
            });
        }
    }
     
    private static selectionSorter(a: vscode.Selection, b: vscode.Selection): number {
        let line: number = a.anchor.line - b.anchor.line;
        if (line === 0) {
            // Same line, so sort on character column
            return a.anchor.character - b.anchor.character;
        } 
        // sort on line
        return line;
    }

    private static perform(input: Input, selectionsInit: vscode.Selection[], editor: vscode.TextEditor, patternType: IPatternType) : void {
        if (!input.valid || input.undo) {
            editor.selections = selectionsInit;
        } else {
            // Get correct selections per patternType
            editor.selections = patternType.newSelections(input, selectionsInit);
        }
    }

}

export class Input {
    public readonly valid: boolean;
    public readonly numbers: number[];
    public readonly undo: boolean;

    // a list of numbers, delimitted by non-numbers
    private static readonly inputList: RegExp = /^[^\d]*[\d]+(?:[^\d]+[\d]+)*[^\d]*$/;

    // all numbers
    private static readonly parsedNumbers: RegExp = /\d+/g;

    constructor (valid: boolean, undo: boolean, numbers: number[] = []) {
        this.undo = undo;
        this.numbers = numbers;
        this.valid = valid && (this.numbers.length >= 1);
    }

    public static parse(value: string | undefined) : Input {
        if (value === undefined) {
            // user cancelled the command
            return new Input(false,true);
        } else if (value.match(Input.inputList) !== null) {
            // value consists of a list of numbers of atleast length 1
            let numbers: number[] = [];
            for (const num of value.matchAll(Input.parsedNumbers)) {
                numbers.push(Number.parseInt(num[0]));
            }

            return new Input(true,false,numbers);
        } else {
            // value is completely invalid
            return new Input(false,false);
        }
    }
    
    public findErrors() : string {
        if (!this.valid) {
            return "Invalid input: Expects a list of numbers, delimitted by non-numbers";
        }

        return "";
    }
}
