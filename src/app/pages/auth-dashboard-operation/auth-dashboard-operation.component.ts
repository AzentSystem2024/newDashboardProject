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
import { Router } from '@angular/router';
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
import { CardAnalyticsModule } from 'src/app/components/library/card-analytics/card-analytics.component';
import { DataService } from 'src/app/services';
import CustomStore from 'devextreme/data/custom_store';
import { DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';

@Component({
  selector: 'app-auth-dashboard-operation',
  templateUrl: './auth-dashboard-operation.component.html',
  styleUrls: ['./auth-dashboard-operation.component.scss'],
})
export class AuthDashboardOperationComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.chartSize = { width: window.innerWidth * 0.95 };

    if (this.chartInstance) {
      this.chartInstance.option('size', { width: this.chartSize.width });
    }
  }
  chartSize = { width: window.innerWidth * 0.95 };

  pipe = new PercentPipe('en-US');

  dateForm = {
    fromdate: '',
    todate: '',
  };
  Departmentvalue: any[];
  DepartmentNewvalue: any[];
  DepartmentDatasource: any;
  denialcategoryvalue: any[];
  denialcategoryNewvalue: any[];
  DenailCategoryDatasource: any;
  ServiceCategoryDatasource: any[];
  servicecategoryvalue: any[];
  servicecategoryNewvalue: any[];
  modifiedFacilityDatasource: any;
  facilityvalue: any[];
  FacilityDataSource: any;
  SubmissionIndexvalue: any[] = [];
  SubmissionIndexDatasource: any;
  showGroups: boolean = true;
  loadingVisible: boolean = false;

  mainSeriesChartDatasource: any;
  TaTstatusDataSource: any;
  CountPerDaysData: any;

  DenialCategoryChartData: any;

  userId: string;
  ReguestSendCardValue: any;
  pieChartDatasource: any;
  chartInstance: any;

  //========================= Constructor =======================
  constructor(private router: Router, private service: DataService) {
    this.userId = sessionStorage.getItem('paramsid');
    if (this.userId != 'undefined' && this.userId != '' && this.userId > '0') {
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  onChartInitialized(e) {
    this.chartInstance = e.component; // Store reference to the chart
  }

  //======================Page on init ========================
  ngOnInit(): void {
    this.get_Init_Data();
  }

  //tag-box

  onMultiTagDepartmentPreparing(args: DxTagBoxTypes.MultiTagPreparingEvent) {
          const selectedItemsLength = args.selectedItems.length;
          const totalCount = this.DepartmentDatasource.length;
      
          if (selectedItemsLength < totalCount) {
            this.DepartmentNewvalue = this.Departmentvalue;
            args.cancel = true;
          } else {
            args.text = `All`;
            this.DepartmentNewvalue = [];
          }
        }

        onMultiTagServiceCategoryPreparing(args: DxTagBoxTypes.MultiTagPreparingEvent) {
          const selectedItemsLength = args.selectedItems.length;
          const totalCount = this.ServiceCategoryDatasource.length;
      
          if (selectedItemsLength < totalCount) {
            this.servicecategoryNewvalue = this.servicecategoryvalue ; 
            args.cancel = true;
          } else {
            args.text = `All`;
            this.servicecategoryNewvalue = [];
          }
        }

  //===========show filter div by clicking showing div========
  Show_toggle_Groups_By_Div_click(): void {
    this.showGroups = true;
  }

  //===================Custom label for pie chart ===========
  customizeLabel(arg) {
    const formattedValue = arg.value.toLocaleString();
    return `${formattedValue} (${arg.percentText})`;
  }

  customizeLabelText = (pointInfo: any) => {
    // Find the corresponding data object in TaTstatusDataSource
    const item = this.TaTstatusDataSource.find((data) => data.Count === pointInfo.value);

    const formattedValue = pointInfo.value.toLocaleString();

    const percentage = item ? item.Percent.toFixed(2) : "0.00";
    
    return `${formattedValue} (${percentage}%)`;
  };

  customizeChartLabelText = (pointInfo: any) => {
    return pointInfo.value.toLocaleString(); // Formats with thousand separator
  };

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

  //================== Apply button click event ===================
  applyButtonClicked() {
    this.get_chart_datasource();
  }

  //================= fetch Init For DropDown Values =================
  get_Init_Data() {
    this.loadingVisible = true;

    this.service
      .get_Denial_Dashboard_InitData(this.userId)
      .subscribe((response: any) => {
        if (response.flag === '1') {
          this.dateForm.fromdate = response.DateFrom;
          this.dateForm.todate = response.DateTo;

          this.FacilityDataSource = response.Facility;
          this.modifiedFacilityDatasource = this.makeAsyncDataSourceFromJson(
            response.Facility
          );
          this.facilityvalue = this.FacilityDataSource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.DepartmentDatasource = response.Department;
          // this.Departmentvalue = this.DepartmentDatasource.filter(
          //   (item) => item.Default === '1'
          // ).map((item) => item.ID);

          this.ServiceCategoryDatasource = response.CaseType;
          // this.servicecategoryvalue = this.ServiceCategoryDatasource.filter(
          //   (item) => item.Default === '1'
          // ).map((item) => item.ID);
        }
        this.get_chart_datasource();
      });
  }
  //==================== Fetch Cgarts Datasource =====================
  get_chart_datasource() {
    this.loadingVisible = true;

    var fromdate = this.dateForm.fromdate;
    var todate = this.dateForm.todate;
    var facility = this.facilityvalue.join(',');
    var department = this.DepartmentNewvalue.join(',');
    var serviceCategory = this.servicecategoryNewvalue.join(',');

    this.service
      .get_Prior_Dashboard_Opreations_Datasource(
        fromdate,
        todate,
        facility,
        department,
        serviceCategory
      )
      .subscribe((response: any) => {
        if (response.flag == '1') {
          this.ReguestSendCardValue = response.card.RequestCount.toLocaleString();
          this.mainSeriesChartDatasource = response.EncounterWise;
          this.pieChartDatasource = response.ServiceWise;
          this.TaTstatusDataSource = response.TATWise;

          this.loadingVisible = false;
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
    DxChartModule,
    DxPieChartModule,
    DxTagBoxModule,
    DxLoadPanelModule,
    DxDataGridModule,
    FormsModule,
  ],
  declarations: [AuthDashboardOperationComponent],
  exports: [AuthDashboardOperationComponent],
})
export class AuthDashboardOperationModule {}
