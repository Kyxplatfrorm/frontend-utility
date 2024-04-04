import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { TenantApiResponse, TenantDefinitionEntity } from "app/ui/tenant";

@Injectable({ providedIn: "root" })
export class TenantDefinitionsService {
    tenantDefApiResponse: TenantApiResponse;
    onTenantDefChanged: BehaviorSubject<any>;
    tenantList: TenantDefinitionEntity[];

    constructor(private http: HttpClient) {
        this.onTenantDefChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([this.getTenants()]).then(() => {
                resolve();
            }, reject);
        });
    }

    /**
     * getTenants
     *
     * @returns {Promise<any>}
     */
    getTenants(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .get<TenantApiResponse>(
                    `${environment.apiUrl}/motion/adminapi/v1.0/Tenant/GetTenants`
                )
                .subscribe((response: TenantApiResponse) => {
                    this.tenantDefApiResponse = response;
                    this.onTenantDefChanged.next(this.tenantDefApiResponse);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * DeleteTenant
     *
     * @param tenant
     * @returns {Promise<any>}
     */
    deleteTenant(tenant): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .delete(
                    `${environment.apiUrl}/motion/adminapi/v1.0/Tenant/DeleteTenant?deleteTenantId=` +
                        tenant.Id
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
