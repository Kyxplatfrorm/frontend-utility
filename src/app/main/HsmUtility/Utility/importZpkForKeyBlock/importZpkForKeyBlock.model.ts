export class ImportKey {
    ZpkUnderZmk: string;
    ZmkUnderLmk: string;
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
        this.ZpkUnderZmk = importKey.ZpkUnderZmk;
        this.KeyKcv = importKey.KeyKcv;
        this.HsmErrorCode = importKey.HsmErrorCode;
        this.HsmErrorDescription = importKey.HsmErrorDescription;
        this.ZmkUnderLmk = importKey.ZmkUnderLmk;
        this.KeyUnderLmk = importKey.KeyUnderLmk;
        this.images = importKey.images || [];
    }
}
