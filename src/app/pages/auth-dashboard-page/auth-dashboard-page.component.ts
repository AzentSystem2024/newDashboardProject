import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule, PercentPipe } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
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
import CustomStore from 'devextreme/data/custom_store';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-auth-dashboard-page',
  templateUrl: './auth-dashboard-page.component.html',
  styleUrls: ['./auth-dashboard-page.component.scss'],
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
export class AuthDashboardPageComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: true })
  dataGrid: DxDataGridComponent;

  pipe = new PercentPipe('en-US');

  dateForm = {
    fromdate: '',
    todate: '',
  };
  physicianvalue: any[];
  PhysicianDatasource: any;
  denialcategoryvalue: any[];
  DenailCategoryDatasource: any;
  ServiceCategoryDatasource: any[];
  servicecategoryvalue: any[];
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
  //========================= Constructor =======================
  constructor(private router: Router, private service: DataService) {
    this.userId = sessionStorage.getItem('paramsid');
    if (this.userId != 'undefined' && this.userId != '' && this.userId > '0') {
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  //======================Page on init ========================
  ngOnInit(): void {
    this.get_Init_Data();
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

  //================== Apply button click event ===================
  applyButtonClicked() {}

  //================= fetch Init For DropDown Values =================
  get_Init_Data() {
    this.loadingVisible = true;
    this.service
      .get_Denial_Dashboard_InitData(this.userId)
      .subscribe((response: any) => {
        if (response.flag == '1') {
          this.dateForm.fromdate = response.DateFrom;
          this.dateForm.todate = response.DateTo;

          this.FacilityDataSource = response.Facility;
          this.modifiedFacilityDatasource = this.makeAsyncDataSourceFromJson(
            response.Facility
          );
          this.facilityvalue = this.FacilityDataSource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.SubmissionIndexDatasource = response.Submission;
          this.SubmissionIndexvalue =
            this.SubmissionIndexDatasource.find(
              (obj: any) => obj.Default === '1'
            )?.ID || ' ';

          console.log('submission value :>>', this.SubmissionIndexvalue);

          this.PhysicianDatasource = response.Department;
          this.physicianvalue = this.PhysicianDatasource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.DenailCategoryDatasource = response.DenialCategory;
          this.denialcategoryvalue = this.DenailCategoryDatasource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);

          this.ServiceCategoryDatasource = response.ServiceCategory;
          this.servicecategoryvalue = this.ServiceCategoryDatasource.filter(
            (item) => item.Default === '1'
          ).map((item) => item.ID);
        }
      });

    this.get_chart_datasource();
  }
  //==================== Fetch Cgarts Datasource =====================
  get_chart_datasource() {
    this.loadingVisible = true;
    this.service.get_Prior_Dashboard_Datasource().subscribe((response: any) => {
      if (response.flag == '1') {
        this.ReguestSendCardValue = response.card.RequestCount;
        this.DenialCategoryChartData = response.CategoryWise;
        this.mainSeriesChartDatasource = response.EncounterWise;
        this.TaTstatusDataSource = response.TATWise;
        this.CountPerDaysData = response.DayWise;
        this.loadingVisible = false;
      }
    });
  }

  //==================export function=======================
  export() {}
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
  declarations: [AuthDashboardPageComponent],
  exports: [AuthDashboardPageComponent],
})
export class MainHomePageModule {}
