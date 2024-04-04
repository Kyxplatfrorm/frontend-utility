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
import { GeneratePinLmk } from "./generatePinLmk.model";
import { GeneratePinLmkService } from "./generatePinLmk.service";

@Component({
    selector: "generatePinLmk",
    templateUrl: "./generatePinLmk.component.html",
    styleUrls: ["./generatePinLmk.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GeneratePinLmkComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    generatePinLmk: GeneratePinLmk;
    pageType: string;
    visible: boolean = false;
    generatePinLmkForm: FormGroup;
    hsmPinLmk: number;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    generateEncryptedPin: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private generatePinLmkService: GeneratePinLmkService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.generatePinLmkService.onGeneratePinLmkChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((generatePinLmk) => {
                this.generatePinLmk = new GeneratePinLmk(generatePinLmk);
                this.generatePinLmkForm = this.createGeneratePinLmkForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createGeneratePinLmkForm
     *
     * @returns {FormGroup}
     */
    createGeneratePinLmkForm(): FormGroup {
        return this._formBuilder.group({
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            LmkIdentifier: [this.generatePinLmk.LmkIdentifier],
            LmkType: [this.generatePinLmk.LmkType],
            PinLmk: [this.generatePinLmk.PinLmk],
            HsmErrorCode: [this.generatePinLmk.HsmErrorCode],
            HsmErrorDescription: [this.generatePinLmk.HsmErrorDescription],
            PinLength: [this.generatePinLmk.PinLength],
            EncryptedPin: [this.generatePinLmk.EncryptedPin],
        });
    }

    formatCardNumber() {
        let cardNumber = this.generatePinLmkForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.generatePinLmkForm.get("CardNumber").setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber = this.generatePinLmkForm.get("CardNumber").value;

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
     * PinLmkButton
     */
    PinLmkButton(): void {
        const data = this.generatePinLmkForm.getRawValue();
        this.generatePinLmkService.GeneratePinLmk(data).then(() => {
            this.hsmPinLmk = this.generatePinLmkService.pinLmk;
            this.generateHsmErrorCode = this.generatePinLmkService.hsmErrorCode;
            this.generateHsmErrorDescription =
                this.generatePinLmkService.hsmErrorDescription;
            this.generateEncryptedPin = this.generatePinLmkService.encryptedPin;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.generatePinLmkForm.reset();
    }
}
