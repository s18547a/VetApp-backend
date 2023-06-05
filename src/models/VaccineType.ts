
class VaccineType{

    VaccineType:string;
    Species:string|null;    
    Core:boolean;
    constructor(VaccineType:string,  Species:string|null ,Core:boolean   ){
        this.VaccineType=VaccineType;
        this.Species=Species;
        this.Core=Core;
    }
}

export default VaccineType;