/* tslint:disable:max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class I18NStub {
    public tr(key: string, _options?: object) {
        return key;
    }
}

export class NavigationInstruction {
    public constructor(public instructions, public config) {
    }

    public getAllInstructions() {
        return this.instructions;
    }
}
