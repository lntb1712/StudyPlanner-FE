export class LoginResponseDTO {
    token: string;
    username: string;
    groupId: number;

    constructor({ Token, Username, GroupId }: { Token: string; Username: string; GroupId: number }) {
        this.token = Token;
        this.username = Username;
        this.groupId = GroupId;
    }

    static fromJson(json: { Token: string; Username: string; GroupId: number }) {
        return new LoginResponseDTO({
            Token: json.Token,
            Username: json.Username,
            GroupId: json.GroupId
        })
    }
}