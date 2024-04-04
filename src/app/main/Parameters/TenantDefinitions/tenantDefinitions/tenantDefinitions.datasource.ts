import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FuseUtils } from "@fuse/utils";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TenantDefinitionsService } from "./tenantDefinitions.service";

export class TenantDefinitionsDataSource extends DataSource<any> {
    private _filterChange = new BehaviorSubject("");
    private _filteredDataChange = new BehaviorSubject("");

    constructor(
        private tenantdefinitionsservice: TenantDefinitionsService,
        private _mattenantpaginator: MatPaginator,
        private _mattenantsort: MatSort
    ) {
        super();
        this.filteredData =
            this.tenantdefinitionsservice.tenantDefApiResponse.TenantDefinitionList;
    }

    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.tenantdefinitionsservice.onTenantDefChanged,
            this._mattenantpaginator.page,
            this._filterChange,
            this._mattenantsort.sortChange,
        ];
        return merge(...displayDataChanges).pipe(
            map(() => {
                let data =
                    this.tenantdefinitionsservice.tenantDefApiResponse.TenantDefinitionList.slice();
                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);
                const startIndex =
                    this._mattenantpaginator.pageIndex *
                    this._mattenantpaginator.pageSize;
                return data.splice(
                    startIndex,
                    this._mattenantpaginator.pageSize
                );
            })
        );
    }

    get filteredData(): any {
        return this._filteredDataChange.value;
    }
    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }
    get filter(): string {
        return this._filterChange.value;
    }
    set filter(filter: string) {
        this._filterChange.next(filter);
    }
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }
    sortData(data): any[] {
        if (
            !this._mattenantsort.active ||
            this._mattenantsort.direction === ""
        ) {
            return data;
        }
        return data.sort((a, b) => {
            let propertyA: number | string = "";
            let propertyB: number | string = "";
            switch (this._mattenantsort.active) {
                case "Id":
                    [propertyA, propertyB] = [a.Id, b.Id];
                    break;
                case "TenantName":
                    [propertyA, propertyB] = [a.TenantName, b.TenantName];
                    break;

                case "InsertDateTime":
                    [propertyA, propertyB] = [
                        a.InsertDateTime,
                        b.InsertDateTime,
                    ];
                    break;
                case "UpdateDateTime":
                    [propertyA, propertyB] = [
                        a.UpdateDateTime,
                        b.UpdateDateTime,
                    ];
                    break;
            }
            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (
                (valueA < valueB ? -1 : 1) *
                (this._mattenantsort.direction === "asc" ? 1 : -1)
            );
        });
    }

    disconnect(): void {}
}

export default TenantDefinitionsDataSource;
