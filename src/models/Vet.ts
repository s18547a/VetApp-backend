class Vet {
    VetId: string;
    Name: string;
    LastName: string;
    Contact: string;
    Email: string;
    HireDate: string;
    ProfileImage: string | null;
    Types: { VetType: string; }[];
    constructor(
        VetId: string,
        Name: string,
        LastName: string,
        Contact: string,
        Email: string,
        HireDate: string,
        ProfileImage: string | null,
        Types: { VetType: string }[]
    ) {
        this.VetId = VetId;
        this.Name = Name;
        this.LastName = LastName;
        this.Contact = Contact;
        this.Types = Types;
        this.HireDate = HireDate;
        this.Email = Email;
        this.ProfileImage = ProfileImage;
    }
}

export default Vet;
