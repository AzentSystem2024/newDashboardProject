import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import {
  Component,
  OnInit,
  OnDestroy,
  NgModule,
  Input,
  ViewChild,
} from '@angular/core';
import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDrawerModule, DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import { DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule,
  NavigationEnd,
  Event,
  ActivatedRoute,
  Params,
} from '@angular/router';
import { ScreenService, AppInfoService, DataService } from '../../services';
import {
  SideNavigationMenuModule,
  AppHeaderModule,
  AppFooterModule,
} from '../../components';
import { Subscription } from 'rxjs';
import { ToolbarAnalyticsModule } from '../../components/utils/Search-Parameters-Page/toolbar-analytics.component';
import { ConversionCardModule } from '../../components/utils/Home-Funnel-Chart/conversion-card.component';
import { Sales, SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';
import { CardAnalyticsModule } from 'src/app/components/library/card-analytics/card-analytics.component';
import { DxTabPanelModule } from 'devextreme-angular';
import { MainHomePageComponent } from 'src/app/pages/main-home-page/main-home-page.component';
import { AuthDashboardPageComponent } from 'src/app/pages/auth-dashboard-page/auth-dashboard-page.component';

@Component({
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss'],
  providers: [DataService],
})
export class SideNavOuterToolbarComponent implements OnInit, OnDestroy {
  @ViewChild(DxScrollViewComponent, { static: true })
  scrollView!: DxScrollViewComponent;

  @Input()
  title!: string;

  selectedRoute = '';

  menuOpened!: boolean;

  opportunities: SalesOrOpportunitiesByCategory = null;
  sales: Sales = null;

  temporaryMenuOpened = false;

  menuMode: DxDrawerTypes.OpenedStateMode = 'shrink';

  menuRevealMode: DxDrawerTypes.RevealMode = 'expand';

  minMenuSize = 0;
  currentUrl: any;
  segment: any;

  shaderEnabled = false;

  tabs: any;

  selectedIndex = 0;
  orientation: any = 'horizonal';

  routerSubscription: Subscription;

  screenSubscription: Subscription;

  private applyButtonSubscription: Subscription;
  userId: any;
  showHeadersDiv: boolean;
  currentRoute: any;

  constructor(
    public service: DataService,
    private screen: ScreenService,
    private router: Router,
    public appInfo: AppInfoService,
    private route: ActivatedRoute
  ) {
    this.currentRoute = this.router.url;
  }
  //=================== On Init Iunction =================
  ngOnInit() {
    this.on_Load_tab_data();
  }

  //================== Tab data fetching ===================
  on_Load_tab_data() {
    this.route.queryParams.subscribe((params: Params) => {
      // Set userId from query params or sessionStorage
      const queryUserId = params['userId'];
      this.userId =
        queryUserId && queryUserId !== 'undefined' && queryUserId !== null
          ? queryUserId
          : sessionStorage.getItem('paramsid');
      if (this.userId) {
        sessionStorage.setItem('paramsid', this.userId);
        this.service.fetch_tab_Data_mainLayout().subscribe((response: any) => {
          if (response.flag === '1') {
            this.tabs = response.dashboards;

            // Check if we should navigate based on tabs and login status
            if (this.tabs.length > 0) {
              this.navigateToDashboard(this.tabs[this.selectedIndex].text);
            }
          }
        });
      }
    });
  }

  navigateToDashboard(dashboardText: string) {
    const routes = {
      Finance: '/Finance-Dashboard',
      Denial: '/Denial-Dashboard',
      Authorization: '/Auth-Dashboard',
      Resubmission: '/Resubmission-Dashboard',
      ClinicalOutlier: '/Clinical-Outlier-Dashboard',
    };

    for (const key in routes) {
      if (dashboardText.includes(key)) {
        this.router.navigate([routes[key]]);
        return;
      }
    }
  }

  //====================Tab Clicke Event====================
  onTabChanged(event: any) {
    const dashboardText: any = event.itemData.text;
    this.navigateToDashboard(dashboardText);
  }
  //==========================================================
  getCurrentSegmentFromUrl(): string {
    // Get the current URL from the browser
    const currentUrl = window.location.href;
    // Split the URL by '/'
    const urlParts = currentUrl.split('/');
    // Find the last part of the URL
    const lastPart = urlParts[urlParts.length - 1];
    // Remove any query parameters
    const segment = lastPart.split('?')[0];
    return segment;
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
    // alert('Component function called');
    this.applyButtonSubscription.unsubscribe();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];
    this.menuMode = isLarge ? 'shrink' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = isXSmall ? 0 : 48;
    this.shaderEnabled = !isLarge;
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  navigationChanged(event: DxTreeViewTypes.ItemClickEvent) {
    const path = (event.itemData as any).path;
    const pointerEvent = event.event;
    if (path && this.menuOpened) {
      if (event.node?.selected) {
        pointerEvent?.preventDefault();
      } else {
        this.router.navigate([path]);
      }
      if (this.hideMenuAfterNavigation) {
        this.temporaryMenuOpened = false;
        this.menuOpened = false;
        pointerEvent?.stopPropagation();
      }
    } else {
      pointerEvent?.preventDefault();
    }
  }

  navigationClick() {
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
}

@NgModule({
  imports: [
    RouterModule,
    SideNavigationMenuModule,
    DxDrawerModule,
    AppHeaderModule,
    CommonModule,
    DxTabPanelModule,
    DxTabsModule,
  ],
  exports: [SideNavOuterToolbarComponent],
  declarations: [SideNavOuterToolbarComponent],
})
export class SideNavOuterToolbarModule {}
