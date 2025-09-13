export class GroupFunctionResponseDTO{
    FunctionId:string;
    GroupId:string;
    FunctionName:string;
    IsEnable:boolean;
    IsReadOnly:boolean;

    constructor({GroupId, FunctionId,FunctionName,IsEnable,IsReadOnly}:{GroupId:string; FunctionId:string;FunctionName:string;IsEnable:boolean;IsReadOnly:boolean}){
        this.GroupId =GroupId;
        this.FunctionId =FunctionId;
        this.FunctionName =FunctionName;
        this.IsEnable =IsEnable;
        this.IsReadOnly =IsReadOnly;
    }

    static fromJson (json:any):GroupFunctionResponseDTO{
        return new GroupFunctionResponseDTO({
            GroupId:json.GroupId,
            FunctionId:json.FunctionId,
            FunctionName:json.FunctionName,
            IsEnable:json.IsEnable,
            IsReadOnly:json.IsReadOnly
        });

    }
}