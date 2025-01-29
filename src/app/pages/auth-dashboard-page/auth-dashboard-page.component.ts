import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule, PercentPipe } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
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
export class AuthDashboardPageComponent {
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

  showGroups: boolean = true;
  loadingVisible: boolean = false;

  mainSeriesChartDatasource: any = [
    {
      state: 'Illinois',
      year2016: 803,
      year2017: 823,
      year2018: 863,
    },
    {
      state: 'Indiana',
      year2016: 316,
      year2017: 332,
      year2018: 332,
    },
    {
      state: 'Michigan',
      year2016: 452,
      year2017: 459,
      year2018: 470,
    },
    {
      state: 'Ohio',
      year2016: 621,
      year2017: 642,
      year2018: 675,
    },
    {
      state: 'Wisconsin',
      year2016: 290,
      year2017: 294,
      year2018: 301,
    },
  ];
  TaTstatusDataSource: any = [
    {
      day: 'Within 48 Hrs',
      oranges: 1797,
    },
    {
      day: 'Above 72 Hrs',
      oranges: 369,
    },
    {
      day: 'Within 72 Hrs',
      oranges: 291,
    },
  ];
  CountPerDayaData: any = [
    {
      id: 1,
      name: 'January',
    },
    {
      id: 2,
      name: 'February',
    },
    {
      id: 3,
      name: 'March',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'May',
    },
    {
      id: 6,
      name: 'June',
    },
    {
      id: 7,
      name: 'July',
    },
    {
      id: 8,
      name: 'August',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'October',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'December',
    },
  ];

  DenialCategoryChartData: any = [
    { day: '1', sales: 4 },
    { day: '2', sales: 9 },
  ];

  userId: string;

  constructor(private router: Router) {
    this.userId = sessionStorage.getItem('paramsid');
    if (this.userId != 'undefined' && this.userId != '' && this.userId > '0') {
    } else {
      this.router.navigate(['/login']);
    }
  }
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

  //================== Apply button click event ===================
  applyButtonClicked() {}

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
