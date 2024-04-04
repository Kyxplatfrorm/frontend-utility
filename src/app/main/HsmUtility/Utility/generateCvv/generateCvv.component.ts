import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AlertSnackBar } from "app/_helpers/AlertSnackbar";
import { GenerateCvv } from "./generateCvv.model";
import { GenerateCvvService } from "./generateCvv.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
    selector: "generateCvv",
    templateUrl: "./generateCvv.component.html",
    styleUrls: ["./generateCvv.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GenerateCvvComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    generateCvv: GenerateCvv;
    pageType: string;
    visible: boolean = false;
    genereateCvvForm: FormGroup;
    cvv: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private generateCvvService: GenerateCvvService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.generateCvvService.onGenerateCvvChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((generateCvv) => {
                this.generateCvv = new GenerateCvv(generateCvv);
                this.genereateCvvForm = this.createGenerateCvvForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createGenerateCvvForm
     *
     * @returns {FormGroup}
     */
    createGenerateCvvForm(): FormGroup {
        return this._formBuilder.group({
            CvvKey: [this.generateCvv.CvvKey],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            ExpiryDateYYMM: [this.generateCvv.ExpiryDateYYMM],
            ServiceCode: [this.generateCvv.ServiceCode],
            HsmErrorCode: [this.generateCvv.HsmErrorCode],
            HsmErrorDescription: [this.generateCvv.HsmErrorDescription],
            Cvv: [this.generateCvv.Cvv],
        });
    }

    formatCardNumber() {
        let cardNumber = this.genereateCvvForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.genereateCvvForm.get("CardNumber").setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber = this.genereateCvvForm.get("CardNumber").value;

        if (/^4/.test(cardNumber)) {
            return visaIconPath;
        } else if (/^5/.test(cardNumber)) {
            return mastercardIconPath;
        } else if (/^6/.test(cardNumber)) {
            return troycardIconPath;
        }
        return "";
    }

    GenerateCvvButton(): void {
        const data = this.genereateCvvForm.getRawValue();
        this.generateCvvService.GenerateCvv(data).then(() => {
            this.cvv = this.generateCvvService.generateHsmCvv;
            this.generateHsmErrorCode = this.generateCvvService.hsmErrorCode;
            this.generateHsmErrorDescription =
                this.generateCvvService.hsmErrorDescription;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.genereateCvvForm.reset();
    }
}
