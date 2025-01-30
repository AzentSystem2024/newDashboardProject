import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  DxLoadIndicatorModule,
  DxButtonModule,
  DxTextBoxModule,
  DxFormModule,
  DxLoadPanelModule,
} from 'devextreme-angular';
import { DxoValidationModule } from 'devextreme-angular/ui/nested';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services';
import notify from 'devextreme/ui/notify';
import { firstValueFrom } from 'rxjs';
import { ReuseStrategyService } from 'src/app/State-Management/reuse-strategy.service';
import { CustomReuseStrategy } from 'src/app/State-Management/custom-reuse-strategy';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginpage = {
    UserName: null,
    Password: null,
  };
  loadingVisible: boolean = false;
  constructor(
    private formb: FormBuilder,
    private router: Router,
    private service: DataService,
    private reuseStrategy: CustomReuseStrategy
  ) {
    this.service.setHeaderDivFalse();
  }

  Login() {
    // this.loadingVisible = true;
    var userName = this.loginpage.UserName;
    var Password = this.loginpage.Password;
    if (userName && Password) {
      this.service
        .dashboard_Login(userName, Password)
        .subscribe((response: any) => {
          if (response.flag == '1') {
            notify(`${response.message}`, 'success', 3000);
            let userId = response.userid;
            sessionStorage.setItem('paramsid', userId);
            this.service.setHeaderDivTrue();
            setTimeout(() => {
              // this.loadingVisible = false; // Ensure loading is hidden before navigation
              this.router.navigate(['/Main-Dashboard']);
            }, 500);
          } else {
            notify(`${response.message}`, 'error', 3000);
          }
        });
    } else {
      alert('please fill all the fields');
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    DxTextBoxModule,
    BrowserModule,
    DxFormModule,
    DxLoadPanelModule,
    DxoValidationModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPageComponent],
  exports: [LoginPageComponent],
})
export class LoginPageModule {}
