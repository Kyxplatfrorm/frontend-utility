export class GeneratePvv {
    HsmErrorCode: string;
    HsmErrorDescription: string;
    PinUnderLmk: string;
    CardNumber: string;
    PvvKeyIndex: string;
    PvvKey: string;
    Pvv: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param generatePvv
     */
    constructor(generatePvv?) {
        generatePvv = generatePvv || {};
        this.HsmErrorCode = generatePvv.HsmErrorCode;
        this.HsmErrorDescription = generatePvv.HsmErrorDescription;
        this.PinUnderLmk = generatePvv.PinUnderLmk;
        this.CardNumber = generatePvv.CardNumber;
        this.PvvKeyIndex = generatePvv.PvvKeyIndex;
        this.PvvKey = generatePvv.PvvKey;
        this.Pvv = generatePvv.Pvv;
        this.images = generatePvv.images || [];
    }
}
