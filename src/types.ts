export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'Low' | 'Normal' | 'High' | 'Immediate Action';
export type IncidentStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
export type UserRole = 'citizen' | 'officer' | 'department_head' | 'admin';

export interface DetectedObject {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [top%, left%, bottom%, right%]
  severity?: SeverityLevel;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  role: string;
  statusChangedTo?: IncidentStatus;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  severity: SeverityLevel;
  severityScore: number; // 0 - 100
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100
  status: IncidentStatus;
  
  // Location
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  area: string;

  // Media
  imageUrl: string;
  repairImageUrl?: string;
  voiceNoteUrl?: string;
  
  // AI Vision & Intelligence metadata
  aiConfidence: number; // 0.0 - 1.0
  detectedObjects: DetectedObject[];
  estimatedCost: string;
  estimatedResolutionTime: string;
  recommendedMaterials: string[];
  safetyRiskLevel: string;
  aiSummary: string;
  
  // Citizen & Duplicates
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  createdAt: string;
  updatedAt: string;
  duplicateCount: number;
  duplicateIncidentIds?: string[];
  
  // Assignment
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedOfficerPhone?: string;
  
  // Resolution details
  resolvedAt?: string;
  resolutionNotes?: string;
  citizenSatisfactionRating?: number; // 1 - 5 stars
  citizenFeedback?: string;
  
  // Timeline audit
  timeline: IncidentTimelineEvent[];
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  head?: string;
  headName?: string;
  headEmail?: string;
  phone?: string;
  officerCount?: number;
  activePersonnel?: number;
  activeIncidentsCount?: number;
  pendingIncidents?: number;
  resolvedIncidents?: number;
  resolvedIncidentsCount?: number;
  slaComplianceRate: number; // e.g. 94.5%
  avgResolutionHours?: number;
  avgResolutionTimeHours?: number;
  allocatedBudget: string | number; // in USD
  spentBudget?: string | number;
  iconName?: string;
  color?: string;
}

export interface Officer {
  id: string;
  name: string;
  badgeNumber?: string;
  role?: string;
  department: string;
  phone: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  assignedWard: string;
  activeCases?: number;
  activeAssignedCases?: number;
  resolvedCases?: number;
  rating?: number; // 1.0 - 5.0
  performanceScore?: number; // 0 - 100
  efficiencyScore?: number; // 0 - 100
  status: 'On Duty' | 'In Field' | 'On Break' | 'Off Duty';
  currentLocation?: { lat: number; lng: number };
}

export interface Ward {
  id: string;
  name: string;
  number: number;
  councillor: string;
  population: number;
  areaSqKm: number;
  centerLat: number;
  centerLng: number;
  bounds: [number, number][]; // Polygon coords
  riskScore: number; // 0 - 100
  activeComplaints: number;
  resolvedComplaints: number;
  healthIndex: number; // 0 - 100
}

export interface CityAnalytics {
  totalComplaints: number;
  resolvedComplaints: number;
  activeComplaints: number;
  criticalComplaints: number;
  inProgressComplaints: number;
  cityHealthScore: number; // 0 - 100
  aiTriageAccuracy: number; // %
  avgResponseTimeHours: number;
  duplicateComplaintsPrevented: number;
  estimatedBudgetSaved: string;
  citizenSatisfactionRate: number; // %
}

export interface CitizenProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  avatarUrl?: string;
  ward: string;
  level?: number;
  rankInWard?: number;
  karmaPoints: number;
  reputationRank?: string;
  reportedCount?: number;
  reportsSubmitted?: number;
  reportsResolved?: number;
  badges: string[] | {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  category?: 'critical' | 'assignment' | 'resolution' | 'duplicate' | 'system';
  type?: 'info' | 'success' | 'warning' | 'danger';
  timestamp: string;
  read?: boolean;
  isRead?: boolean;
  incidentId?: string;
}

export interface PredictiveHotspot {
  id: string;
  title?: string;
  hazardType?: string;
  type?: 'flood' | 'garbage' | 'road_wear' | 'lighting_blackout' | 'drain_choke' | string;
  ward: string;
  riskProbability: number; // %
  predictedImpact?: string;
  forecastDate?: string;
  factors?: string[];
  recommendedPreventativeAction: string;
  potentialCostAvoidance?: string;
  estimatedSavings?: string;
  coordinates?: { lat: number; lng: number };
}
