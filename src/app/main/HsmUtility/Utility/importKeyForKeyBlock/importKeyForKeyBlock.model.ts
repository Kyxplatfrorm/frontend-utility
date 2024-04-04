export class ImportKey {
    KeyUsage: string;
    ZmkUnderLmk: string;
    KeyUnderZmk: string;
    KeyUnderLmk: string;
    HsmErrorCode: string;
    HsmErrorDescription: string;
    KeyKcv: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param importKey
     */
    constructor(importKey?) {
        importKey = importKey || {};
        this.KeyUsage = importKey.KeyUsage;
        this.KeyKcv = importKey.KeyKcv;
        this.HsmErrorCode = importKey.HsmErrorCode;
        this.HsmErrorDescription = importKey.HsmErrorDescription;
        this.ZmkUnderLmk = importKey.ZmkUnderLmk;
        this.KeyUnderZmk = importKey.KeyUnderZmk;
        this.KeyUnderLmk = importKey.KeyUnderLmk;
        this.images = importKey.images || [];
    }
}
