export class GroupManagementTotalDTO{
    GroupId:string;
    GroupName:string;
    TotalUser:number;

   constructor({GroupId,GroupName,TotalUser}: {GroupId:string; GroupName:string; TotalUser:number;}){
        this.GroupId = GroupId;
        this.GroupName = GroupName;
        this.TotalUser = TotalUser;
    }

    static fromJson(json:any): GroupManagementTotalDTO{
        return new GroupManagementTotalDTO({
            GroupId:json.GroupId,
            GroupName:json.GroupName,
            TotalUser:json.TotalUser
        });
    }
}