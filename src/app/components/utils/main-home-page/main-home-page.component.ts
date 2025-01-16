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
import notify from 'devextreme/ui/notify';
import * as moment from 'moment';

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
  DateFrom: any = moment().format('DD/MM/YYYY');
  DateTo: any = moment().format('DD/MM/YYYY');
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
  RemittanceRejectionPercentDatasource: any;
  CaseTypeRejectionDataSource: any;
  DenialGroupdataSource: any;
  DenialCategoryRejectionDataSource: any;
  BlockWiseRejectionDataSource: any;
  RejectionAccountabilityDataSource: any;
  ToptenInsuranceRejectedDataSource: any;
  TopTenFacilityRejectedDataSource: any;
  TopTenCodeRejectedDataSource: any;
  TopTenDepartmentWiseRejectedDataSource: any;
  TopTenDoctorWiseRejectedDataSource: any;

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
    const valueInMillions = (arg.valueText / 1000000).toFixed(2);
    return `${valueInMillions}M (${arg.percentText})`;
  }

  MillioncustomizeLabel = (args: any): string => {
    const valueInMillions = (args.value / 1000000).toFixed(2);
    const percentage = args.point?.data?.RejectedPercent ?? 0;
    return `${valueInMillions}M - ${percentage}%`;
  };

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

        this.DateFrom = '2018/01/01';
        this.DateTo = '2018/12/01';
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
    this.showGroups = false;
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
        if (response.flag === '1') {
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

          this.RemittanceRejectionPercentDatasource = response.MonthWise;
          this.CaseTypeRejectionDataSource = response.CaseWise;
          this.DenialGroupdataSource = response.GroupWise;
          this.DenialCategoryRejectionDataSource = response.CategoryWise;
          this.BlockWiseRejectionDataSource = response.BlockWise;
          this.RejectionAccountabilityDataSource = response.AccountabilityWise;
          this.ToptenInsuranceRejectedDataSource = response.InsuranceWise;
          this.TopTenFacilityRejectedDataSource = response.FacilityWise;
          this.TopTenCodeRejectedDataSource = response.CodeWise;
          this.TopTenDepartmentWiseRejectedDataSource = response.DepartmentWise;
          this.TopTenDoctorWiseRejectedDataSource = response.ClinicianWise;
          this.loadingVisible = false;
        } else {
          notify(`${response.message}`, 'error', 3000);
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
    this.loadingVisible = true;
    const funnelContainer = document.querySelector(
      '.graph-scroll-container'
    ) as HTMLElement;
    const reportName = 'Dashboard';
    this.service.export(reportName, funnelContainer);
    this.loadingVisible = false;
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
