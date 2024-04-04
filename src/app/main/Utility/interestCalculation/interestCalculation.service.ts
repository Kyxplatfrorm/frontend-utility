import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import {
    InstallmentEntity,
    InteresCalculationApiResponse,
} from "app/ui/utility";

@Injectable({ providedIn: "root" })
export class InterestCalculationService {
    interestCalculationApiResponse: InteresCalculationApiResponse;
    onInterestCalculationChanged: BehaviorSubject<any>;
    calculation: any;
    InterestTotalTnaAmount: number;
    InterestTotalInterestAmount: number;
    InterestInstallmentList: InstallmentEntity[];

    constructor(private http: HttpClient) {
        this.onInterestCalculationChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(): Observable<any> | Promise<any> | any {
        return new Promise<void>((resolve, reject) => {
            Promise.all([]).then(() => {
                resolve();
            }, reject);
        });
    }

    /**
     * calculation
     *
     * @param calculation
     * @returns {Promise<any>}
     */
    InterestCalculation(calculation): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http
                .post(
                    `${environment.apiUrl}/motion/utilityapi/v1.0/Utility/InterestCalculation`,
                    {
                        TnaAmount: calculation.TnaAmount,
                        InterestRate: calculation.InterestRate,
                        BsmvRate: calculation.BsmvRate,
                        KkdfRate: calculation.KkdfRate,
                        InstallCount: calculation.InstallCount,
                        TransactionDate: calculation.TransactionDate,
                        DueDate: calculation.DueDate,
                    }
                )
                .subscribe((response: any) => {
                    this.InterestTotalTnaAmount = response.TotalTnaAmount;
                    this.InterestTotalInterestAmount =
                        response.TotalInterestAmount;
                    this.InterestInstallmentList = response.InstallmentList;
                    this.calculation = resolve(response);
                }, reject);
        });
    }
}
