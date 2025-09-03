/**
 * DTO cho thông tin tài khoản trả về từ API.
 * Code dùng camelCase, mapping từ PascalCase JSON sang camelCase.
 */
export class AccountManagementResponseDTO {
  UserName: string;
  FullName: string;
  Email: string;
  ParentEmail: string;
  GroupId: string;
  GroupName: string;
  CreatedAt: string;

  constructor({
    UserName,
    FullName,
    Email,
    ParentEmail,
    GroupId,
    GroupName,
    CreatedAt,
  }: {
    UserName: string;
    FullName: string;
    Email: string;
    ParentEmail: string;
    GroupId: string;
    GroupName: string;
    CreatedAt: string;
  }) {
    this.UserName = UserName;
    this.FullName = FullName;
    this.Email = Email;
    this.ParentEmail = ParentEmail;
    this.GroupId = GroupId;
    this.GroupName = GroupName;
    this.CreatedAt = CreatedAt;
  }

  /**
   * Mapping từ JSON (API trả PascalCase) sang DTO (camelCase).
   */
  static fromJson(json: any): AccountManagementResponseDTO {
    return new AccountManagementResponseDTO({
      UserName: json.UserName,
      FullName: json.FullName,
      Email: json.Email,
      ParentEmail: json.ParentEmail,
      GroupId: json.GroupId,
      GroupName: json.GroupName,
      CreatedAt: json.CreatedAt,
    });
  }
}
