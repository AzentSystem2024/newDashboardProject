import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReuseStrategyService {
  private handlers: { [key: string]: DetachedRouteHandle } = {};
  private excludedRoutes: string[] = ['/auth/login']; // Exclude login page

  storeHandler(routePath: string, handle: DetachedRouteHandle): void {
    if (this.excludedRoutes.includes(routePath)) {
      return; // Do not store handler for excluded routes
    }
    this.handlers[routePath] = handle;
  }

  getHandler(routePath: string): DetachedRouteHandle | null {
    if (this.excludedRoutes.includes(routePath)) {
      return null; // Do not retrieve handler for excluded routes
    }
    return this.handlers[routePath] || null;
  }

  hasHandler(routePath: string): boolean {
    return (
      !!this.handlers[routePath] && !this.excludedRoutes.includes(routePath)
    );
  }

  removeHandler(routePath: string): void {
    delete this.handlers[routePath];
  }

  clearHandlers(): void {
    this.handlers = {};
  }
}
