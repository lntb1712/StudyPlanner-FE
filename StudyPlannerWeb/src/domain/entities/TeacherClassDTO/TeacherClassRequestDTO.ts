export class TeacherClassRequestDTO{
    ClassId:string;
    TeacherId:string;
    Subject: string;

    constructor({ClassId,TeacherId,Subject}:{ClassId:string,TeacherId:string, Subject:string}){
        this.ClassId=ClassId;
        this.TeacherId=TeacherId;
        this.Subject=Subject;
    }
    
}