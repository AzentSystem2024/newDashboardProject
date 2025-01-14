import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SingleCardModule } from './layouts';
import {
  AppFooterModule,
  ResetPasswordFormModule,
  CreateAccountFormModule,
  ChangePasswordFormModule,
  LoginFormModule,
} from './components';
import { AuthService, ScreenService, AppInfoService } from './services';
import { UnauthenticatedContentModule } from './layouts/unauthenticated-content/unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { CrmContactDetailsModule } from './pages/crm-contact-details/crm-contact-details.component';
import { PlanningTaskListModule } from './components/utils/Operations-Receivers-Drill-Page/planning-task-list.component';
import { PlanningTaskDetailsModule } from './components/utils/Operations-Denial-Code-BreakUp/planning-task-details.component';
import { AnalyticsDashboardModule } from './pages/analytics-dashboard/analytics-dashboard.component';
import { ThemeService } from './services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SingleCardModule,
    AppFooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    BrowserAnimationsModule,
    CrmContactDetailsModule,
    PlanningTaskListModule,
    PlanningTaskDetailsModule,
    AnalyticsDashboardModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [AuthService, ScreenService, AppInfoService, ThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
