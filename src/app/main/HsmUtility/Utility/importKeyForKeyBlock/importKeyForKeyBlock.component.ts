import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AlertSnackBar } from "app/_helpers/AlertSnackbar";
import { ImportKey } from "./importKeyForKeyBlock.model";
import { ImportKeyForKeyBlockService } from "./importKeyForKeyBlock.service";

@Component({
    selector: "importKeyForKeyBlock",
    templateUrl: "./importKeyForKeyBlock.component.html",
    styleUrls: ["./importKeyForKeyBlock.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ImportKeyForKeyBlockComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    form: FormGroup;
    importKey: ImportKey;
    pageType: string;
    visible: boolean = false;
    importKeyForKeyBlockForm: FormGroup;
    hsmKeyUnderLmk: string;
    hsmKeyKcv: string;
    generateHsmErrorCode: string;
    generateHsmErrorDescription: string;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */

    constructor(
        private importKeyForKeyBlockService: ImportKeyForKeyBlockService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _formBuilder: FormBuilder,
        private alertMessage: AlertSnackBar
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.importKeyForKeyBlockService.onImportKeyForKeyBlockChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((importKey) => {
                this.importKey = new ImportKey(importKey);
                this.importKeyForKeyBlockForm =
                    this.createImportKeyForKeyBlockForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     *  createImportKeyForKeyBlockForm
     *
     * @returns {FormGroup}
     */
    createImportKeyForKeyBlockForm(): FormGroup {
        return this._formBuilder.group({
            KeyUsage: [this.importKey.KeyUsage],
            ZmkUnderLmk: [this.importKey.ZmkUnderLmk],
            KeyUnderZmk: [this.importKey.KeyUnderZmk],
            KeyUnderLmk: [this.importKey.KeyUnderLmk],
            HsmErrorCode: [this.importKey.HsmErrorCode],
            HsmErrorDescription: [this.importKey.HsmErrorDescription],
            KeyKcv: [this.importKey.KeyKcv],
        });
    }

    /**
     * ImportKeyForKeyBlockButton
     */
    ImportKeyForKeyBlockButton(): void {
        const data = this.importKeyForKeyBlockForm.getRawValue();
        this.importKeyForKeyBlockService.ImportKeyForKeyBlock(data).then(() => {
            this.importKeyForKeyBlockService.onImportKeyForKeyBlockChanged.next(
                data
            );
            this.hsmKeyUnderLmk = this.importKeyForKeyBlockService.keyUnderLmk;
            this.generateHsmErrorCode =
                this.importKeyForKeyBlockService.hsmErrorCode;
            this.generateHsmErrorDescription =
                this.importKeyForKeyBlockService.hsmErrorDescription;
            this.hsmKeyKcv = this.importKeyForKeyBlockService.keyKcv;
        });
    }

    /**
     * ClearButton
     */
    ClearButton(): void {
        this.importKeyForKeyBlockForm.reset();
    }
}
