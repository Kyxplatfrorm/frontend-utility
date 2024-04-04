import { APP_INITIALIZER, inject, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
    HttpClient,
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { JwtInterceptor, ErrorInterceptor, AuthGuard } from "./_helpers";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,
} from "@fuse/components";
import { fuseConfig } from "app/fuse-config";
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";
import { SampleModule } from "app/main/sample/sample.module";
import { DashboardsModule } from "app/main/dashboards/dashboards.module";
import { AuthenticationService } from "@fuse/services";
import { ParametersModule } from "./main/Parameters/parameters.module";
import { ReactiveFormsModule } from "@angular/forms";
import { UserDetailModule } from "./main/UserProfiles/userProfileDetail/userProfileDetail.module";
import { AlertSnackBar } from "./_helpers/AlertSnackbar";
import { environment } from "environments/environment";
import { SettingsService } from "./settings.service";
import { tap } from "rxjs/operators";
import { HsmUtilityModule } from "./main/HsmUtility/hsmUtility.module";
import { UtilityModule } from "app/main/Utility/utility.module";
import { PasswordChangeModule } from "./main/Password/PasswordChange/passwordChange/passwordChange.module";
import { UserProfileModule } from "app/main/UserProfiles/userProfile.module";

const appRoutes: Routes = [
    {
        path: "main/dashboards",
        loadChildren: () =>
            import("app/main/dashboards/dashboards.module").then(
                (m) => m.DashboardsModule
            ),
    },
    {
        path: "Parameters",
        loadChildren: () =>
            import("app/main/Parameters/parameters.module").then(
                (m) => m.ParametersModule
            ),
    },
    {
        path: "UserProfiles",
        loadChildren: () =>
            import("app/main/UserProfiles/userProfile.module").then(
                (m) => m.UserProfileModule
            ),
    },

    {
        path: "Utility",
        loadChildren: () =>
            import("app/main/Utility/utility.module").then(
                (m) => m.UtilityModule
            ),
    },

    {
        path: "HsmUtility",
        loadChildren: () =>
            import("app/main/HsmUtility/hsmUtility.module").then(
                (m) => m.HsmUtilityModule
            ),
    },

    {
        path: "**",
        redirectTo: "auth/login",
        pathMatch: "full",
    },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" }),
        TranslateModule.forRoot(),
        MatMomentDateModule,
        MatButtonModule,
        MatIconModule,
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        LayoutModule,
        SampleModule,
        DashboardsModule,
        ParametersModule,
        UserProfileModule,
        UserDetailModule,
        UtilityModule,
        HsmUtilityModule,
        PasswordChangeModule,
    ],
    providers: [
        AuthenticationService,
        AlertSnackBar,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: APP_INITIALIZER,
            useFactory: (
                http: HttpClient,
                settingsService: SettingsService
            ) => {
                return () =>
                    new Promise<void>((resolve) => {
                        http.get("/assets/config.json")
                            .pipe(
                                tap((data: any) => {
                                    settingsService.ApiUrl = data.ApiUrl;
                                    environment.apiUrl = data.ApiUrl;
                                })
                            )
                            .subscribe(() => {
                                resolve();
                            });
                    });
            },
            multi: true,
            deps: [HttpClient, SettingsService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
