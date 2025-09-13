export class FunctionResponseDTO{
    FunctionId:string;
    FunctionName:string;
    IsEnable:boolean;
    IsReadOnly:boolean;

    constructor({ FunctionId,FunctionName,IsEnable,IsReadOnly}:{ FunctionId:string;FunctionName:string;IsEnable:boolean;IsReadOnly:boolean}){
        this.FunctionId =FunctionId;
        this.FunctionName =FunctionName;
        this.IsEnable =IsEnable;
        this.IsReadOnly =IsReadOnly;
    }

    static fromJson (json:any):FunctionResponseDTO{
        return new FunctionResponseDTO({
            FunctionId:json.FunctionId,
            FunctionName:json.FunctionName,
            IsEnable:json.IsEnable,
            IsReadOnly:json.IsReadOnlys
        });

    }
}