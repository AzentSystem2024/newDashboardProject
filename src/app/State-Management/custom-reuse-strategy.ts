import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { ReuseStrategyService } from './reuse-strategy.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class CustomReuseStrategy implements RouteReuseStrategy {
  constructor(private reuseStrategyService: ReuseStrategyService) {}

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true; // Logic can be extended if needed
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig?.path || '';
    this.reuseStrategyService.storeHandler(path, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return this.reuseStrategyService.hasHandler(path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path || '';
    return this.reuseStrategyService.getHandler(path);
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  removeStoredComponent(routePath: string): void {
    this.reuseStrategyService.removeHandler(routePath);
  }

  clearStoredData(): void {
    this.reuseStrategyService.clearHandlers();
  }
}
