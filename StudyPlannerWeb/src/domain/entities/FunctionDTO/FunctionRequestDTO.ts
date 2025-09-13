export class GroupFunctionRequestDTO {
    FunctionId: string;
    FunctionName: string;

    constructor({ FunctionId, FunctionName }: { FunctionId: string; FunctionName: string; }) {
        this.FunctionId = FunctionId;
        this.FunctionName = FunctionName

    }
}