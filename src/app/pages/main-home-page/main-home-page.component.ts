import { CommonModule, PercentPipe } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
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
  DxDataGridModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { DataService } from 'src/app/services';
import { BrowserModule } from '@angular/platform-browser';
import { trigger, style, transition, animate } from '@angular/animations';
import { SharedService } from 'src/app/services/shared.service';
import notify from 'devextreme/ui/notify';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-home-page',
  templateUrl: './main-home-page.component.html',
  styleUrls: ['./main-home-page.component.scss'],
  providers: [DataService],
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
export class MainHomePageComponent implements OnInit {
  @ViewChild(DxTreeViewComponent, { static: false })
  treeView: DxTreeViewComponent;

  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  pipe = new PercentPipe('en-US');

  loadingVisible: boolean = false;
  vibleExportBtn: boolean = true;
  SearchOnDatasource: any;
  searchOnvalue: any;
  facilityvalue: any[] = [];
  FacilityDataSource: any;

  EncountrTypeDatasource: any;
  DenailCategoryDatasource: any;
  denialcategoryvalue: any[] = [];
  encountertypevalue: any[] = [];
  DateFrom: any = new Date();
  DateTo: any = new Date();
  RejectionIndexDatasource: any;
  rejectionIndexvalue: any;
  blockDataSource: any;
  blockValue: any[] = [];
  regionDataSource: any;
  RegionValue: any[] = [];
  ProviderTypeDatasource: any;
  ProviderTypevalue: any[] = [];
  insuranceDataSource: any;
  insuranceValue: any[] = [];
  departmentDataSource: any;
  departmentValue: any[] = [];
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
  modifiedFacilityDatasource: any;
  dateForm = {
    fromdate: '',
    todate: '',
  };

  isloggedIn: any;
  ParamsUserId: any;

  constructor(
    public service: DataService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log("Denial Dashboard Is Loaded")
  }

  ngOnInit(): void {
    this.get_initial_data();
  }

  get_initial_data() {
    // Read from sessionStorage first
    let storedUserId = sessionStorage.getItem('paramsid');

    if (storedUserId && storedUserId !== 'undefined' && storedUserId !== null) {
      this.userId = storedUserId;
      console.log('Session storage userId found:', this.userId);
      this.getValuesOfInitData();
    } else {
      // If sessionStorage is empty, check queryParams
      this.route.queryParams.subscribe((params: Params) => {
        let queryUserId = params['userId'];

        if (
          queryUserId &&
          queryUserId !== 'undefined' &&
          queryUserId !== null
        ) {
          this.userId = queryUserId;
          sessionStorage.setItem('paramsid', this.userId);
          console.log('Query param userId found:', this.userId);
          this.getValuesOfInitData();
        } else {
          console.warn('No user data available, redirecting to login.');
          this.router.navigate(['/auth/login']);
        }
      });
    }
  }

  //=========== reorder list options to selected data to the top side ========
  reorderDataSource(selectedvalues: string, datsourceName: string) {
    // Filter the selected items
    const selectedItems = this[datsourceName].filter((item) =>
      this[selectedvalues].includes(item.ID)
    );
    const nonSelectedItems = this[datsourceName].filter(
      (item) => !this[selectedvalues].includes(item.ID)
    );
    nonSelectedItems.sort((a, b) => a.Name.localeCompare(b.Name));
    this[datsourceName] = [...selectedItems, ...nonSelectedItems];
  }

  //===========Function to handle selection change and sort the data==========
  onSelectionChanged(event: any, jsonData: any[], dataSourceKey: string): void {
    console.log('Original JSON Data:', jsonData);
    const selectedRows = event.selectedRowsData;
    const selectedRowIds = selectedRows.map((row) => row.ID);
    const unselectedRows = jsonData.filter(
      (row) => !selectedRowIds.includes(row.ID)
    );
    const reorderedData = [...selectedRows, ...unselectedRows];
    this[dataSourceKey] = this.makeAsyncDataSourceFromJson(reorderedData);
    console.log('Updated DataSource:', this[dataSourceKey]);
    this.dataGrid.instance.refresh();
  }

  // ======================== X-Axis value rotated and value custom==============
  formatXAxisText = (axisInfo: any): string => {
    const text = axisInfo.value;
    // const truncatedText = text.length > 14 ? text.slice(0, 14) : text;
    const parts = text.split(' ');
    const middleIndex = Math.ceil(parts.length / 2);
    const firstLine = parts.slice(0, middleIndex).join(' ');
    const secondLine = parts.slice(middleIndex).join(' ');
    return `${firstLine}\n${secondLine}`;
  };

  customizeLabel(arg) {
    const valueInMillions = (arg.valueText / 1000000).toFixed(2);
    return `${valueInMillions}M (${arg.percentText})`;
  }

