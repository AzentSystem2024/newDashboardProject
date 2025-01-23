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
} from '@angular/router';
import { ScreenService, AppInfoService, DataService } from '../../services';
import {
  SideNavigationMenuModule,
  AppHeaderModule,
  AppFooterModule,
} from '../../components';
import { Subscription } from 'rxjs';
import { ToolbarAnalyticsModule } from '../../components/utils/Search-Parameters-Page/toolbar-analytics.component';
import { OpportunitiesTickerModule } from '../../components/utils/Card-Data-Component/opportunities-ticker.component';
import { ConversionCardModule } from '../../components/utils/Home-Funnel-Chart/conversion-card.component';
import { Sales, SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';
import { CardAnalyticsModule } from 'src/app/components/library/card-analytics/card-analytics.component';
import { SharedService } from 'src/app/services/shared-service';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss'],
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

  routerSubscription: Subscription;

  screenSubscription: Subscription;

  private applyButtonSubscription: Subscription;

  constructor(
    public service: DataService,
    private screen: ScreenService,
    private router: Router,
    public appInfo: AppInfoService,
    private route: ActivatedRoute,
    private sharedservise: SharedService
  ) {
    this.segment = this.getCurrentSegmentFromUrl();
    // console.log('Segment:', this.segment);
    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.selectedRoute = event.urlAfterRedirects.split('?')[0];
      }
    });
  }

  ngOnInit() {
    // console.log('=>', this.route);
    this.route.url.subscribe((segments) => {
      this.currentUrl = segments.join('/');
      // console.log('Current URL:', this.currentUrl);
    });

    this.menuOpened = this.screen.sizes['screen-large'];

    this.screenSubscription = this.screen.changed.subscribe(() =>
      this.updateDrawer()
    );

    this.updateDrawer();
  }
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
    AppFooterModule,
    ToolbarAnalyticsModule,
    OpportunitiesTickerModule,
    CardAnalyticsModule,
    ConversionCardModule,
  ],
  exports: [SideNavOuterToolbarComponent],
  declarations: [SideNavOuterToolbarComponent],
})
export class SideNavOuterToolbarModule {}
