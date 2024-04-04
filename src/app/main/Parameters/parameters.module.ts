import { ApplicationModule, NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseWidgetModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { TenantDefinitionsModule } from "./TenantDefinitions/tenantDefinitions/tenantDefinitions.module";
import { TenantDetailModule } from "./TenantDefinitions/tenantDetail/tenantDetail.module";

@NgModule({
    imports: [
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        TenantDefinitionsModule,
        TenantDetailModule,
    ],
})
export class ParametersModule {}
