export class TranslatePinLmkToZpk {
    HsmErrorCode: string;
    HsmErrorDescription: string;
    ZpkUnderLmk: string;
    KeyLength: string;
    CardNumber: string;
    PinLmk: string;
    PinBlockFormat: string;
    PinUnderZpk: string;
    LmkIdentifier: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param translatePinLmkToZpk
     */
    constructor(translatePinLmkToZpk?) {
        translatePinLmkToZpk = translatePinLmkToZpk || {};
        this.HsmErrorCode = translatePinLmkToZpk.HsmErrorCode;
        this.LmkIdentifier = translatePinLmkToZpk.LmkIdentifier;
        this.HsmErrorDescription = translatePinLmkToZpk.HsmErrorDescription;
        this.ZpkUnderLmk = translatePinLmkToZpk.ZpkUnderLmk;
        this.KeyLength = translatePinLmkToZpk.KeyLength;
        this.CardNumber = translatePinLmkToZpk.CardNumber;
        this.PinLmk = translatePinLmkToZpk.PinLmk;
        this.PinBlockFormat = translatePinLmkToZpk.PinBlockFormat;
        this.PinUnderZpk = translatePinLmkToZpk.PinUnderZpk;
        this.images = translatePinLmkToZpk.images || [];
    }
}
