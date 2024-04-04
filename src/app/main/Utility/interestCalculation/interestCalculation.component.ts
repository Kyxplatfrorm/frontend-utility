import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { Subject, fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { InstallmentEntity } from "app/ui/utility";
import { Calculation } from "./interestCalculation.model";
import { InterestCalculationService } from "./interestCalculation.service";
import InterestCalculationDataSource from "./interestCalculation.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
    selector: "interestCalculation",
    templateUrl: "./interestCalculation.component.html",
    styleUrls: ["./interestCalculation.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class InterestCalculationComponent implements OnInit {
    interestCalculationDataSource: InterestCalculationDataSource | null;
    displayedColumns = [
        "InstallmentIndex",
        "InstallmentAmount",
        "CapitalAmount",
        "InterestAmount",
        "KkdfAmount",
        "BsmvAmount",
        "RemainingCapitalAmount",
        "InstallmentDate",
    ];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    calculation: Calculation;
    pageType: string;
    visible: boolean = false;
    interestCalculationForm: FormGroup;
    interestTotalTnaAmount: number;
    interestTotalInterestAmount: number;
    interestInstallmentList: InstallmentEntity[];
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true })
    interestCalculationPaginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    interestCalculationSort: MatSort;
    @ViewChild("filter", { static: true })
    filter: ElementRef;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private interestCalculationService: InterestCalculationService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.calculation = new Calculation();
        this._unsubscribeAll = new Subject();
        // this.calculation.BsmvRate = 0.1;
        // this.calculation.KkdfRate = 0.15;
    }

    ngOnInit(): void {
        this.interestCalculationDataSource = new InterestCalculationDataSource(
            this.interestCalculationService,
            this.interestCalculationPaginator,
            this.interestCalculationSort
        );
        this.interestCalculationService.onInterestCalculationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((calculation) => {
                this.calculation = new Calculation(calculation);
                this.interestCalculationForm =
                    this.createInterestCalculationForm();
            });
        fromEvent(this.filter.nativeElement, "keyup")
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.interestCalculationDataSource) {
                    return;
                }
                this.interestCalculationDataSource.filter =
                    this.filter.nativeElement.value;
            });
    }
    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     *  createInterestCalculationForm
     *
     * @returns {FormGroup}
     */
    createInterestCalculationForm(): FormGroup {
        return this._formBuilder.group({
            TnaAmount: [this.calculation.TnaAmount],
            InterestRate: [this.calculation.InterestRate],
            // BsmvRate: [this.calculation.BsmvRate],
            // KkdfRate: [this.calculation.KkdfRate],
            BsmvRate: [0.1],
            KkdfRate: [0.15],
            InstallCount: [this.calculation.InstallCount],
            TransactionDate: [this.calculation.TransactionDate],
            DueDate: [this.calculation.DueDate],
            TotalTnaAmount: [this.calculation.TotalTnaAmount],
            TotalInterestAmount: [this.calculation.TotalInterestAmount],
            InstallmentList: [this.calculation.InstallmentList],
        });
    }

    /**
     * CalculationButton
     */
    CalculationButton(): void {
        const data = this.interestCalculationForm.getRawValue();
        this.interestCalculationService.InterestCalculation(data).then(() => {
            this.interestCalculationService.onInterestCalculationChanged.next(
                data
            );
            this.interestTotalTnaAmount =
                this.interestCalculationService.InterestTotalTnaAmount;
            this.interestTotalInterestAmount =
                this.interestCalculationService.InterestTotalInterestAmount;
            this.interestInstallmentList =
                this.interestCalculationService.InterestInstallmentList;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.interestCalculationForm.reset();
        // this.interestCalculationService.InterestInstallmentList = [];
    }

    onTransactionDateChange(event: MatDatepickerInputEvent<Date>) {
        const selectedDate = new Date(event.value);
        const utcDate = new Date(
            Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds()
            )
        );
        this.calculation.TransactionDate = utcDate;
        const transactionDate = new Date(this.calculation.TransactionDate);
        const transactionDateString = transactionDate.toISOString();
    }
    onDueDateChange(event: MatDatepickerInputEvent<Date>) {
        const selectedDate = new Date(event.value);
        const utcDate = new Date(
            Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                selectedDate.getSeconds()
            )
        );
        this.calculation.DueDate = utcDate;
        const dueDate = new Date(this.calculation.DueDate);
        const dueDateString = dueDate.toISOString();
    }
}
