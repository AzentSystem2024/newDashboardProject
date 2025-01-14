import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
  RevenueAnalysisCardComponent,
  OpportunityTileComponent,
  ContactStatusComponent,
  RevenueAnalysisByStatesCardComponent,
  SalesMapCardComponent,
  SalesByRangeCardComponent,
  StatusSelectBoxComponent,
  SalesPerformanceCardComponent,
  OpportunitiesTickerComponent,
} from './components';
import { AuthGuardService } from './services';
import {
  SideNavOuterToolbarComponent,
  UnauthenticatedContentComponent,
} from './layouts';
import { CrmContactDetailsComponent } from './pages/crm-contact-details/crm-contact-details.component';
import { PlanningTaskListComponent } from './components/utils/Operations-Receivers-Drill-Page/planning-task-list.component';
import { PlanningTaskDetailsComponent } from './components/utils/Operations-Denial-Code-BreakUp/planning-task-details.component';
import { AnalyticsDashboardComponent } from './pages/analytics-dashboard/analytics-dashboard.component';
import { AppSignInComponent } from './pages/sign-in-form/sign-in-form.component';
import { AppSignUpComponent } from './pages/sign-up-form/sign-up-form.component';
import { AppResetPasswordComponent } from './pages/reset-password-form/reset-password-form.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ContactCardsComponent } from './components/utils/Submission-Dashboard/contact-cards.component';
import { CalendarListComponent } from './components/utils/Remittance-Dashboard/calendar-list.component';
import { ClaimDrillGridComponent } from './components/utils/Grid-Table-Component/claim-drill-grid.component';
import { MainHomePageComponent } from './components/utils/main-home-page/main-home-page.component';

const routes: Routes = [
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'create-account',
        component: CreateAccountFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'Main-Dashboard',
        component: MainHomePageComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'Main-Dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), BrowserModule],
  providers: [AuthGuardService],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
