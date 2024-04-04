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
import { TranslatePinZpkToLmk } from "./translatePinZpkToLmk.model";
import { TranslatePinZpkToLmkService } from "./translatePinZpkToLmk.service";

@Component({
    selector: "translatePinZpkToLmk",
    templateUrl: "./translatePinZpkToLmk.component.html",
    styleUrls: ["./translatePinZpkToLmk.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class TranslatePinZpkToLmkComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    translatePinZpkToLmk: TranslatePinZpkToLmk;
    pageType: string;
    visible: boolean = false;
    translatePinZpkToLmkForm: FormGroup;
    hsmPinLmk: number;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private translatePinZpkToLmkService: TranslatePinZpkToLmkService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.translatePinZpkToLmkService.onTranslatePinZpkToLmkChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((translatePinZpkToLmk) => {
                this.translatePinZpkToLmk = new TranslatePinZpkToLmk(
                    translatePinZpkToLmk
                );
                this.translatePinZpkToLmkForm =
                    this.createTranslatePinZpkToLmkForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createTranslatePinZpkToLmkForm
     *
     * @returns {FormGroup}
     */
    createTranslatePinZpkToLmkForm(): FormGroup {
        return this._formBuilder.group({
            ZpkUnderLmk: [this.translatePinZpkToLmk.ZpkUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.translatePinZpkToLmk.HsmErrorCode],
            HsmErrorDescription: [
                this.translatePinZpkToLmk.HsmErrorDescription,
            ],
            PinLmk: [this.translatePinZpkToLmk.PinLmk],
            PinBlockFormat: [this.translatePinZpkToLmk.PinBlockFormat],
            PinUnderZpk: [this.translatePinZpkToLmk.PinUnderZpk],
        });
    }

    formatCardNumber() {
        let cardNumber = this.translatePinZpkToLmkForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.translatePinZpkToLmkForm
            .get("CardNumber")
            .setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber =
            this.translatePinZpkToLmkForm.get("CardNumber").value;

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
     * TranslatePinUnderZpk2LmkButton
     */
    TranslatePinUnderZpk2LmkButton(): void {
        const data = this.translatePinZpkToLmkForm.getRawValue();
        this.translatePinZpkToLmkService
            .TranslatePinUnderZpk2Lmk(data)
            .then(() => {
                this.hsmPinLmk = this.translatePinZpkToLmkService.pinLmk;
                this.generateHsmErrorCode =
                    this.translatePinZpkToLmkService.hsmErrorCode;
                this.generateHsmErrorDescription =
                    this.translatePinZpkToLmkService.hsmErrorDescription;
            });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.translatePinZpkToLmkForm.reset();
    }
}
