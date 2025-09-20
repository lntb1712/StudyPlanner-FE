export class StudentClassRequestDTO{
    ClassId:string;
    StudentId:string;
    StudyStatus: number;

    constructor({ClassId,StudentId,StudyStatus}:{ClassId:string,StudentId:string, StudyStatus:number}){
        this.ClassId=ClassId;
        this.StudentId=StudentId;
        this.StudyStatus=StudyStatus;
    }
    
}