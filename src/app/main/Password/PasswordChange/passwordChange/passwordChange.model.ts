export class PasswordChange {
    OldPassword: string;
    NewPassword: string;
    NewPassword2: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param passwordChange
     */
    constructor(passwordChange?) {
        passwordChange = passwordChange || {};
        this.OldPassword = passwordChange.OldPassword;
        this.NewPassword = passwordChange.NewPassword;
        this.NewPassword2 = passwordChange.NewPassword2;
        this.images = passwordChange.images || [];
    }
}
