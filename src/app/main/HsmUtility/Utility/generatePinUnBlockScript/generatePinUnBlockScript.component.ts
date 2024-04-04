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
import { GeneratePinUnBlockScript } from "./generatePinUnBlockScript.model";
import { GeneratePinUnBlockScriptService } from "./generatePinUnBlockScript.service";

@Component({
    selector: "generatePinUnBlockScript",
    templateUrl: "./generatePinUnBlockScript.component.html",
    styleUrls: ["./generatePinUnBlockScript.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GeneratePinUnBlockScriptComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    generatePinUnBlockScript: GeneratePinUnBlockScript;
    pageType: string;
    visible: boolean = false;
    generatePinUnBlockScriptForm: FormGroup;
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
        private generatePinUnBlockScriptService: GeneratePinUnBlockScriptService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.generatePinUnBlockScriptService.onGeneratePinUnBlockScriptChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((generatePinUnBlockScript) => {
                this.generatePinUnBlockScript = new GeneratePinUnBlockScript(
                    generatePinUnBlockScript
                );
                this.generatePinUnBlockScriptForm =
                    this.createGeneratePinUnBlockScriptForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createGeneratePinUnBlockScriptForm
     *
     * @returns {FormGroup}
     */
    createGeneratePinUnBlockScriptForm(): FormGroup {
        return this._formBuilder.group({
            MacKeyUnderLmk: [this.generatePinUnBlockScript.MacKeyUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.generatePinUnBlockScript.HsmErrorCode],
            HsmErrorDescription: [
                this.generatePinUnBlockScript.HsmErrorDescription,
            ],
            PanSequenceNumber: [
                this.generatePinUnBlockScript.PanSequenceNumber,
            ],
            Atc: [this.generatePinUnBlockScript.Atc],
            Arqc: [this.generatePinUnBlockScript.Arqc],

            IssuerScript: [this.generatePinUnBlockScript.IssuerScript],
        });
    }

    formatCardNumber() {
        let cardNumber =
            this.generatePinUnBlockScriptForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.generatePinUnBlockScriptForm
            .get("CardNumber")
            .setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber =
            this.generatePinUnBlockScriptForm.get("CardNumber").value;

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
     * PinUnBlockScriptButton
     */
    PinUnBlockScriptButton(): void {
        const data = this.generatePinUnBlockScriptForm.getRawValue();
        this.generatePinUnBlockScriptService
            .GeneratePinUnBlockScript(data)
            .then(() => {
                this.hsmIssuerScript =
                    this.generatePinUnBlockScriptService.issuerScript;
                this.generateHsmErrorCode =
                    this.generatePinUnBlockScriptService.hsmErrorCode;
                this.generateHsmErrorDescription =
                    this.generatePinUnBlockScriptService.hsmErrorDescription;
            });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.generatePinUnBlockScriptForm.reset();
    }
}
