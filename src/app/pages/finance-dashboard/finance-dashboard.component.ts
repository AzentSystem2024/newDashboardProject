import { CommonModule, PercentPipe } from '@angular/common';
import {
  Component,
  HostListener,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';

import {
  DxLoadIndicatorModule,
  DxFunnelModule,
  DxButtonModule,
  DxDropDownButtonModule,
  DxTabsModule,
  DxTextBoxModule,
  DxToolbarModule,
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
  DxDataGridComponent,
} from 'devextreme-angular';
import { DataService } from 'src/app/services';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss'],
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
export class FinanceDashboardComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.chartSize.width = (event.target as Window).innerWidth * 0.9;
  }
  chartSize = { width: window.innerWidth * 0.9 };

  pipe = new PercentPipe('en-US');

  dateForm = {
    fromdate: '',
    todate: '',
    AsOnDate: '',
  };

  SearchOnDatasource: any;
  searchOnvalue: any;
  EncountrTypeDatasource: any;
  encountertypevalue: any;
  insuranceDataSource: any;
  insuranceValue: any;
  DepartmentDatasource: any;
  DepartmentValue: any;
  facilityvalue: any;
  modifiedFacilityDatasource: any;
  FacilityDataSource: any;
  CaseTypeDatasource: any;
  caseTypeValue: any;

  userId: any;
  loadingVisible: boolean = false;
  showGroups: boolean = true;

  //===========graph datasource===========
  BarChartDataSource: any;
  pieChartDatasource: any;

  constructor(
    public service: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    console.log('Finance Dashboard Is Loaded');
  }

  ngOnInit(): void {
    this.get_initial_data();
  }
  //===================Custom label for pie chart ===========
  customizeLabel(arg) {
    const valueInMillions = (arg.valueText / 1000000).toFixed(2);
    return `${valueInMillions}M (${arg.percentText})`;
  }
  //=============== Custom Label for Bard chart =============
  MillioncustomizeLabel = (args: any): string => {
    const value = args.value;
    if (value >= 100000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value > 0) {
      return `${(value / 1000).toFixed(2)} K`;
    }
    return `${value}`; // Show as is if less than 1000
  };

  //================== Call initial value fetching ==========
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

  //================= hide and show filter div ===============
  toggleGroups(): void {
    this.showGroups = !this.showGroups;
  }

  //=========MAking cutom datasource for facility datagrid and dropdown loADING=======
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

  //=====================fetch init dataSource =========================
  getValuesOfInitData() {
    // this.loadingVisible = true;
    this.service
      .get_Finance_Dashboard_InitData(this.userId)
      .subscribe((response: any) => {
        if (response) {
          this.SearchOnDatasource = response.SearchOn;
          this.EncountrTypeDatasource = response.EncounterType;
          this.insuranceDataSource = response.Insurance;
          this.DepartmentDatasource = response.Department;
          this.FacilityDataSource = response.Facility;
          this.modifiedFacilityDatasource = this.makeAsyncDataSourceFromJson(
            response.Facility
          );

          this.dateForm.fromdate = response.DateFrom;
          this.dateForm.todate = response.DateTo;
          this.dateForm.AsOnDate = response.DateAsOn;

          this.searchOnvalue =
            this.SearchOnDatasource.find((obj: any) => obj.Default === '1')
              ?.ID || ' ';

          this.encountertypevalue = this.EncountrTypeDatasource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.facilityvalue = this.FacilityDataSource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.insuranceValue = this.insuranceDataSource
            .filter((item) => item.Default === '1')
            .map((item) => item.ID);

          this.DepartmentValue = this.DepartmentDatasource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);
        }
        this.get_graph_DataSource();
      });
  }

  //===================== Apply Button Clicked ========================
  applyButtonClicked() {
    this.get_graph_DataSource();
  }

  //==================Fetch data of graph datasource====================
  get_graph_DataSource() {
    this.showGroups = false;
    this.loadingVisible = true;

    let DateFrom = this.dateForm.fromdate;
    let DateTo = this.dateForm.todate;
    let AsOnDate = this.dateForm.AsOnDate;

    this.service
      .get_Finance_Home_Dashboard_Datasource(
        this.searchOnvalue,
        DateFrom,
        DateTo,
        AsOnDate,
        this.encountertypevalue.join(','),
        this.facilityvalue.join(','),
        this.insuranceValue.join(','),
        this.DepartmentValue.join(',')
      )
      .subscribe((response: any) => {
        if (response.flag === '1') {
          this.BarChartDataSource = response.claimanalysis;
          this.pieChartDatasource = response.claimeageing;
          this.loadingVisible = false;
        } else {
          this.loadingVisible = false;
          notify(`${response.message}`, 'error', 3000);
        }
      });
  }

  //==================export function=======================
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
  declarations: [FinanceDashboardComponent],
  exports: [FinanceDashboardComponent],
})
export class FinanceDashboardModule {}