  MillioncustomizeLabel = (args: any): string => {
    const value = args.value;
    if (value >= 100000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value > 0) {
      return `${(value / 1000).toFixed(2)} K`;
    }
    return `${value}`; // Show as is if less than 1000
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

  //======================top 10 insurance tooltip===================
  top10InsuranceDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.InsuranceName}`,
    };
  }
  //======================top 10 code tooltip===================
  top10CodeDataCustomizeTooltip(arg: any) {
    console.log('arg data', arg);
    return {
      text: `${arg.point.data.CPTName}`,
    };
  }
  //======================top 10 facility tooltip===================
  top10FacilityDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.FacilityName}`,
    };
  }
  //======================top 10 clinician tooltip===================
  top10ClinicianDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.ClinicianName}`,
    };
  }

  //======================top 10 department tooltip===================
  top10DepartmentDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.Department}`,
    };
  }
  //======================Denial Category tooltip===================
  DenialCategoryDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.Category}`,
    };
  }
  //======================Block Wise tooltip===================
  BlockWiseDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.Block}`,
    };
  }
  //======================rejection acountability tooltip===================
  RejectionAccountabilityDataCustomizeTooltip(arg: any) {
    return {
      text: `${arg.point.data.Accountability}`,
    };
  }

  toggleGroups(): void {
    this.showGroups = !this.showGroups;
  }

  customTagTemplate = (itemData: any) => {
    return `<span>${itemData.Name}</span>`;
  };

  //==================MAking cutom datasource for facility datagrid and dropdown loADING=======
  makeAsyncDataSourceFromJson(jsonData: any) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load: () => {
        return new Promise((resolve, reject) => {
          try {
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      },
    });
  }
  //=====================fetch init dataSource =========================
  getValuesOfInitData() {
    this.loadingVisible = true;
    this.service.getInitData(this.userId).subscribe((response: any) => {
      if (response) {
        this.SearchOnDatasource = response.SearchOn;
        this.EncountrTypeDatasource = response.EncounterType;
        this.RejectionIndexDatasource = response.RejectionIndex;
        this.DenailCategoryDatasource = response.DenialCategory;
        this.blockDataSource = response.Block;
        this.insuranceDataSource = response.Insurance;
        this.departmentDataSource = response.Department;
        this.FacilityDataSource = response.Facility;
        this.modifiedFacilityDatasource = this.makeAsyncDataSourceFromJson(
          response.Facility
        );

        this.dateForm.fromdate = response.DateFrom;
        this.dateForm.todate = response.DateTo;

        this.searchOnvalue =
          this.SearchOnDatasource.find((obj: any) => obj.Default === '1')?.ID ||
          ' ';

        this.rejectionIndexvalue =
          this.RejectionIndexDatasource.find((obj: any) => obj.Default === '1')
            ?.ID || ' ';

        this.denialcategoryvalue = this.DenailCategoryDatasource.filter(
          (item) => item.Default === '1'
        ).map((item) => item.ID);

        this.encountertypevalue = this.EncountrTypeDatasource.filter(
          (item) => item.Default === '1'
        ).map((item) => item.ID);

        this.blockValue = this.blockDataSource
          .filter((item) => item.Default === '1')
          .map((item) => item.ID);

        this.facilityvalue = this.FacilityDataSource.filter(
          (item) => item.Default === '1'
        ).map((item) => item.ID);

        this.insuranceValue = this.insuranceDataSource
          .filter((item) => item.Default === '1')
          .map((item) => item.ID);

        this.departmentValue = this.departmentDataSource
          .filter((item) => item.Default === '1')
          .map((item) => item.ID);
      }
      this.get_graph_DataSource();
    });
  }

  //==================Fetch data of graph datasource====================
  get_graph_DataSource() {
    this.showGroups = false;
    this.loadingVisible = true;

    this.DateFrom = this.dateForm.fromdate;
    this.DateTo = this.dateForm.todate;

    this.dataservice
      .get_Main_Home_Dashboard_Datasource(
        this.searchOnvalue,
        this.DateFrom,
        this.DateTo,
        this.rejectionIndexvalue,
        this.denialcategoryvalue.join(', '),
        this.encountertypevalue.join(', '),
        this.blockValue.join(', '),
        this.facilityvalue.join(', '),
        this.insuranceValue.join(', '),
        this.departmentValue.join(', ')
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
          this.ToptenInsuranceRejectedDataSource = response.InsuranceWise.map(
            (insurance) => {
              if (!insurance.InsuranceShortName) {
                const nameParts = insurance.InsuranceName.split(' ');
                const shortName = nameParts.slice(0, 2).join(' ');
                return { ...insurance, InsuranceShortName: shortName };
              }
              return insurance;
            }
          );
          this.TopTenFacilityRejectedDataSource = response.FacilityWise;
          this.TopTenCodeRejectedDataSource = response.CodeWise;
          this.TopTenDepartmentWiseRejectedDataSource = response.DepartmentWise;
          this.TopTenDoctorWiseRejectedDataSource = response.ClinicianWise.map(
            (clinician) => {
              if (!clinician.ClinicianShortName && clinician.ClinicianName) {
                const nameParts = clinician.ClinicianName.trim().split(/\s+/);
                clinician.ClinicianShortName = nameParts.slice(0, 2).join(' ');
              }
              return clinician;
            }
          );
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
    this.loadingVisible = true; // Show loading indicator
    // Select both divs
    const exportDiv1 = document.querySelector('.ExportDiv1') as HTMLElement;
    const exportDiv2 = document.querySelector('.ExportDiv2') as HTMLElement;
    // Pass both divs to the service
    const reportName = 'Dashboard';
    // Use async/await to ensure the export completes before hiding the loading
    this.service
      .exportGraphData(reportName, [exportDiv1, exportDiv2])
      .then(() => {
        this.loadingVisible = false; // Hide loading indicator after export completes
      })
      .catch((error) => {
        this.loadingVisible = false; // Hide loading in case of an error
        console.error('Export failed:', error); // Handle any errors if needed
      });
  }
}
@NgModule({
  imports: [
    CommonModule,
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
    DxChartModule,
    DxPieChartModule,
    DxTagBoxModule,
    DxLoadPanelModule,
    DxDataGridModule,
    FormsModule,
  ],
  declarations: [MainHomePageComponent],
  exports: [MainHomePageComponent],
})
export class MainHomePageModule {}
