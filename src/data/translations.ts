export type Language = 'en' | 'hi';

export interface TranslationStrings {
  appTitle: string;
  tagline: string;
  reportIncident: string;
  visionCenter: string;
  urbanDashboard: string;
  liveHeatmap: string;
  commandCenter: string;
  incidentManagement: string;
  fieldConsole: string;
  departmentCenter: string;
  predictiveInsights: string;
  citizenPortal: string;
  csvReports: string;
  
  // Metrics
  cityHealthScore: string;
  aiAccuracy: string;
  avgResolutionTime: string;
  duplicateComplaintsSaved: string;
  totalComplaints: string;
  resolvedComplaints: string;
  activeComplaints: string;
  criticalComplaints: string;
  
  // Statuses
  pending: string;
  assigned: string;
  inProgress: string;
  resolved: string;
  rejected: string;

  // Severities
  critical: string;
  high: string;
  medium: string;
  low: string;

  // Actions
  uploadImage: string;
  scanWithAI: string;
  autoTriage: string;
  assignOfficer: string;
  filterByWard: string;
  searchPlaceholder: string;
  exportCsv: string;
  importCsv: string;
  viewDetails: string;
  close: string;
  submitComplaint: string;
  quickDemo: string;
  roleSwitcher: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    appTitle: 'CivicLens AI',
    tagline: 'Transforming Citizen Complaints into Smart City Intelligence',
    reportIncident: 'Report Incident',
    visionCenter: 'AI Vision Center',
    urbanDashboard: 'Urban Intelligence',
    liveHeatmap: 'Live GIS Heatmap',
    commandCenter: 'Command Center',
    incidentManagement: 'Incident Management',
    fieldConsole: 'Officer Field Console',
    departmentCenter: 'Department Hub',
    predictiveInsights: 'Predictive Insights',
    citizenPortal: 'Citizen Portal',
    csvReports: 'Reports & CSV Hub',

    cityHealthScore: 'City Health Score',
    aiAccuracy: 'AI Triage Accuracy',
    avgResolutionTime: 'Avg Resolution Time',
    duplicateComplaintsSaved: 'Duplicates Prevented',
    totalComplaints: 'Total Complaints',
    resolvedComplaints: 'Resolved Cases',
    activeComplaints: 'Active Cases',
    criticalComplaints: 'Critical Hazards',

    pending: 'Pending',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',

    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    uploadImage: 'Upload Civic Image',
    scanWithAI: 'Run AI Computer Vision Scan',
    autoTriage: 'Automated Smart Triage',
    assignOfficer: 'Assign Field Officer',
    filterByWard: 'Filter by Ward',
    searchPlaceholder: 'Search incidents, wards, officers, categories...',
    exportCsv: 'Export CSV',
    importCsv: 'Import Municipal Data',
    viewDetails: 'View Telemetry Details',
    close: 'Close',
    submitComplaint: 'Submit Official Report',
    quickDemo: 'Quick AI Demo',
    roleSwitcher: 'Switch Role'
  },
  hi: {
    appTitle: 'सिविक लेंस एआई',
    tagline: 'नागरिक शिकायतों को स्मार्ट सिटी इंटेलिजेंस में बदलना',
    reportIncident: 'समस्या दर्ज करें',
    visionCenter: 'एआई विजन केंद्र',
    urbanDashboard: 'शहरी इंटेलिजेंस',
    liveHeatmap: 'लाइव जीआईएस हीटमैप',
    commandCenter: 'कमांड सेंटर',
    incidentManagement: 'घटना प्रबंधन',
    fieldConsole: 'अधिकारी फील्ड कंसोल',
    departmentCenter: 'विभाग केंद्र',
    predictiveInsights: 'पूर्वानुमान एवं इनसाइट्स',
    citizenPortal: 'नागरिक पोर्टल',
    csvReports: 'रिपोर्ट्स और सीएसवी',

    cityHealthScore: 'शहर स्वास्थ्य स्कोर',
    aiAccuracy: 'एआई वर्गीकरण सटीकता',
    avgResolutionTime: 'औसत समाधान समय',
    duplicateComplaintsSaved: 'डुप्लिकेट शिकायतें रोकीं',
    totalComplaints: 'कुल शिकायतें',
    resolvedComplaints: 'हल किए गए मामले',
    activeComplaints: 'सक्रिय मामले',
    criticalComplaints: 'गंभीर खतरे',

    pending: 'लंबित',
    assigned: 'नियुक्त',
    inProgress: 'प्रगति पर',
    resolved: 'हल किया गया',
    rejected: 'अस्वीकृत',

    critical: 'अति गंभीर',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',

    uploadImage: 'छवि अपलोड करें',
    scanWithAI: 'एआई विजन स्कैन चलाएं',
    autoTriage: 'स्वचालित स्मार्ट ट्राइएज',
    assignOfficer: 'अधिकारी को सौंपें',
    filterByWard: 'वार्ड के अनुसार फ़िल्टर करें',
    searchPlaceholder: 'शिकायतें, वार्ड, अधिकारी या श्रेणी खोजें...',
    exportCsv: 'सीएसवी निर्यात',
    importCsv: 'डेटा आयात करें',
    viewDetails: 'विवरण देखें',
    close: 'बंद करें',
    submitComplaint: 'शिकायत दर्ज करें',
    quickDemo: 'त्वरित एआई डेमो',
    roleSwitcher: 'रोल बदलें'
  }
};
