export class GroupManagementResponseDTO{
    GroupId:string;
    GroupName:string;
    GroupDescription:string;

   constructor({GroupId,GroupName,GroupDescription}: {GroupId:string; GroupName:string; GroupDescription:string;}){
        this.GroupId = GroupId;
        this.GroupName = GroupName;
        this.GroupDescription = GroupDescription;
    }

    static fromJson(json:any): GroupManagementResponseDTO{
        return new GroupManagementResponseDTO({
            GroupId:json.GroupId,
            GroupName:json.GroupName,
            GroupDescription:json.GroupDescription
        });
    }
}