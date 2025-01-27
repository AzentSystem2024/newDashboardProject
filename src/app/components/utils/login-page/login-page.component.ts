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

  constructor(
    private formb: FormBuilder,
    private router: Router,
    private service: DataService
  ) {}

  Login() {
    var userName = this.loginpage.UserName;
    var Password = this.loginpage.Password;
    if (userName && Password) {
      this.service
        .dashboard_Login(userName, Password)
        .subscribe((response: any) => {
          if (response.flag == '1') {
            let userId = response.userid;
            sessionStorage.setItem('paramsid', userId);
            this.router.navigate(['/Main-Dashboard']);
            notify(`${response.message}`, 'success', 3000);
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
