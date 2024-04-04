import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseConfirmDialogModule,
    FuseSidebarModule,
    FuseWidgetModule,
} from "@fuse/components";
import { TranslateModule } from "@ngx-translate/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TranslateKeyFromOldLmkToNewLmkComponent } from "./translateKeyFromOldLmkToNewLmk.component";
import { TranslateKeyFromOldLmkToNewLmkService } from "./translateKeyFromOldLmkToNewLmk.service";

const routes = [
    {
        path: "HsmUtility/Utility/translateKeyFromOldLmkToNewLmk",
        component: TranslateKeyFromOldLmkToNewLmkComponent,
        resolve: {
            data: TranslateKeyFromOldLmkToNewLmkService,
        },
    },
];

@NgModule({
    declarations: [TranslateKeyFromOldLmkToNewLmkComponent],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        TranslateModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        NgxDatatableModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatMenuModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTabsModule,
        MatToolbarModule,
        FuseConfirmDialogModule,
        NgxChartsModule,
        MatDatepickerModule,
        FuseSidebarModule,
        MatMomentDateModule,
    ],
    providers: [TranslateKeyFromOldLmkToNewLmkService],
})
export class TranslateKeyFromOldLmkToNewLmkModule {}