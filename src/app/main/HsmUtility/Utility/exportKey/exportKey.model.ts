export class ExportKey {
    KeyTypeId: number;
    ZmkUnderLmk: string;
    KeyUnderLmk: string;
    KeyUnderZmk: string;
    HsmErrorCode: string;
    HsmErrorDescription: string;
    KeyExportSchema: string;
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
     * @param exportKey
     */
    constructor(exportKey?) {
        exportKey = exportKey || {};
        this.KeyTypeId = exportKey.KeyTypeId;
        this.KeyKcv = exportKey.KeyKcv;
        this.HsmErrorCode = exportKey.HsmErrorCode;
        this.HsmErrorDescription = exportKey.HsmErrorDescription;
        this.KeyUnderLmk = exportKey.KeyUnderLmk;
        this.KeyUnderZmk = exportKey.KeyUnderZmk;
        this.ZmkUnderLmk = exportKey.ZmkUnderLmk;
        this.KeyExportSchema = exportKey.KeyExportSchema;
        this.images = exportKey.images || [];
    }
}
