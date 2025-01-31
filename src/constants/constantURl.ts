import { environment } from '../environments/environment';

const API_BASE_URL = environment.LMS_API_BASE_URL;

///////////////////////API/////////////////////////////////////////////

export const CRS_DASHBOARD_LOGIN =
  API_BASE_URL + 'users/validate';

  export const CRS_DASHBOARD_INIT_DATA =
  API_BASE_URL + 'denialdasbhoard/initdata';

export const CRS_DASHBOARD_CLAIMSUMMARY_HOME =
  API_BASE_URL + 'denialdasbhoard/home';

  export const CRS_DASHBOARD_PRIOR_DASHBOARD =
  API_BASE_URL + 'priordasbhoard/home';

  export const CRS_DASHBOARD_TABS_DATA =
  API_BASE_URL + 'users/dashboards';

export const CRS_DASHBOARD_SUBMISSION_HOME = API_BASE_URL + '/Submission/home';

export const CRS_DASHBOARD_REMITTANCE_HOME = API_BASE_URL + '/Remittance/home';

export const CRS_DASHBOARD_RCM_HOME = API_BASE_URL + '/RCM/home';

export const CRS_DASHBOARD_CLINICIAN_HOME = API_BASE_URL + '/Clinician/home';

export const CRS_DASHBOARD_RECEIVER_HOME = API_BASE_URL + '/Receiver/home';

export const CRS_DASHBOARD_FINANCE_HOME = API_BASE_URL + '/Finance/home';

export const CRS_DASHBOARD_CLAIMSUMMARY_BRKUP =
  API_BASE_URL + '/ClaimSummary/breakup';

export const CRS_DASHBOARD_RCMCLAIM_BRKUP = API_BASE_URL + '/RCM/ClaimAnalysis';

export const CRS_DASHBOARD_RCMDENIAL_BRKUP =
  API_BASE_URL + '/RCM/DenialCodeBreakup';

export const CRS_DASHBOARD_CLINICIANRECIVER_BRKUP =
  API_BASE_URL + '/Clinician/receieverbreakup';

export const CRS_DASHBOARD_CLINICIANRECEIVER_CPT =
  API_BASE_URL + '/Clinician/receievercpt';

export const CRS_DASHBOARD_FINANCE_AGEING = API_BASE_URL + '/Finance/ageing';

export const CRS_DASHBOARD_CLAIMSMRY_RECEIVEDATA =
  API_BASE_URL + '/ClaimSummary/receiverdata';

export const CRS_DASHBOARD_CLAIMSMRY_DOCTORDATA =
  API_BASE_URL + '/ClaimSummary/doctordata';
