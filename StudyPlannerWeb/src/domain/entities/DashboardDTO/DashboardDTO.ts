import { GroupManagementTotalDTO } from "../GroupManagementDTO/GroupManagementTotalDTO";
import { StudentClassTotalDTO } from "../StudentClassDTO/StudentClassTotalDTO";


export class DashboardDTO {
  TotalAccounts: number;
  TotalGroups: number;
  TotalClasses: number;
  ClassWithStudentCounts: StudentClassTotalDTO[];
  TotalNewAccountInMonth: number;
  PercentUpDownNewRegisterAccount: number;
  GroupsWithUserCounts: GroupManagementTotalDTO[];

  constructor({
    TotalAccounts,
    TotalGroups,
    TotalClasses,
    ClassWithStudentCounts,
    TotalNewAccountInMonth,
    PercentUpDownNewRegisterAccount,
    GroupsWithUserCounts
  }: {
    TotalAccounts: number;
    TotalGroups: number;
    TotalClasses: number;
    ClassWithStudentCounts: StudentClassTotalDTO[];
    TotalNewAccountInMonth: number;
    PercentUpDownNewRegisterAccount: number;
    GroupsWithUserCounts: GroupManagementTotalDTO[];
  }) {
    this.TotalAccounts = TotalAccounts;
    this.TotalGroups = TotalGroups;
    this.TotalClasses = TotalClasses;
    this.ClassWithStudentCounts = ClassWithStudentCounts;
    this.TotalNewAccountInMonth = TotalNewAccountInMonth;
    this.PercentUpDownNewRegisterAccount = PercentUpDownNewRegisterAccount;
    this.GroupsWithUserCounts = GroupsWithUserCounts;
  }

  static fromJson(json: any): DashboardDTO {
    return new DashboardDTO({
      TotalAccounts: json.TotalAccounts || 0,
      TotalGroups: json.TotalGroups || 0,
      TotalClasses: json.TotalClasses || 0,
      ClassWithStudentCounts: (json.ClassWithStudentCounts || []).map((item: any) => StudentClassTotalDTO.fromJson(item)),
      TotalNewAccountInMonth: json.TotalNewAccountInMonth || 0,
      PercentUpDownNewRegisterAccount:json.PercentUpDownNewRegisterAccount,
      GroupsWithUserCounts: (json.GroupsWithUserCounts || []).map((item: any) => GroupManagementTotalDTO.fromJson(item)),
    });
  }
}