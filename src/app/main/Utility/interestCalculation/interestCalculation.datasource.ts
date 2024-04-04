import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { FuseUtils } from "@fuse/utils";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { InterestCalculationService } from "./interestCalculation.service";

export class InterestCalculationDataSource extends DataSource<any> {
    private _filterChange = new BehaviorSubject("");
    private _filteredDataChange = new BehaviorSubject("");

    constructor(
        private interestCalculationService: InterestCalculationService,
        private _matInterestCalculationPaginator: MatPaginator,
        private _matInterestCalculationSort: MatSort
    ) {
        super();
        this.filteredData =
            this.interestCalculationService.InterestInstallmentList;
    }

    connect(): Observable<any[]> {
        const displayDataChanges = [
            this.interestCalculationService.onInterestCalculationChanged,
            this._matInterestCalculationPaginator.page,
            this._matInterestCalculationSort.sortChange,
            this._filterChange,
        ];
        return merge(...displayDataChanges).pipe(
            map(() => {
                if (
                    this.interestCalculationService.InterestInstallmentList ===
                    undefined
                ) {
                    return;
                }
                if (
                    this.interestCalculationService.InterestInstallmentList ===
                    undefined
                ) {
                    return;
                }
                let data =
                    this.interestCalculationService.InterestInstallmentList.slice();

                data = this.filterData(data);
                this.filteredData = [...data];
                data = this.sortData(data);
                const startIndex =
                    this._matInterestCalculationPaginator.pageIndex *
                    this._matInterestCalculationPaginator.pageSize;

                return data.splice(
                    startIndex,
                    this._matInterestCalculationPaginator.pageSize
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
            !this._matInterestCalculationSort.active ||
            this._matInterestCalculationSort.direction === ""
        ) {
            return data;
        }
        return data.sort((a, b) => {
            let propertyA: number | string = "";
            let propertyB: number | string = "";
            switch (this._matInterestCalculationSort.active) {
                case "InstallmentIndex":
                    [propertyA, propertyB] = [
                        a.InstallmentIndex,
                        b.InstallmentIndex,
                    ];
                    break;
                case "InstallmentDate":
                    [propertyA, propertyB] = [
                        a.InstallmentDate,
                        b.InstallmentDate,
                    ];
                    break;

                case "InstallmentAmount":
                    [propertyA, propertyB] = [
                        a.InstallmentAmount,
                        b.InstallmentAmount,
                    ];
                    break;
                case "CapitalAmount":
                    [propertyA, propertyB] = [a.CapitalAmount, b.CapitalAmount];
                    break;

                case "InterestAmount":
                    [propertyA, propertyB] = [
                        a.InterestAmount,
                        b.InterestAmount,
                    ];
                    break;
                case "KkdfAmount":
                    [propertyA, propertyB] = [a.KkdfAmount, b.KkdfAmount];
                    break;
                case "BsmvAmount":
                    [propertyA, propertyB] = [a.BsmvAmount, b.BsmvAmount];
                    break;
                case "RemainingCapitalAmount":
                    [propertyA, propertyB] = [
                        a.RemainingCapitalAmount,
                        b.RemainingCapitalAmount,
                    ];
                    break;
            }
            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
            return (
                (valueA < valueB ? -1 : 1) *
                (this._matInterestCalculationSort.direction === "asc" ? 1 : -1)
            );
        });
    }

    disconnect(): void {}
}

export default InterestCalculationDataSource;
