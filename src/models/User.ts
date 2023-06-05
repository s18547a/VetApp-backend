class User {
    UserId: string;
    Email: string;
    Password: string;
    OwnerId: string | null;
    VetId: string | null;
    Manager: boolean | null;
    ProfileImage:string|null;

    constructor(
        UserId: string,
        Email: string,
        Password: string,
        OwnerId: string | null,
        VetId: string | null,
        Manager: boolean | null,
        ProfileImage:string|null
    ) {
        this.UserId = UserId;
        this.Email = Email;
        this.Password = Password;
        this.OwnerId = OwnerId;
        this.VetId = VetId;
        this.Manager = Manager;
        this.ProfileImage=ProfileImage;
    }
}

export default User;
