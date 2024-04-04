export class Tenant {
    Id: number;
    InsertDateTime: any;
    UpdateDateTime: any;
    TenantName: string;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param tenant
     */
    constructor(tenant?) {
        tenant = tenant || {};
        this.Id = tenant.Id;
        this.TenantName = tenant.TenantName;
        this.InsertDateTime = tenant.InsertDateTime;
        this.UpdateDateTime = tenant.UpdateDateTime;
        this.images = tenant.images || [];
    }
}
