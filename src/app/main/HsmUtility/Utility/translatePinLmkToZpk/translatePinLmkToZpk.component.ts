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
import { TranslatePinLmkToZpk } from "./translatePinLmkToZpk.model";
import { TranslatePinLmkToZpkService } from "./translatePinLmkToZpk.service";

@Component({
    selector: "translatePinLmkToZpk",
    templateUrl: "./translatePinLmkToZpk.component.html",
    styleUrls: ["./translatePinLmkToZpk.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class TranslatePinLmkToZpkComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    translatePinLmkToZpk: TranslatePinLmkToZpk;
    pageType: string;
    visible: boolean = false;
    translatePinLmkToZpkForm: FormGroup;
    hsmPinUnderZpk: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private translatePinLmkToZpkService: TranslatePinLmkToZpkService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.translatePinLmkToZpkService.onTranslatePinLmkToZpkChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((translatePinLmkToZpk) => {
                this.translatePinLmkToZpk = new TranslatePinLmkToZpk(
                    translatePinLmkToZpk
                );
                this.translatePinLmkToZpkForm =
                    this.createTranslatePinLmkToZpkForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createTranslatePinLmkToZpkForm
     *
     * @returns {FormGroup}
     */
    createTranslatePinLmkToZpkForm(): FormGroup {
        return this._formBuilder.group({
            ZpkUnderLmk: [this.translatePinLmkToZpk.ZpkUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.translatePinLmkToZpk.HsmErrorCode],
            HsmErrorDescription: [
                this.translatePinLmkToZpk.HsmErrorDescription,
            ],
            PinLmk: [this.translatePinLmkToZpk.PinLmk],
            PinBlockFormat: [this.translatePinLmkToZpk.PinBlockFormat],
            PinUnderZpk: [this.translatePinLmkToZpk.PinUnderZpk],
            LmkIdentifier: [this.translatePinLmkToZpk.LmkIdentifier],
        });
    }

    formatCardNumber() {
        let cardNumber = this.translatePinLmkToZpkForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.translatePinLmkToZpkForm
            .get("CardNumber")
            .setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber =
            this.translatePinLmkToZpkForm.get("CardNumber").value;

        if (/^4/.test(cardNumber)) {
            return visaIconPath;
        } else if (/^5/.test(cardNumber)) {
            return mastercardIconPath;
        } else if (/^6/.test(cardNumber)) {
            return troycardIconPath;
        }
        return "";
    }

    /**
     * TranslatePinLmk2Zpk
     */
    TranslatePinLmk2ZpkButton(): void {
        const data = this.translatePinLmkToZpkForm.getRawValue();
        this.translatePinLmkToZpkService.TranslatePinLmk2Zpk(data).then(() => {
            this.hsmPinUnderZpk = this.translatePinLmkToZpkService.pinUnderZpk;
            this.generateHsmErrorCode =
                this.translatePinLmkToZpkService.hsmErrorCode;
            this.generateHsmErrorDescription =
                this.translatePinLmkToZpkService.hsmErrorDescription;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.translatePinLmkToZpkForm.reset();
    }
}
