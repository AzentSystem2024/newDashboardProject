import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface IResponse {
  isOk: boolean;
  data?: IUser;
  message?: string;
}

const defaultPath = '/';
export const defaultUser: IUser = {
  email: 'azentdeveloper@dx-email.com',
  name: 'Azent Developer',
  avatarUrl:
    'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
};

@Injectable()
export class AuthService {
  private loggedInSource = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedInSource.asObservable();

  private _user: IUser | null = defaultUser;

  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router) {}

  async logIn(email: string, password: string) {
    try {
      // Send request
      this._user = { ...defaultUser, email };
      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  }

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        data: null,
      };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      // Send request

      this.router.navigate(['/auth/create-account']);
      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account',
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to change password',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  async logOut() {
    this.router.navigate(['/auth/login']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const isAuthenticated = !!sessionStorage.getItem('paramsid'); // Check authentication
    if (!isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
