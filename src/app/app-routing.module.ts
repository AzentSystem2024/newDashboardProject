import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AuthGuardService } from './services';
import { SideNavOuterToolbarComponent } from './layouts';

import { MainHomePageComponent } from './components/utils/main-home-page/main-home-page.component';
import { LoginPageComponent } from './components/utils/login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'Main-Dashboard',
        component: MainHomePageComponent,
      },
      {
        path: 'login-Page',
        component: LoginPageComponent,
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
