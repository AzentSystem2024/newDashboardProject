import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ReuseStrategyService {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  storeHandler(routePath: string, handle: DetachedRouteHandle): void {
    // console.log(`Storing handler for route: ${routePath}`, handle);
    this.handlers[routePath] = handle;
  }

  getHandler(routePath: string): DetachedRouteHandle | null {
    // console.log(`Retrieving handler for route: ${routePath}`);
    return this.handlers[routePath] || null;
  }

  hasHandler(routePath: string): boolean {
    // console.log(`Checking existence of handler for route: ${routePath}`);
    return !!this.handlers[routePath];
  }

  removeHandler(routePath: string): void {
    // console.log(`Removing handler for route: ${routePath}`);
    delete this.handlers[routePath];
  }

  clearHandlers(): void {
    // console.log('Clearing all handlers');
    this.handlers = {};
  }
}
