export class ClassRequestDTO {
    ClassId: string;
    ClassName: string;

    constructor({ClassId, ClassName}: {ClassId:string; ClassName:string;}){
        this.ClassId= ClassId;
        this.ClassName= ClassName;
    }
}