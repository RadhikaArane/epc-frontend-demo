import { Component, inject, OnDestroy, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators, } from "@angular/forms";
// import { LoginModel } from "../../../shared/models/auth";
import { AuthService } from "../../../shared/services/common/auth.service";
import { LoginResponseModel } from "../../../shared/models/common-models/apiResponseMasl";
import { ToastService } from "../../../shared/services/componentServices/toast.service";
import { ToastComponent } from "../../common/toast/toast.component";
import { SideBarService } from "../../../shared/services/common/sidebar.service";
import { Subject, Subscription, takeUntil } from "rxjs";
import { HttpEncSrvWrapperService } from "../../../shared/services/common/http-enc-srv-wrapper.service";
import { LoginModel } from "../../../shared/models/common-models/auth";
import { DataService } from "../../../shared/services/common/data.service";
import { authGuard } from "../../../shared/core/guards/auth.guard";
import { rolesBaseGuard } from "../../../shared/core/guards/roles-base.guard";
import { ROUTE_REGISTRY } from "../../../app.routes";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    ToastComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnDestroy {
  private authSrv = inject(AuthService);
  private dataSrv = inject(DataService);
  private sideBarSrv = inject(SideBarService);
  private router = inject(Router);
  private toastSrv = inject(ToastService);
  private httpWrapperSrv = inject(HttpEncSrvWrapperService)

  userDetails = signal<any>(null);
  isPasswordVisible = signal<boolean>(false);
  errorMessage = signal<string>("");

  // New signals & controls for Unrecognised User
  unrecognisedLoginStep = signal<number>(0);
  phoneControl = new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]{10}$')]);
  otpControl = new FormControl<string>('', [Validators.required, Validators.minLength(4)]);

  emailOrCodeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const codePattern = /^[A-Za-z0-9&]+$/;

    if (emailPattern.test(value)) {
      return null;
    }

    if (codePattern.test(value)) {
      return null;
    }

    return { emailOrCode: true };
  }

  loginForm = new FormGroup({
    email: new FormControl<string>("", [Validators.required, this.emailOrCodeValidator.bind(this)]),
    password: new FormControl<string>("", [Validators.required]),
  });

  private destroy$ = new Subject<void>();

  constructor() { }

  togglePassword(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  loading: boolean = false;

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.showError("Please enter valid data");
      return;
    }

    const loginObj: LoginModel = {
      employeeId: this.loginForm.value.email ?? "",
      password: this.loginForm.value.password ?? "",
    };

    this.authSrv._loginUser(loginObj).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: LoginResponseModel) => {
        this.userDetails.set(res.data);
        this.loginForm.reset();
        //this.handleNavigation(res.data.RoleName, res.data.ProjectTypeName);
        this.registerRoutesAndNavigate(
        res.data.ProjectTypeName,
        res.data.RoleId,
        res.data.ProjectTypeId
      );
      },
      error: (err: any) => {
        this.showError(err?.message || "An unknown error occurred");
      },
    });
  }

  private registerRoutesAndNavigate(
  projectTypeName: string,
  roleId: number,
  projectTypeId: number
): void {
  this.sideBarSrv.getSidebarMenus(roleId, projectTypeId).subscribe({
    next: (res: any) => {
      const list = Array.isArray(res) ? res : (res?.Data ?? res?.data ?? []);

      const permittedPaths = new Set<string>();
      list.forEach((section: any) => {
        (section.menu || []).forEach((menuItem: any) => {
          if (menuItem.route) permittedPaths.add(menuItem.route);
          (menuItem.subMenus || []).forEach((sub: any) => {
            if (sub.route) permittedPaths.add(sub.route);
          });
        });
      });

      const dynamicChildren = [...permittedPaths]
        .filter(path => !!ROUTE_REGISTRY[path])
        .map(path => ({
          path,
          component: ROUTE_REGISTRY[path],
          canActivate: [authGuard, rolesBaseGuard],
          data: { projectTypeName: [projectTypeName] }
        }));

      // ✅ ADD THIS: sidebar lo raani but dashboard nunchi navigate avye extra routes
      const dashboardSubPages: string[] = [
        'scrAPComponent', 'scrCGComponent', 'scrGJComponent',
        'scrKAHComponent', 'scrKAKComponent', 'scrMPComponent',
        'scrTNComponent', 'scrTGComponent', 'scrUPComponent', 'scrWBComponent'
      ];

      dashboardSubPages.forEach(path => {
        if (ROUTE_REGISTRY[path] && !dynamicChildren.find(r => r.path === path)) {
          dynamicChildren.push({
            path,
            component: ROUTE_REGISTRY[path],
            canActivate: [authGuard, rolesBaseGuard],
            data: { projectTypeName: [projectTypeName] }
          });
        }
      });

      const updatedRoutes = this.router.config.map(r =>
        r.path === '' && r.component !== undefined
          ? { ...r, children: dynamicChildren }
          : r
      );
      this.router.resetConfig(updatedRoutes);

      console.log(`✅ ${dynamicChildren.length} routes registered`);

      const dashboardRouteMap: Record<string, string> = {
        'Scrapper':             '/scrDashboardComponent',
        'Trade Receivable':     '/trManagerDashboardComponent',
        'Unrecognised Invoice': '/drdashboardcomponent',
        'Project Business':     '/pbDashboardComponent',
        'Fixed Asset':          '/faDashboardComponent',
      };

      const targetRoute = dashboardRouteMap[projectTypeName];
      if (targetRoute) {
        this.router.navigateByUrl(targetRoute);
      } else {
        this.showError('Project type not supported');
      }
    },
    error: (err: any) => {
      this.showError('Failed to load menu');
    }
  });
}

  // New Methods for Unrecognised User flow
  requestOtp(): void {
    if (this.phoneControl.valid) {
      this.toastSrv.showToast(`OTP sent successfully to ${this.phoneControl.value}`, "success");
      this.unrecognisedLoginStep.set(2);
    } else {
      this.showError("Please enter a valid 10-digit phone number");
    }
  }

  verifyOtp(): void {
    if (this.otpControl.valid) {
      this.toastSrv.showToast("OTP verified successfully!", "success");
      
      // Reset forms and state
      this.unrecognisedLoginStep.set(0);
      this.phoneControl.reset();
      this.otpControl.reset();
      
      // Static navigation logic for unrecognised user
      this.router.navigateByUrl('drdashboardcomponent');
    } else {
      this.showError("Please enter a valid OTP");
    }
  }

  private handleNavigation(roleName: string, projectTypeName: string): void {
    if (!projectTypeName) {
      this.showError("Invalid project type");
      return;
    }

    console.log('Role:', roleName);
    console.log('Project:', projectTypeName);

    switch (projectTypeName) {
      case "Unrecognised Invoice":
        this.router.navigateByUrl('drdashboardcomponent');
        break;
      case "Trade Receivable":
        this.router.navigateByUrl('trManagerDashboardComponent');
        break;
      case "Scrapper":
        this.router.navigateByUrl('scrDashboardComponent');
        break;
      case "Project Business":
        this.router.navigateByUrl('pbDashboardComponent');
        break;
      case "Fixed Asset":
        this.router.navigateByUrl('faDashboardComponent');
        break;
      default:
        this.showError("Project type not supported");
    }
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.toastSrv.showToast(this.errorMessage(), "error");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}