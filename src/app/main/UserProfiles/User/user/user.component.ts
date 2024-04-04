import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fromEvent, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { locale as english } from "./i18n/en";
import { locale as turkish } from "./i18n/tr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { User } from "../users/users.model";
import UpdateAlertUser from "./updateUser";
import { UserService } from "./user.service";
import { TenantDefinitionEntity } from "app/ui/tenant";
import {
    CustomerTypeEntity,
    LoginMethodTypeEntity,
    TwoFormFactorAuthTypeEntity,
    UserStatusEntity,
    UserTypeEntity,
} from "app/ui/userDefinition";
import { SearchUserService } from "../searchUser/searchUser.service";
import { UserProfileEntity } from "app/ui/userProfiles";
import { RoleEntity } from "app/ui/roleDefinition";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { UserNewService } from "../userNew/userNew.service";
import { UsersService } from "../users/users.service";
import SearchUserDataSource from "../searchUser/searchUser.datasource";

@Component({
    selector: "user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UserComponent implements OnInit, OnDestroy {
    searchUserDataSource: SearchUserDataSource | null;
    dialogRef: any;
    user: User;
    pageType: string;
    userForm: FormGroup;
    userStatusList: UserStatusEntity[];
    userTypeList: UserTypeEntity[];
    tenantList: TenantDefinitionEntity[];
    customerTypeList: CustomerTypeEntity[];
    userProfileList: UserProfileEntity[];
    loginMethodType: LoginMethodTypeEntity[];
    twoFormFactorAuthType: TwoFormFactorAuthTypeEntity[];
    selectedRoleList: number[];
    roleList: RoleEntity[];
    permittedIpAddressList: string[] = [];
    datePasswordResetDate: Date = new Date();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    private _unsubscribeAll: Subject<any>;
    @ViewChild(MatPaginator, { static: true })
    userPaginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    userSort: MatSort;
    @ViewChild("filter", { static: true })
    filter: ElementRef;
    routeParams: any;
    userTypeId: number;
    @ViewChild(MatPaginator, { static: true })
    searchUserPaginator: MatPaginator;
    @ViewChild(MatSort, { static: true })
    searchUserSort: MatSort;

    /**
     * Constructor
     *
     *
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private userService: UserService,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router: Router,
        private updateAlertUser: UpdateAlertUser,
        private cdr: ChangeDetectorRef,
        private searchUserService: SearchUserService,
        private usersService: UsersService,
        private userNewService: UserNewService,
        _router: ActivatedRoute
    ) {
        this._fuseTranslationLoaderService.loadTranslations(english, turkish);
        this.user = new User();
        this._unsubscribeAll = new Subject();
        this.routeParams = _router.snapshot.params;
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.usersService.GetUserStatus().then(() => {
            this.userStatusList =
                this.usersService.userStatusResponse.ParameterList;
        });
        this.usersService.GetUserTypes().then(() => {
            this.userTypeList =
                this.usersService.userTypeResponse.ParameterList;
        });
        this.usersService.GetTenants().then(() => {
            this.tenantList =
                this.usersService.tenantDefApiResponse.TenantDefinitionList;
        });
        this.usersService.GetCustomerType().then(() => {
            this.customerTypeList =
                this.usersService.customerTypeResponse.ParameterList;
        });
        this.usersService.GetLoginMethodType().then(() => {
            this.loginMethodType =
                this.usersService.loginMethodTypeApiResponse.ParameterList;
        });
        this.usersService.GetTwoFormFactorAuthType().then(() => {
            this.twoFormFactorAuthType =
                this.usersService.twoFormFactorAuthTypeApiResponse.ParameterList;
        });
        this.usersService.GetUserProfiles().then(() => {
            this.userProfileList =
                this.usersService.userProfilesApiResponse.UserProfileList;
        });

        this.userService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user) => {
                this.user = new User(user);
                this.pageType = "edit";
                this.userService.selectedRoleList = user.SelectedRoleList;
                if (this.user.PermittedIpAddressList != undefined) {
                    this.user.PermittedIpAddressList.forEach((ipAddress) => {
                        this.addIpAddress(ipAddress);
                    });
                }
                if (this.pageType === "edit" && this.user.UserTypeId) {
                    this.userNewService
                        .GetRoles(this.user.UserTypeId)
                        .then((response) => {
                            this.roleList = response.RoleList;
                            this.selectSelectedRoles();
                        });
                }
                this.userForm = this.createUserForm();
            });
    }

    addIpAddress(ipAddress: string): void {
        if (ipAddress && ipAddress.trim() !== "") {
            const cleanedIpAddress = ipAddress.trim();
            if (!this.permittedIpAddressList.includes(cleanedIpAddress)) {
                this.permittedIpAddressList.push(cleanedIpAddress);
            }
        }
    }

    clearIpAddress(index: number): void {
        if (index >= 0 && index < this.permittedIpAddressList.length) {
            this.permittedIpAddressList.splice(index, 1);
        }
    }

    formatIpAddress(event: any): void {
        const inputElement = event.target;
        let inputValue = inputElement.value.replace(/[^\d.]/g, "");
        inputValue = inputValue.substring(0, 15);
        const segments = inputValue.split(".");
        inputValue = segments
            .map((segment) => {
                if (segment.length > 3) {
                    return segment.substring(0, 3);
                }
                return segment;
            })
            .join(".");

        inputElement.value = inputValue;
        this.userForm.patchValue({ IpAddress: inputValue });
    }

    selectSelectedRoles() {
        if (this.roleList != undefined) {
            for (let i = 0; i < this.roleList.length; i++) {
                var isSelectedRole = this.userService.selectedRoleList?.filter(
                    (x) => x == this.roleList[i].Id
                );

                if (isSelectedRole != undefined && isSelectedRole.length > 0) {
                    this.roleList[i].IsChecked = true;
                }
            }
        }
    }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * createUserForm
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        return this._formBuilder.group({
            Id: [this.user.Id],
            UserTypeId: [this.user.UserTypeId],
            UserName: [this.user.UserName],
            UserFullName: [this.user.UserFullName],
            HasApiKey: [this.user.HasApiKey],
            WrongAttemptCount: [this.user.WrongAttemptCount],
            UserStatusId: [this.user.UserStatusId],
            TenantId: [this.user.TenantId],
            CustomerTypeId: [this.user.CustomerTypeId],
            CustomerId: [this.user.CustomerId],
            UtcTimeOffset: [this.user.UtcTimeOffset],
            UserProfileId: [this.user.UserProfileId],
            MustChangePwd: [this.user.MustChangePwd],
            PasswordResetDateTime: [this.user.PasswordResetDateTime],
            CheckIp: [this.user.CheckIp],
            Email: [this.user.Email],
            InternationalPhoneCode: [this.user.InternationalPhoneCode],
            PhoneNumber: [this.user.PhoneNumber],
            SelectedRoleList: [this.user.SelectedRoleList],
            HasIpRestriction: [this.user.HasIpRestriction],
            PermittedIpAddressList: [this.user.PermittedIpAddressList],
            IpAddress: [this.user.IpAddress],
            CompanyId: [this.user.CompanyId],
            LoginMethodTypeId: [this.user.LoginMethodTypeId],
            ForceTwoFormFactorAuth: [this.user.ForceTwoFormFactorAuth],
            TwoFormFactorAuthTypeId: [this.user.TwoFormFactorAuthTypeId],
        });
    }

    refreshSearchUserDataSource(): void {
        this.searchUserDataSource = new SearchUserDataSource(
            this.searchUserService,
            this.searchUserPaginator,
            this.searchUserSort
        );
    }

    /**
     * UpdateUser
     */
    UpdateUser(): void {
        const data = this.userForm.getRawValue();
        data.SelectedRoleList = data.SelectedRoleList;
        data.PermittedIpAddressList = this.permittedIpAddressList;
        this.userService.UpdateUser(data).then(() => {
            this.userService.onUserChanged.next(data);
            this.searchUserService.SearchUser(this.user).then(() => {
                this.refreshSearchUserDataSource();
            });
            this.router.navigate(["UserProfiles/User/searchUser"]);
            this.updateAlertUser.UpdateAlertUserShow();
        });
    }

    UpdateSelectedRoles(event: MatCheckboxChange, Id: number): void {
        if (!this.user.SelectedRoleList) {
            this.user.SelectedRoleList = [];
        }

        if (event.checked) {
            this.user.SelectedRoleList.push(Id);
        } else {
            const index = this.user.SelectedRoleList.indexOf(Id);
            if (index > -1) {
                this.user.SelectedRoleList.splice(index, 1);
            }
        }
    }
}
