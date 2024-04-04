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
import { GeneratePinChangeScript } from "./generatePinChangeScript.model";
import { GeneratePinChangeScriptService } from "./generatePinChangeScript.service";

@Component({
    selector: "generatePinChangeScript",
    templateUrl: "./generatePinChangeScript.component.html",
    styleUrls: ["./generatePinChangeScript.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GeneratePinChangeScriptComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    generatePinChangeScript: GeneratePinChangeScript;
    pageType: string;
    visible: boolean = false;
    generatePinChangeScriptForm: FormGroup;
    hsmIssuerScript: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private generatePinChangeScriptService: GeneratePinChangeScriptService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.generatePinChangeScriptService.onGeneratePinChangeScriptChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((generatePinChangeScript) => {
                this.generatePinChangeScript = new GeneratePinChangeScript(
                    generatePinChangeScript
                );
                this.generatePinChangeScriptForm =
                    this.createGeneratePinChangeScriptForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createGeneratePinChangeScriptForm
     *
     * @returns {FormGroup}
     */
    createGeneratePinChangeScriptForm(): FormGroup {
        return this._formBuilder.group({
            AcUnderLmk: [this.generatePinChangeScript.AcUnderLmk],
            EncUnderLmk: [this.generatePinChangeScript.EncUnderLmk],
            MacKeyUnderLmk: [this.generatePinChangeScript.MacKeyUnderLmk],
            ZpkUnderLmk: [this.generatePinChangeScript.ZpkUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.generatePinChangeScript.HsmErrorCode],
            HsmErrorDescription: [
                this.generatePinChangeScript.HsmErrorDescription,
            ],
            PanSequenceNumber: [this.generatePinChangeScript.PanSequenceNumber],
            Atc: [this.generatePinChangeScript.Atc],
            Arqc: [this.generatePinChangeScript.Arqc],
            PinBlockFormat: [this.generatePinChangeScript.PinBlockFormat],
            PinBlock: [this.generatePinChangeScript.PinBlock],
            IssuerScript: [this.generatePinChangeScript.IssuerScript],
        });
    }

    formatCardNumber() {
        let cardNumber =
            this.generatePinChangeScriptForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.generatePinChangeScriptForm
            .get("CardNumber")
            .setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber =
            this.generatePinChangeScriptForm.get("CardNumber").value;

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
     * PinChangeScriptButton
     */
    PinChangeScriptButton(): void {
        const data = this.generatePinChangeScriptForm.getRawValue();
        this.generatePinChangeScriptService
            .GeneratePinChangeScript(data)
            .then(() => {
                this.hsmIssuerScript =
                    this.generatePinChangeScriptService.issuerScript;
                this.generateHsmErrorCode =
                    this.generatePinChangeScriptService.hsmErrorCode;
                this.generateHsmErrorDescription =
                    this.generatePinChangeScriptService.hsmErrorDescription;
            });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.generatePinChangeScriptForm.reset();
    }
}
