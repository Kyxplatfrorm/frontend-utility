export class ImportKey {
    KeyTypeId: number;
    KeyUnderZmk: string;
    KeySchema: string;
    AtallaVariant: string;
    ZmkUnderLmk: string;
    HsmErrorCode: string;
    HsmErrorDescription: string;
    KeyUnderLmk: string;
    KeyKcv: string;
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
     * @param importKey
     */
    constructor(importKey?) {
        importKey = importKey || {};
        this.KeyTypeId = importKey.KeyTypeId;
        this.LmkIdentifier = importKey.LmkIdentifier;
        this.KeyKcv = importKey.KeyKcv;
        this.KeySchema = importKey.KeySchema;
        this.HsmErrorCode = importKey.HsmErrorCode;
        this.HsmErrorDescription = importKey.HsmErrorDescription;
        this.AtallaVariant = importKey.AtallaVariant;
        this.KeyUnderLmk = importKey.KeyUnderLmk;
        this.KeyUnderZmk = importKey.KeyUnderZmk;
        this.ZmkUnderLmk = importKey.ZmkUnderLmk;
        this.images = importKey.images || [];
    }
}
