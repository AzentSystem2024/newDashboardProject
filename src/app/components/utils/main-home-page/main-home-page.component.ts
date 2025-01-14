import { CommonModule, PercentPipe } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import {
  DxLoadIndicatorModule,
  DxFunnelModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxDropDownButtonModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxFormModule,
  DxLookupModule,
  DxTabsModule,
  DxTextBoxModule,
  DxToolbarModule,
  DxTreeViewModule,
  DxTreeViewComponent,
  DxChartModule,
  DxPieChartModule,
  DxTagBoxModule,
  DxLoadPanelModule,
} from 'devextreme-angular';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DataService } from 'src/app/services';
import { BrowserModule } from '@angular/platform-browser';
import { trigger, style, transition, animate } from '@angular/animations';
import { TickerCardModule } from '../../library/ticker-card/ticker-card.component';
import { SharedService } from 'src/app/services/shared-service';
import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';

@Component({
  selector: 'app-main-home-page',
  templateUrl: './main-home-page.component.html',
  styleUrls: ['./main-home-page.component.scss'],
  animations: [
    trigger('toggleRows', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in', style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ],
})
export class MainHomePageComponent {
  @ViewChild(DxTreeViewComponent, { static: false })
  treeView: DxTreeViewComponent;

  pipe = new PercentPipe('en-US');

  loadingVisible: boolean = false;
  vibleExportBtn: boolean = true;
  SearchOnDatasource: any;
  searchOnvalue: any;
  facilityvalue: any;
  FacilityDataSource: any;

  EncountrTypeDatasource: any;
  DenailCategoryDatasource: any;
  denialcategoryvalue: any;
  encountertypevalue: any;
  DateFrom: any = new Date('01/01/2018');
  DateTo: any = new Date();
  RejectionIndexDatasource: any;
  rejectionIndexvalue: any;
  blockDataSource: any;
  blockValue: any;
  regionDataSource: any;
  RegionValue: any;
  ProviderTypeDatasource: any;
  ProviderTypevalue: any;
  insuranceDataSource: any;
  insuranceValue: any;
  departmentDataSource: any;
  departmentValue: any;
  showGroups: boolean = true;

  //=================card data variables=====================
  ClaimsmrydataObj: any;
  claimData: any;
  //====================Variables for card data=================
  ClaimAmount: any = 0;
  claimPrcnt: number = 100;
  remittedAmt: any = 0;
  remittedPercnt: number = 0;
  paidAmt: any = 0;
  paidPrcnt: number = 0;
  deniedAmt: any = 0;
  deniedPrcnt: number = 0;
  balanceAmt: any = 0;
  balancePrcnt: number = 0;

  remittancePrcnt: any = 0;
  rejectionPrcnt: any = 0;
  userId: any;

  // =======================Demo Chart DataSources===================
  RemittanceRejectionPercentDatasource: any = [
    {
      year: 1997,
      smp: 263,
      mmp: 208,
      cnstl: 9,
      cluster: 1,
    },
    {
      year: 1999,
      smp: 169,
      mmp: 270,
      cnstl: 61,
      cluster: 7,
    },
    {
      year: 2001,
      smp: 57,
      mmp: 261,
      cnstl: 157,
      cluster: 45,
    },
    {
      year: 2003,
      smp: 0,
      mmp: 154,
      cnstl: 121,
      cluster: 211,
    },
    {
      year: 2005,
      smp: 0,
      mmp: 97,
      cnstl: 39,
      cluster: 382,
    },
    {
      year: 2007,
      smp: 0,
      mmp: 83,
      cnstl: 3,
      cluster: 437,
    },
  ];

  CaseTypeRejectionDataSource: any = [
    {
      country: 'USA',
      medals: 110,
    },
    {
      country: 'China',
      medals: 100,
    },
    {
      country: 'Russia',
      medals: 72,
    },
    {
      country: 'Britain',
      medals: 47,
    },
    {
      country: 'Australia',
      medals: 46,
    },
    {
      country: 'Germany',
      medals: 41,
    },
    {
      country: 'France',
      medals: 40,
    },
    {
      country: 'South Korea',
      medals: 31,
    },
  ];

  DenialGroupdataSource: any = [
    {
      region: 'Asia',
      val: 4119626293,
    },
    {
      region: 'Africa',
      val: 1012956064,
    },
    {
      region: 'Northern America',
      val: 344124520,
    },
    {
      region: 'Latin America',
      val: 590946440,
    },
    {
      region: 'Europe',
      val: 727082222,
    },
    {
      region: 'Oceania',
      val: 35104756,
    },
  ];

  DenialCategoryRejectionDataSource: any = [
    {
      day: 'Monday',
      oranges: 3,
    },
    {
      day: 'Tuesday',
      oranges: 2,
    },
    {
      day: 'Wednesday',
      oranges: 3,
    },
    {
      day: 'Thursday',
      oranges: 4,
    },
    {
      day: 'Friday',
      oranges: 6,
    },
    {
      day: 'Saturday',
      oranges: 11,
    },
    {
      day: 'Sunday',
      oranges: 4,
    },
  ];

  constructor(
    public service: DataService,
    private sharedService: SharedService,
    private dataservice: DataService
  ) {
    this.sharedService.getUserId().subscribe((response: any) => {
      this.userId = response;
    });

    this.getValuesOfInitData();
  }

  customizeLabel(arg) {
    return `${arg.valueText} (${arg.percentText})`;
  }

  customizeTooltip = ({
    valueText,
    percent,
  }: {
    valueText: string;
    percent: number;
  }) => ({
    text: `${valueText} - ${this.pipe.transform(percent, '1.2-2')}`,
  });

  toggleGroups(): void {
    this.showGroups = !this.showGroups;
  }

  //=====================fetch init dataSource =========================
  getValuesOfInitData() {
    this.loadingVisible = true;
    this.service.getInitData(this.userId).subscribe((response: any) => {
      if (response) {
        console.log('filter values fetched response :=>', response);
        const getInitDataresponse = response;
        this.SearchOnDatasource = response.SearchOn;
        this.EncountrTypeDatasource = response.EncounterType;
        this.RejectionIndexDatasource = response.RejectionIndex;
        this.DenailCategoryDatasource = response.DenialCategory;
        this.blockDataSource = response.Block;
        this.regionDataSource = response.Region;
        this.ProviderTypeDatasource = response.ProviderType;
        this.insuranceDataSource = response.Insurance;
        this.departmentDataSource = response.Department;
        this.FacilityDataSource = response.Facility;

        this.searchOnvalue =
          this.SearchOnDatasource.find((obj: any) => obj.Default === '1')?.ID ||
          ' ';
        // this.DateFrom = new Date(response.DateFrom);
        // this.DateTo = new Date(response.DateTo);
        this.rejectionIndexvalue =
          this.RejectionIndexDatasource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
        this.denialcategoryvalue =
          this.DenailCategoryDatasource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
        this.encountertypevalue =
          this.EncountrTypeDatasource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
        this.blockValue =
          this.blockDataSource.find((obj: any) => obj.Default === '1')?.ID ||
          ' ';
        this.RegionValue =
          this.regionDataSource.find((obj: any) => obj.Default === '1')?.ID ||
          ' ';
        this.ProviderTypevalue =
          this.ProviderTypeDatasource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
        this.facilityvalue =
          this.FacilityDataSource.find((obj: any) => obj.Default === '1')?.ID ||
          ' ';
        this.insuranceValue =
          this.insuranceDataSource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
        this.departmentValue =
          this.departmentDataSource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';
      }
      this.get_graph_DataSource();
    });
  }

  //==================Fetch data of graph datasource=====================
  get_graph_DataSource() {
    this.loadingVisible = true;
    this.dataservice
      .get_Main_Home_Dashboard_Datasource(
        this.searchOnvalue,
        this.DateFrom,
        this.DateTo,
        this.rejectionIndexvalue,
        this.denialcategoryvalue,
        this.encountertypevalue,
        this.blockValue,
        this.RegionValue,
        this.ProviderTypevalue,
        this.facilityvalue,
        this.insuranceValue,
        this.departmentValue
      )
      .subscribe((response: any) => {
        if (response) {
          this.showGroups = false;
          const cardData = response.summary;
          this.ClaimAmount =
            (cardData.ClaimedAmount / 1000000)
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' M';
          this.remittedAmt =
            (cardData.RemittedAmount / 1000000)
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' M';
          this.remittedPercnt = parseInt(cardData.RemittedPercent);
          this.paidAmt =
            (cardData.PaidAmount / 1000000)
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' M';
          this.paidPrcnt = parseInt(cardData.PaidPercent);
          this.deniedAmt =
            (cardData.RejectedAmount / 1000000)
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' M';
          this.deniedPrcnt = parseInt(cardData.RejectedPercent);
          this.balanceAmt =
            (cardData.BalanceAmount / 1000000)
              .toFixed(1)
              .replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' M';
          this.balancePrcnt = parseInt(cardData.BalancePercent);
          this.remittancePrcnt = parseInt(cardData.RemittedPercent);
          this.rejectionPrcnt = parseInt(cardData.RejectedPercent);
          this.loadingVisible = false;
        }
      });
  }
  //=======================Submit button ================================
  applyButtonClicked() {
    this.get_graph_DataSource();
  }

  //===============Format the date fetch from date picker of ui ==================
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().substr(-4);
    return `${year}/${month}/${day}`;
  }

  export() {
    this.vibleExportBtn = false;
    // const format = event.itemData;
    const funnelContainer = document.querySelector('.ExportDiv') as HTMLElement;
    const reportName = 'Claim Summary';
    this.service.export(reportName, funnelContainer);
    this.vibleExportBtn = true;
  }
}
@NgModule({
  imports: [
    CommonModule,
    CardAnalyticsModule,
    DxLoadIndicatorModule,
    DxFunnelModule,
    DxButtonModule,
    DxDropDownButtonModule,
    DxTabsModule,
    DxTextBoxModule,
    DxToolbarModule,
    BrowserModule,
    DxLookupModule,
    DxDateBoxModule,
    DxTreeViewModule,
    DxFormModule,
    DxDropDownBoxModule,
    DxSelectBoxModule,
    TickerCardModule,
    DxChartModule,
    DxPieChartModule,
    DxTagBoxModule,
    DxLoadPanelModule,
  ],
  declarations: [MainHomePageComponent],
  exports: [MainHomePageComponent],
})
export class MainHomePageModule {}
