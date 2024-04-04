export class GeneratePinLmk {
    LmkType: string;
    CardNumber: string;
    LmkIdentifier: string;
    PinLmk: string;
    HsmErrorCode: string;
    HsmErrorDescription: string;
    PinLength: string;
    EncryptedPin: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param generatePinLmk
     */
    constructor(generatePinLmk?) {
        generatePinLmk = generatePinLmk || {};
        this.LmkType = generatePinLmk.LmkType;
        this.PinLength = generatePinLmk.PinLength;
        this.EncryptedPin = generatePinLmk.EncryptedPin;
        this.HsmErrorCode = generatePinLmk.HsmErrorCode;
        this.HsmErrorDescription = generatePinLmk.HsmErrorDescription;
        this.CardNumber = generatePinLmk.CardNumber;
        this.LmkIdentifier = generatePinLmk.LmkIdentifier;
        this.PinLmk = generatePinLmk.PinLmk;
        this.images = generatePinLmk.images || [];
    }
}
