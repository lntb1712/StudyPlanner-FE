export class AccountManagementResponseDTO{
    Username: string;
    FullName: string;
    Email: string;
    ParentEmail: string;
    GroupId: string;
    GroupName: string;
    CreatedAt: string;

    constructor({ Username, FullName, Email, ParentEmail, GroupId, GroupName, CreatedAt }: { Username: string; FullName: string; Email: string; ParentEmail: string; GroupId: string; GroupName: string; CreatedAt: string }) {
        this.Username = Username;
        this.FullName = FullName;
        this.Email = Email;
        this.ParentEmail = ParentEmail;
        this.GroupId = GroupId;
        this.GroupName = GroupName;
        this.CreatedAt = CreatedAt;
    }

    static fromJson(json: any): AccountManagementResponseDTO {
        return new AccountManagementResponseDTO({
            Username: json.UserName,
            FullName: json.FullName,
            Email: json.Email,
            ParentEmail: json.ParentEmail,
            GroupId: json.GroupId, 
            GroupName: json.GroupName,
            CreatedAt: json.CreatedAt
        });
    }

}