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
import { GeneratePvv } from "./generatePvv.model";
import { GeneratePvvService } from "./generatePvv.service";

@Component({
    selector: "generatePvv",
    templateUrl: "./generatePvv.component.html",
    styleUrls: ["./generatePvv.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GeneratePvvComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    generatePvv: GeneratePvv;
    pageType: string;
    visible: boolean = false;
    generatePvvForm: FormGroup;
    hsmPvv: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private generatePvvService: GeneratePvvService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.generatePvvService.onGeneratePvvChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((generatePvv) => {
                this.generatePvv = new GeneratePvv(generatePvv);
                this.generatePvvForm = this.createGeneratePvvForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createGeneratePvvForm
     *
     * @returns {FormGroup}
     */
    createGeneratePvvForm(): FormGroup {
        return this._formBuilder.group({
            PinUnderLmk: [this.generatePvv.PinUnderLmk],
            CardNumber: [
                "",
                [
                    Validators.pattern("^\\d{4}( \\d{4}){3}$"),
                    Validators.maxLength(19),
                ],
            ],
            HsmErrorCode: [this.generatePvv.HsmErrorCode],
            HsmErrorDescription: [this.generatePvv.HsmErrorDescription],
            PvvKeyIndex: [this.generatePvv.PvvKeyIndex],
            PvvKey: [this.generatePvv.PvvKey],
            Pvv: [this.generatePvv.Pvv],
        });
    }

    formatCardNumber() {
        let cardNumber = this.generatePvvForm.get("CardNumber").value;
        cardNumber = cardNumber.replace(/\D/g, "");
        cardNumber = cardNumber.slice(0, 16);
        const groups = cardNumber.match(/\d{1,4}/g);
        const formattedCardNumber = groups ? groups.join(" ") : "";
        this.generatePvvForm.get("CardNumber").setValue(formattedCardNumber);
    }

    getCardTypeIcon(): string {
        const visaIconPath = "assets/img/examples/Visa.png";
        const mastercardIconPath = "assets/img/examples/Mastercard.png";
        const troycardIconPath = "assets/img/examples/Troy.jpg";
        const cardNumber = this.generatePvvForm.get("CardNumber").value;

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
     * GeneratePvvButton
     */
    GeneratePvvButton(): void {
        const data = this.generatePvvForm.getRawValue();
        this.generatePvvService.GeneratePvv(data).then(() => {
            this.hsmPvv = this.generatePvvService.pvv;
            this.generateHsmErrorCode = this.generatePvvService.hsmErrorCode;
            this.generateHsmErrorDescription =
                this.generatePvvService.hsmErrorDescription;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.generatePvvForm.reset();
    }
}
