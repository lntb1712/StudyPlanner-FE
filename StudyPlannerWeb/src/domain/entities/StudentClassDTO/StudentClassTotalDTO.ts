export class StudentClassTotalDTO{
    ClassId:string;
    ClassName:string;
    TotalStudent: number;

    constructor({ClassId,ClassName, TotalStudent}:{ClassId:string,ClassName:string,TotalStudent:number}){
        this.ClassId=ClassId;
        this.ClassName=ClassName;
        this.TotalStudent=TotalStudent;
    }

    static fromJson(json:any) :StudentClassTotalDTO{
        return new StudentClassTotalDTO({
            ClassId: json.ClassId,
            ClassName: json.ClassName,
            TotalStudent: json.TotalStudent,
        });
    }
    
}