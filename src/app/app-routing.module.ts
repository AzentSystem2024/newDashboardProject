import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AuthGuardService } from './services';
import {
  SideNavOuterToolbarComponent,
  UnauthenticatedContentComponent,
} from './layouts';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainHomePageComponent } from './pages/main-home-page/main-home-page.component';
import { AuthDashboardPageComponent } from './pages/auth-dashboard-page/auth-dashboard-page.component';
const routes: Routes = [
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
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
      },
      {
        path: 'Auth-Dashboard',
        component: AuthDashboardPageComponent,
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
