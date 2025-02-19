import { Injectable, asNativeElements } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  from,
  Subject,
  throwError,
  catchError,
  BehaviorSubject,
} from 'rxjs';
import {
  CRS_DASHBOARD_CLAIMSMRY_DOCTORDATA,
  CRS_DASHBOARD_CLAIMSMRY_RECEIVEDATA,
  CRS_DASHBOARD_CLAIMSUMMARY_BRKUP,
  CRS_DASHBOARD_CLAIMSUMMARY_HOME,
  CRS_DASHBOARD_PRIOR_DASHBOARD,
  CRS_DASHBOARD_CLINICIANRECEIVER_CPT,
  CRS_DASHBOARD_CLINICIANRECIVER_BRKUP,
  CRS_DASHBOARD_CLINICIAN_HOME,
  CRS_DASHBOARD_FINANCE_AGEING,
  CRS_DASHBOARD_FINANCE_HOME,
  CRS_DASHBOARD_INIT_DATA,
  CRS_DASHBOARD_RCMCLAIM_BRKUP,
  CRS_DASHBOARD_RCMDENIAL_BRKUP,
  CRS_DASHBOARD_RCM_HOME,
  CRS_DASHBOARD_RECEIVER_HOME,
  CRS_DASHBOARD_REMITTANCE_HOME,
  CRS_DASHBOARD_SUBMISSION_HOME,
  CRS_DASHBOARD_LOGIN,
  CRS_DASHBOARD_TABS_DATA,
  CRS_DENIAL_DASHBOARD_INIT_DATA,
  CRS_FINANCE_DASHBOARD_INIT_DATA,
  CRS_FINANCE_DASHBOARD_CLAIMSUMMARY_HOME,
  CRS_DASHBOARD_PRIOR_DASHBOARD_OPERATIONS,
} from 'src/constants/constantURl';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';
const colors: string[] = ['#6babac', '#e55253'];

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isLoggedIn: any;

  private months: { name: string; value: any }[] = [
    { name: 'All', value: ' ' },
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 },
  ];
  Id: number;

  Assigned: string;

  Subject: string;

  private _values = new Subject();

  public selectedValues: any;

  private applyButtonClicked = new Subject<void>();
  private dataSubject = new Subject<void>();

  applyButtonClicked$ = this.applyButtonClicked.asObservable();
  dataSubject$ = this.dataSubject.asObservable();

  selectedValue$ = this._values.asObservable();

  lookupDatatoolbar: any;

  constructor(private http: HttpClient) {}
  //============= show headers in dashboard pages ============
  set_Loggin_Value(Value: any) {
    this.isLoggedIn = Value;
    console.log('logging value changed', this.isLoggedIn);
  }
  //============= hide headers in login page ============

  get_Loggin_Value() {
    return this.isLoggedIn;
  }

  //============Share months to component ================
  getMonths(): { name: string; value: number }[] {
    return this.months;
  }

  //================ClaimSummary Data Fetching=================
  get_Main_Home_Dashboard_Datasource(
    searchOn: any,
    fromdate: any,
    todate: any,
    rejectionIndex: any,
    denialCategory: any,
    encounterType: any,
    block: any,
    facility: any,
    insurance: any,
    department: any
  ) {
    const url = CRS_DASHBOARD_CLAIMSUMMARY_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      RejectionIndex: rejectionIndex,
      DenialCategory: denialCategory,
      EncounterType: encounterType,
      Block: block,
      Region: '',
      ProviderType: '',
      Facility: facility,
      Insurance: insurance,
      Department: department,
    };

    return this.http.post(url, reqBodyData);
  }

  //================Finance dashboard Data Fetching=================
  get_Finance_Home_Dashboard_Datasource(
    searchOn: any,
    fromdate: any,
    todate: any,
    asOnDate: any,
    encounterType: any,
    facility: any,
    insurance: any,
    department: any
  ) {
    const url = CRS_FINANCE_DASHBOARD_CLAIMSUMMARY_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      DateAsOn: asOnDate,
      EncounterType: encounterType,
      Region: '',
      ProviderType: '',
      Facility: facility,
      Insurance: insurance,
      Department: department,
    };

    return this.http.post(url, reqBodyData);
  }

  //================ClaimSummary Data Fetching=================
  get_Prior_Dashboard_Production_Datasource(
    datefrom: any,
    dateTo: any,
    DenialCategory: any,
    facility: any,
    department: any,
    category: any
  ) {
    const url = CRS_DASHBOARD_PRIOR_DASHBOARD;
    const reqBodyData = {
      DateFrom: datefrom,
      DateTo: dateTo,
      SubmissionIndex: '',
      DenialCategory: DenialCategory,
      Facility: facility,
      Department: department,
      ServiceCategory: category,
    };

    return this.http.post(url, reqBodyData);
  }


   //================ClaimSummary Data Fetching=================
   get_Prior_Dashboard_Opreations_Datasource(
    datefrom: any,
    dateTo: any,
    facility: any,
    department: any,
    category: any
  ) {
    const url = CRS_DASHBOARD_PRIOR_DASHBOARD_OPERATIONS;
    const reqBodyData = {
      DateFrom: datefrom,
      DateTo: dateTo,
      Facility: facility,
      Department: department,
      ServiceCategory: category,
    };

    return this.http.post(url, reqBodyData);
  }
  //================ Loading Tabs Data for mainDashboardLayout =====================
  fetch_tab_Data_mainLayout() {
    const UserID = sessionStorage.getItem('paramsid');
    const url = CRS_DASHBOARD_TABS_DATA;
    const reqBody = { UserID: UserID };
    return this.http.post(url, reqBody);
  }

  // ================================================================================
  // ================================================================================

  //=============Grouping of higher amound values===========
  formatNumberWithCommas(number: any): any {
    const [integerPart, fractionalPart] = number.toString().split('.');
    const reversedInteger = integerPart.split('').reverse().join('');
    const groupedInteger = reversedInteger
      .replace(/(\d{3})(?=\d)/g, '$1,')
      .replace(/(\d{2})(?=\d)/g, '$1,');
    const formattedInteger = groupedInteger
      .split('')
      .reverse()
      .join('')
      .replace(/^,/, '');
    return fractionalPart
      ? `${formattedInteger}.${fractionalPart}`
      : formattedInteger;
  }

  //=================Init data for denial Dashboard drop down fields==================
  getInitData(id: any): Observable<any> {
    return this.http.post<any>(CRS_DASHBOARD_INIT_DATA, { userid: id });
  }

  //=================Init data for auth-dashboard drop down fields==================
  get_Finance_Dashboard_InitData(id: any): Observable<any> {
    return this.http.post<any>(CRS_FINANCE_DASHBOARD_INIT_DATA, { UserID: id });
  }

  //=================Init data for auth-dashboard drop down fields==================
  get_Denial_Dashboard_InitData(id: any): Observable<any> {
    return this.http.post<any>(CRS_DENIAL_DASHBOARD_INIT_DATA, { userid: id });
  }

  //===================== Login dashboard ============================
  dashboard_Login(username: any, password: any) {
    const url = CRS_DASHBOARD_LOGIN;
    const reqBody = { Loginid: username, password: password };
    return this.http.post(url, reqBody);
  }

  //================ClaimSummary Data Fetching=================
  getClaimSummary(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_CLAIMSUMMARY_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }

  //===================Submission Data Fetching=========================
  getSubmission(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_SUBMISSION_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }
  //=======================Remmitance Data Fetching=====================
  getRemittance(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_REMITTANCE_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }
  //======================RCM Data Fetching=============================
  getRCM(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_RCM_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }
  //======================Doctors Data Fetching=========================
  getClinician(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_CLINICIAN_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }
  //=====================Receivers Data Fetching=====================
  getReceiver(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any
  ) {
    const url = CRS_DASHBOARD_RECEIVER_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
    };
    return this.http.post(url, reqBodyData);
  }

  getFinance(
    searchOn: any,
    facility: any,
    encounterType: any,
    fromdate: any,
    todate: any,
    asondate: any
  ) {
    const url = CRS_DASHBOARD_FINANCE_HOME;
    const reqBodyData = {
      SearchOn: searchOn,
      DateFrom: fromdate,
      DateTo: todate,
      EncounterType: encounterType,
      Facility: facility,
      AsOnDate: asondate,
    };
    return this.http.post(url, reqBodyData);
  }

  // //////////////////Drilldown///////////////////

  getdrilldata = (selecteddata: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_CLAIMSUMMARY_BRKUP;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      SelectedValue: selecteddata,
    };
    return this.http.post(url, reqBodyData);
  };

  // //////////////////Drilldown of RCM///////////////////

  getdrillrcmdata = (selectedValue: any, submissionLevel: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_RCMCLAIM_BRKUP;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      SelectedValue: selectedValue,
      SubmissionLevel: submissionLevel,
    };
    return this.http.post(url, reqBodyData);
  };

  //=============================================================
  getdrilldenialdata = (selecteddata: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_RCMDENIAL_BRKUP;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      DenialCode: selecteddata,
    };
    return this.http.post(url, reqBodyData);
  };

  ////////////////////Drilldown of Doctors///////////////////

  getdrilldoctors = (selecteddata: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_CLINICIANRECIVER_BRKUP;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      DoctorName: selecteddata,
    };
    return this.http.post(url, reqBodyData);
  };

  getdrilldoctorpies = (selecteddata: any, receiversname: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_CLINICIANRECEIVER_CPT;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      DoctorName: selecteddata,
      ReceiverName: receiversname,
    };
    return this.http.post(url, reqBodyData);
  };

  //////////////////// FINANCEDRILLDOWN////////////////////////
  getdrillFinanceageing = (selecteddata: any) => {
    const selectedValuesString = JSON.parse(
      sessionStorage.getItem('selectedValues')
    );
    const url = CRS_DASHBOARD_FINANCE_AGEING;
    const reqBodyData = {
      SearchOn: selectedValuesString.searchOn,
      DateFrom: selectedValuesString.DateFrom,
      DateTo: selectedValuesString.DateTo,
      EncounterType: selectedValuesString.encounterType,
      Facility: selectedValuesString.facility,
      AsOnDate: selectedValuesString.AsOnDate,
      Age: selecteddata,
    };
    return this.http.post(url, reqBodyData);
  };

  //====================DrillDown Data Grid of Receiver====================
  get_DrillDown_Data_Grid_Receiver(data: any, paramsData: any) {
    const url = CRS_DASHBOARD_CLAIMSMRY_RECEIVEDATA;

    const reqBodyData = {
      SearchOn: paramsData.searchOn,
      DateFrom: paramsData.DateFrom,
      DateTo: paramsData.DateTo,
      EncounterType: paramsData.encounterType,
      Facility: paramsData.facility,
      ReceiverName: data,
    };
    return this.http.post(url, reqBodyData);
  }

  //====================DrillDown Data Grid of Receiver====================
  get_DrillDown_Data_Grid_Clinician(data: any, paramsData: any) {
    const url = CRS_DASHBOARD_CLAIMSMRY_DOCTORDATA;
    const reqBodyData = {
      SearchOn: paramsData.searchOn,
      DateFrom: paramsData.DateFrom,
      DateTo: paramsData.DateTo,
      EncounterType: paramsData.encounterType,
      Facility: paramsData.facility,
      DoctorName: data,
    };
    return this.http.post(url, reqBodyData);
  }
  //=================Format the date for export pdf date=====================
  formatDate(dateStr: any) {
    // Convert the string to a Date object
    const date = new Date(dateStr);
    // Define the month names
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = monthNames[date.getMonth()]; // Get month name
    const year = date.getFullYear(); // Get full year

    // Return the formatted date
    return `${day}-${month}-${year}`;
  }

  export(reportname: any, element: any) {
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();

        // Add the title at the top center
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold');
        const textWidth =
          (pdf.getStringUnitWidth(reportname) * pdf.getFontSize()) /
          pdf.internal.scaleFactor;
        const textX = (pdfWidth - textWidth) / 2;
        pdf.text(reportname, textX, 10); // Centered report name

        const startY = 15; // Adjust this value if needed for proper spacing

        // Add the image directly below the text
        const imgProps = pdf.getImageProperties(imgData);
        const imageHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, startY, pdfWidth, imageHeight);

        // Add timestamp to the bottom left
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const exportTime = moment().format('DD-MM-YYYY hh:mm:ss A');
        pdf.setFontSize(10);
        pdf.text(`Exported on: ${exportTime}`, 10, pdfHeight - 5);

        // Save the PDF
        pdf.save(`${reportname}.pdf`);
      });
    }
  }

  exportGraphData(reportname: any, elements: HTMLElement[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (elements && elements.length > 0) {
        // Initialize jsPDF with A4 size (portrait)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width
        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height
        let yPosition = 10; // Starting y position for content

        // Add the title at the top of the first page
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold');
        const textWidth =
          (pdf.getStringUnitWidth(reportname) * pdf.getFontSize()) /
          pdf.internal.scaleFactor;
        const textX = (pdfWidth - textWidth) / 2; // Center the title
        pdf.text(reportname, textX, yPosition);
        yPosition = 12; // Space below the title

        // Function to add each element to the PDF
        const processElement = (
          element: HTMLElement,
          resolve: () => void,
          reject: (error: any) => void
        ) => {
          html2canvas(element, {
            scale: 3, // Increase resolution for sharper output
            useCORS: true,
            allowTaint: false,
            logging: false,
          })
            .then((canvas) => {
              const imgData = canvas.toDataURL('image/jpeg', 0.7);
              const imgProps = pdf.getImageProperties(imgData);
              const imageHeight = (imgProps.height * pdfWidth) / imgProps.width;
              // Calculate scale factor to maximize content size and avoid small content
              const scaleFactor = Math.min(
                pdfWidth / imgProps.width,
                pdfHeight / imageHeight
              );
              const scaledWidth = imgProps.width * scaleFactor - 20;
              const scaledHeight = imageHeight * 15 * scaleFactor;
              // Add the image to the PDF (scaled to fit on one page)
              pdf.addImage(
                imgData,
                'JPEG',
                10,
                yPosition,
                scaledWidth,
                scaledHeight
              );
              // Update the yPosition for the next content
              yPosition += scaledHeight;
              resolve(); // Resolve when done
            })
            .catch((error) => {
              reject(error); // Reject if there's an error in html2canvas
            });
        };
        // Process each element sequentially
        const promises = elements.map(
          (element) =>
            new Promise<void>((resolve, reject) =>
              processElement(element, resolve, reject)
            )
        );
        // Wait for all elements to be processed
        Promise.all(promises)
          .then(() => {
            // Add a timestamp at the bottom of the last page
            const exportTime = moment().format('DD-MM-YYYY hh:mm:ss A');
            pdf.setFontSize(5);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Exported on: ${exportTime}`, 10, pdfHeight - 2);
            // Save the PDF
            pdf.save(`${reportname}.pdf`);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject('No elements to export');
      }
    });
  }
}
