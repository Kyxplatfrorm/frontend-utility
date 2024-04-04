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
import { TranslatePinZpkToZpk2 } from "./translatePinZpkToZpk2.model";
import { TranslatePinZpkToZpk2Service } from "./translatePinZpkToZpk2.service";

@Component({
    selector: "translatePinZpkToZpk2",
    templateUrl: "./translatePinZpkToZpk2.component.html",
    styleUrls: ["./translatePinZpkToZpk2.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class TranslatePinZpkToZpk2Component implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    translatePinZpkToZpk2: TranslatePinZpkToZpk2;
    pageType: string;
    visible: boolean = false;
    translatePinZpkToZpk2Form: FormGroup;
    hsmLengthOfThePin: string;
    hsmPinUnderDestinationZpk: string;
    hsmDestinationPinBlockFormat: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private translatePinZpkToZpk2Service: TranslatePinZpkToZpk2Service,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.translatePinZpkToZpk2Service.onTranslatePinZpkToZpk2Changed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((translatePinZpkToZpk2) => {
                this.translatePinZpkToZpk2 = new TranslatePinZpkToZpk2(
                    translatePinZpkToZpk2
                );
                this.translatePinZpkToZpk2Form =
                    this.createTranslatePinZpkToZpk2Form();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createTranslatePinZpkToZpk2Form
     *
     * @returns {FormGroup}
     */
    createTranslatePinZpkToZpk2Form(): FormGroup {
        return this._formBuilder.group({
            SourceZpkUnderLmk: [this.translatePinZpkToZpk2.SourceZpkUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.translatePinZpkToZpk2.HsmErrorCode],
            HsmErrorDescription: [
                this.translatePinZpkToZpk2.HsmErrorDescription,
            ],
            SourcePinBlockFormat: [
                this.translatePinZpkToZpk2.SourcePinBlockFormat,
            ],
            PinUnderSourceZpk: [this.translatePinZpkToZpk2.PinUnderSourceZpk],
            DestinationZpkUnderLmk: [
                this.translatePinZpkToZpk2.DestinationZpkUnderLmk,
            ],

            DestinationPinBlockFormat: [
                this.translatePinZpkToZpk2.DestinationPinBlockFormat,
            ],
            MaksimumPinLength: [this.translatePinZpkToZpk2.MaksimumPinLength],
            LmkType: [this.translatePinZpkToZpk2.LmkType],
            LengthOfThePin: [this.translatePinZpkToZpk2.LengthOfThePin],
            PinUnderDestinationZpk: [
                this.translatePinZpkToZpk2.PinUnderDestinationZpk,
            ],
            LmkIdentifier: [this.translatePinZpkToZpk2.LmkIdentifier],
        });
    }

    formatCardNumber() {
        let cardNumber = this.translatePinZpkToZpk2Form.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.translatePinZpkToZpk2Form
            .get("CardNumber")
            .setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber =
            this.translatePinZpkToZpk2Form.get("CardNumber").value;

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
     * TranslatePinUnderZpkToZpk2Button
     */
    TranslatePinUnderZpkToZpk2Button(): void {
        const data = this.translatePinZpkToZpk2Form.getRawValue();
        this.translatePinZpkToZpk2Service
            .TranslatePinUnderZpkToZpk2(data)
            .then(() => {
                this.hsmDestinationPinBlockFormat =
                    this.translatePinZpkToZpk2Service.destinationPinBlockFormat;
                this.hsmLengthOfThePin =
                    this.translatePinZpkToZpk2Service.lengthOfThePin;
                this.hsmPinUnderDestinationZpk =
                    this.translatePinZpkToZpk2Service.pinUnderDestinationZpk;
                this.generateHsmErrorCode =
                    this.translatePinZpkToZpk2Service.hsmErrorCode;
                this.generateHsmErrorDescription =
                    this.translatePinZpkToZpk2Service.hsmErrorDescription;
            });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.translatePinZpkToZpk2Form.reset();
    }
}
