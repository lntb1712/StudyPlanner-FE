import type { GroupFunctionResponseDTO } from "../GroupFunctionDTO/GroupFunctionResponseDTO";

export class GroupManagementRequestDTO{
    GroupId:string;
    GroupName:string;
    GroupDescription:string;
    GroupFunctions:GroupFunctionResponseDTO[];  

    constructor({GroupId,GroupName,GroupDescription,GroupFunctions}: {GroupId:string; GroupName:string; GroupDescription:string; GroupFunctions:GroupFunctionResponseDTO[]}){
        this.GroupId = GroupId;
        this.GroupName = GroupName;
        this.GroupDescription = GroupDescription;
        this.GroupFunctions = GroupFunctions;
    }
}