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
  ) {}

  Login() {
    this.loadingVisible = true;
    let userName = this.loginpage.UserName;
    let password = this.loginpage.Password;

    if (userName && password) {
      this.service
        .dashboard_Login(userName, password)
        .subscribe((response: any) => {
          if (response.flag == '1') {
            notify(`${response.message}`, 'success', 3000);

            let userId = response.userid;
            sessionStorage.setItem('paramsid', userId);
            this.loadingVisible = false;
            // Ensure session storage is completely set before navigating
            setTimeout(() => {
              let userID = sessionStorage.getItem('paramsid');
              
              if (userID && userID !== 'undefined') {
                this.router.navigate(['/Main-Dashboard']).then(() => {
                  console.log(
                    'Navigated to Main-Dashboard with userID:',
                    userID
                  );
                });
              } else {
                console.error('UserID not found in sessionStorage');
              }
            }, 100); // Reduced timeout to 100ms (500ms is unnecessary)
          } else {
            notify(`${response.message}`, 'error', 3000);
          }
        });
    } else {
      alert('Please fill all the fields');
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
