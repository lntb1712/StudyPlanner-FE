export class GroupFunctionRequestDTO{
    FunctionId:string;
    GroupId:string;
    IsEnable:boolean;
    IsReadOnly:boolean;

    constructor({GroupId, FunctionId,IsEnable,IsReadOnly}:{GroupId:string; FunctionId:string;IsEnable:boolean;IsReadOnly:boolean}){
        this.GroupId =GroupId;
        this.FunctionId =FunctionId;
        this.IsEnable =IsEnable;
        this.IsReadOnly =IsReadOnly;
    }
}