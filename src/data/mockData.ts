import { Incident, Department, Officer, Ward, CityAnalytics, CitizenProfile, ActivityNotification, PredictiveHotspot, DetectedObject } from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Roads & Infrastructure',
    code: 'PWD-RDS',
    headName: 'Dr. Evelyn Vance',
    headEmail: 'evelyn.vance@smartcity.gov',
    phone: '+1 (555) 019-2831',
    officerCount: 6,
    activeIncidentsCount: 24,
    resolvedIncidentsCount: 142,
    slaComplianceRate: 95.8,
    avgResolutionHours: 18.5,
    allocatedBudget: 4200000,
    spentBudget: 2840000,
    iconName: 'Construction',
    color: '#3B82F6',
  },
  {
    id: 'dept-2',
    name: 'Sanitation & Waste',
    code: 'SWM-SAN',
    headName: 'Marcus Holloway',
    headEmail: 'marcus.h@smartcity.gov',
    phone: '+1 (555) 019-8812',
    officerCount: 5,
    activeIncidentsCount: 19,
    resolvedIncidentsCount: 310,
    slaComplianceRate: 98.2,
    avgResolutionHours: 6.4,
    allocatedBudget: 3100000,
    spentBudget: 2150000,
    iconName: 'Trash2',
    color: '#22C55E',
  },
  {
    id: 'dept-3',
    name: 'Water Supply & Drainage',
    code: 'WSD-HYD',
    headName: 'Priya Sharma',
    headEmail: 'priya.sharma@smartcity.gov',
    phone: '+1 (555) 019-4473',
    officerCount: 4,
    activeIncidentsCount: 16,
    resolvedIncidentsCount: 188,
    slaComplianceRate: 92.4,
    avgResolutionHours: 12.2,
    allocatedBudget: 3800000,
    spentBudget: 2600000,
    iconName: 'Droplets',
    color: '#06B6D4',
  },
  {
    id: 'dept-4',
    name: 'Electrical & Streetlights',
    code: 'ELE-PWR',
    headName: 'Elena Rostova',
    headEmail: 'elena.rostova@smartcity.gov',
    phone: '+1 (555) 019-9941',
    officerCount: 3,
    activeIncidentsCount: 9,
    resolvedIncidentsCount: 220,
    slaComplianceRate: 96.7,
    avgResolutionHours: 8.8,
    allocatedBudget: 2200000,
    spentBudget: 1420000,
    iconName: 'Zap',
    color: '#F59E0B',
  },
  {
    id: 'dept-5',
    name: 'Parks & Horticulture',
    code: 'PRK-ENV',
    headName: 'David K. O’Connor',
    headEmail: 'david.oc@smartcity.gov',
    phone: '+1 (555) 019-3382',
    officerCount: 2,
    activeIncidentsCount: 7,
    resolvedIncidentsCount: 94,
    slaComplianceRate: 94.1,
    avgResolutionHours: 24.0,
    allocatedBudget: 1500000,
    spentBudget: 890000,
    iconName: 'Trees',
    color: '#10B981',
  },
  {
    id: 'dept-6',
    name: 'Traffic & Transport',
    code: 'TRF-MOB',
    headName: 'Captain Robert Sterling',
    headEmail: 'robert.s@smartcity.gov',
    phone: '+1 (555) 019-7711',
    officerCount: 3,
    activeIncidentsCount: 11,
    resolvedIncidentsCount: 165,
    slaComplianceRate: 97.5,
    avgResolutionHours: 4.5,
    allocatedBudget: 2900000,
    spentBudget: 1980000,
    iconName: 'Navigation',
    color: '#8B5CF6',
  },
  {
    id: 'dept-7',
    name: 'Public Safety & Hazards',
    code: 'PSH-EMG',
    headName: 'Chief Sarah Lin',
    headEmail: 'sarah.lin@smartcity.gov',
    phone: '+1 (555) 019-9110',
    officerCount: 4,
    activeIncidentsCount: 8,
    resolvedIncidentsCount: 89,
    slaComplianceRate: 99.1,
    avgResolutionHours: 2.1,
    allocatedBudget: 3500000,
    spentBudget: 2400000,
    iconName: 'ShieldAlert',
    color: '#EF4444',
  },
  {
    id: 'dept-8',
    name: 'Building & Encroachment',
    code: 'BDG-ENC',
    headName: 'Alistair Vance',
    headEmail: 'alistair.v@smartcity.gov',
    phone: '+1 (555) 019-5561',
    officerCount: 2,
    activeIncidentsCount: 5,
    resolvedIncidentsCount: 58,
    slaComplianceRate: 88.0,
    avgResolutionHours: 48.0,
    allocatedBudget: 1800000,
    spentBudget: 1100000,
    iconName: 'Building2',
    color: '#EC4899',
  }
];

export const INITIAL_OFFICERS: Officer[] = [
  {
    id: 'off-1',
    name: 'Officer Jason Miller',
    badgeNumber: 'RDS-4091',
    department: 'Roads & Infrastructure',
    phone: '+1 (555) 431-8890',
    email: 'jason.miller@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 4 - Metro Hub',
    activeCases: 4,
    resolvedCases: 48,
    rating: 4.9,
    efficiencyScore: 97,
    status: 'In Field',
    currentLocation: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 'off-2',
    name: 'Inspector Meera Patel',
    badgeNumber: 'SAN-1022',
    department: 'Sanitation & Waste',
    phone: '+1 (555) 431-5521',
    email: 'meera.patel@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 2 - Market Square',
    activeCases: 3,
    resolvedCases: 92,
    rating: 4.95,
    efficiencyScore: 99,
    status: 'In Field',
    currentLocation: { lat: 37.7812, lng: -122.4101 }
  },
  {
    id: 'off-3',
    name: 'Engineer Alan Zhang',
    badgeNumber: 'WSD-3190',
    department: 'Water Supply & Drainage',
    phone: '+1 (555) 431-2983',
    email: 'alan.zhang@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 7 - South Bay',
    activeCases: 2,
    resolvedCases: 64,
    rating: 4.8,
    efficiencyScore: 94,
    status: 'On Duty',
    currentLocation: { lat: 37.7654, lng: -122.4289 }
  },
  {
    id: 'off-4',
    name: 'Sergeant Carlos Mendez',
    badgeNumber: 'ELE-8841',
    department: 'Electrical & Streetlights',
    phone: '+1 (555) 431-9011',
    email: 'carlos.mendez@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 1 - Cyber District',
    activeCases: 2,
    resolvedCases: 71,
    rating: 4.75,
    efficiencyScore: 92,
    status: 'In Field',
    currentLocation: { lat: 37.7892, lng: -122.4014 }
  },
  {
    id: 'off-5',
    name: 'Officer Aisha Al-Mansoor',
    badgeNumber: 'TRF-5509',
    department: 'Traffic & Transport',
    phone: '+1 (555) 431-7744',
    email: 'aisha.m@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 3 - Financial Plaza',
    activeCases: 3,
    resolvedCases: 55,
    rating: 4.88,
    efficiencyScore: 96,
    status: 'On Duty',
    currentLocation: { lat: 37.7925, lng: -122.3990 }
  },
  {
    id: 'off-6',
    name: 'Officer Nathan Hayes',
    badgeNumber: 'PSH-9012',
    department: 'Public Safety & Hazards',
    phone: '+1 (555) 431-3312',
    email: 'nathan.hayes@smartcity.gov',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    assignedWard: 'Ward 8 - University Quarter',
    activeCases: 1,
    resolvedCases: 38,
    rating: 4.92,
    efficiencyScore: 98,
    status: 'On Duty',
    currentLocation: { lat: 37.7712, lng: -122.4410 }
  }
];

export const INITIAL_WARDS: Ward[] = [
  {
    id: 'ward-1',
    name: 'Cyber District',
    number: 1,
    councillor: 'Hon. Amanda Chen',
    population: 84500,
    areaSqKm: 4.2,
    centerLat: 37.7892,
    centerLng: -122.4014,
    bounds: [[37.795, -122.410], [37.795, -122.395], [37.782, -122.395], [37.782, -122.410]],
    riskScore: 24,
    activeComplaints: 8,
    resolvedComplaints: 182,
    healthIndex: 94
  },
  {
    id: 'ward-2',
    name: 'Market Square & Old Town',
    number: 2,
    councillor: 'Hon. Rajiv Verma',
    population: 112000,
    areaSqKm: 3.8,
    centerLat: 37.7812,
    centerLng: -122.4101,
    bounds: [[37.788, -122.420], [37.788, -122.402], [37.774, -122.402], [37.774, -122.420]],
    riskScore: 68,
    activeComplaints: 19,
    resolvedComplaints: 240,
    healthIndex: 72
  },
  {
    id: 'ward-3',
    name: 'Financial Plaza',
    number: 3,
    councillor: 'Hon. Gregory Vance',
    population: 62000,
    areaSqKm: 2.9,
    centerLat: 37.7925,
    centerLng: -122.3990,
    bounds: [[37.798, -122.406], [37.798, -122.390], [37.786, -122.390], [37.786, -122.406]],
    riskScore: 18,
    activeComplaints: 5,
    resolvedComplaints: 195,
    healthIndex: 96
  },
  {
    id: 'ward-4',
    name: 'Metro Hub & Civic Center',
    number: 4,
    councillor: 'Hon. Fatima Zahra',
    population: 98000,
    areaSqKm: 4.5,
    centerLat: 37.7749,
    centerLng: -122.4194,
    bounds: [[37.782, -122.430], [37.782, -122.412], [37.768, -122.412], [37.768, -122.430]],
    riskScore: 74,
    activeComplaints: 26,
    resolvedComplaints: 215,
    healthIndex: 68
  },
  {
    id: 'ward-5',
    name: 'Harbor Point Industrial',
    number: 5,
    councillor: 'Hon. Viktor Petrov',
    population: 45000,
    areaSqKm: 6.8,
    centerLat: 37.7550,
    centerLng: -122.3850,
    bounds: [[37.768, -122.398], [37.768, -122.370], [37.742, -122.370], [37.742, -122.398]],
    riskScore: 62,
    activeComplaints: 14,
    resolvedComplaints: 110,
    healthIndex: 76
  },
  {
    id: 'ward-6',
    name: 'Green Valley Heights',
    number: 6,
    councillor: 'Hon. Laura Bailey',
    population: 71000,
    areaSqKm: 5.1,
    centerLat: 37.7600,
    centerLng: -122.4450,
    bounds: [[37.770, -122.460], [37.770, -122.432], [37.750, -122.432], [37.750, -122.460]],
    riskScore: 28,
    activeComplaints: 7,
    resolvedComplaints: 145,
    healthIndex: 91
  },
  {
    id: 'ward-7',
    name: 'South Bay Waterfront',
    number: 7,
    councillor: 'Hon. Diego Morales',
    population: 89000,
    areaSqKm: 4.9,
    centerLat: 37.7654,
    centerLng: -122.4289,
    bounds: [[37.774, -122.440], [37.774, -122.418], [37.756, -122.418], [37.756, -122.440]],
    riskScore: 81,
    activeComplaints: 22,
    resolvedComplaints: 160,
    healthIndex: 65
  },
  {
    id: 'ward-8',
    name: 'University & Arts Quarter',
    number: 8,
    councillor: 'Hon. Samuel Okafor',
    population: 93000,
    areaSqKm: 3.6,
    centerLat: 37.7712,
    centerLng: -122.4410,
    bounds: [[37.780, -122.452], [37.780, -122.430], [37.762, -122.430], [37.762, -122.452]],
    riskScore: 42,
    activeComplaints: 11,
    resolvedComplaints: 178,
    healthIndex: 85
  }
];

export const INITIAL_ANALYTICS: CityAnalytics = {
  totalComplaints: 1420,
  resolvedComplaints: 1314,
  activeComplaints: 96,
  criticalComplaints: 14,
  inProgressComplaints: 48,
  cityHealthScore: 88.4,
  aiTriageAccuracy: 96.8,
  avgResponseTimeHours: 4.2,
  duplicateComplaintsPrevented: 388,
  estimatedBudgetSaved: '$412,500',
  citizenSatisfactionRate: 94.2
};

export const INITIAL_CITIZEN_PROFILE: CitizenProfile = {
  id: 'cit-9921',
  name: 'Alexandre Mercer',
  email: 'alex.mercer@gmail.com',
  phone: '+1 (555) 782-9901',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  ward: 'Ward 4 - Metro Hub',
  karmaPoints: 1250,
  reputationRank: 'Civic Guardian Tier III',
  reportsSubmitted: 14,
  reportsResolved: 12,
  badges: [
    {
      id: 'b-1',
      title: 'Pothole Patrol',
      description: 'Reported 5 validated asphalt road defects',
      icon: 'ShieldCheck',
      unlockedAt: '2026-06-12'
    },
    {
      id: 'b-2',
      title: 'Green Guardian',
      description: 'Helped resolve 3 park and tree obstruction hazards',
      icon: 'Leaf',
      unlockedAt: '2026-07-04'
    },
    {
      id: 'b-3',
      title: 'AI Vision Scout',
      description: 'Achieved >95% AI verification accuracy on all photo uploads',
      icon: 'Eye',
      unlockedAt: '2026-08-01'
    }
  ]
};

// Preset Demo Images for Instant AI Vision Testing
interface PresetVisionSample {
  id: string;
  title: string;
  category: string;
  department: string;
  imageUrl: string;
  description: string;
  detectedObjects: DetectedObject[];
  severityScore: number;
  priorityScore: number;
  estimatedCost: string;
  estimatedResolutionTime: string;
  recommendedMaterials: string[];
  safetyRisk: string;
}

export const PRESET_VISION_SAMPLES: PresetVisionSample[] = [
  {
    id: 'sample-pothole',
    title: 'Severe Asphalt Pothole & Sub-base Failure',
    category: 'Potholes & Road Cracks',
    department: 'Roads & Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    description: 'Deep road crater spanning across westbound lane near pedestrian crossing. Exposing structural gravel layer.',
    detectedObjects: [
      { label: 'Deep Asphalt Crater', confidence: 0.97, bbox: [25, 20, 68, 78], severity: 'Critical' as const },
      { label: 'Crack Network Propagation', confidence: 0.92, bbox: [12, 10, 40, 90], severity: 'High' as const },
      { label: 'Sub-base Aggregate Exposure', confidence: 0.89, bbox: [40, 32, 60, 65], severity: 'Critical' as const }
    ],
    severityScore: 89,
    priorityScore: 94,
    estimatedCost: '$750 - $1,100',
    estimatedResolutionTime: '18 Hours',
    recommendedMaterials: ['Hot Mix Bitumen PG-70', 'Tack Emulsion Spray', 'Vibratory Plate Compaction'],
    safetyRisk: 'Severe risk of vehicle axle failure and cyclist overturn.'
  },
  {
    id: 'sample-garbage',
    title: 'Commercial Solid Waste Overflow & Spillage',
    category: 'Garbage & Waste',
    department: 'Sanitation & Waste',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    description: 'Municipal dumpster exceeded capacity by 200%. Organic and recyclable waste spilling over sidewalk and gutter.',
    detectedObjects: [
      { label: 'Dumpster Overflow Spillage', confidence: 0.98, bbox: [20, 15, 82, 85], severity: 'High' as const },
      { label: 'Single-Use Plastic Waste', confidence: 0.94, bbox: [50, 22, 78, 55], severity: 'Medium' as const },
      { label: 'Drain Ingress Hazard', confidence: 0.88, bbox: [65, 45, 88, 80], severity: 'High' as const }
    ],
    severityScore: 76,
    priorityScore: 82,
    estimatedCost: '$220 - $350',
    estimatedResolutionTime: '4 Hours',
    recommendedMaterials: ['Compactor Truck Dispatch', 'Disinfectant Bleach Wash', 'Secondary 1100L Bin Deployment'],
    safetyRisk: 'Public health bio-hazard and rodent infestation risk.'
  },
  {
    id: 'sample-water',
    title: 'High-Pressure Potable Water Main Fracture',
    category: 'Water Leakage & Drainage',
    department: 'Water Supply & Drainage',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
    description: 'Subsurface pipe rupture causing continuous potable water geyser and localized road flooding.',
    detectedObjects: [
      { label: 'High Pressure Water Geyser', confidence: 0.96, bbox: [30, 25, 75, 70], severity: 'Critical' as const },
      { label: 'Pavement Subsurface Washout', confidence: 0.91, bbox: [55, 18, 85, 88], severity: 'High' as const }
    ],
    severityScore: 92,
    priorityScore: 98,
    estimatedCost: '$1,400 - $2,200',
    estimatedResolutionTime: '6 Hours',
    recommendedMaterials: ['Cast Iron Mechanical Coupler', 'Pneumatic Excavation Rig', 'Backfill Slurry'],
    safetyRisk: 'Massive loss of treated water and risk of road sinkhole formation.'
  },
  {
    id: 'sample-streetlight',
    title: 'Damaged LED Luminaire & Exposed Wiring',
    category: 'Streetlight & Electrical',
    department: 'Electrical & Streetlights',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    description: 'Light pole head damaged with dangling live wiring accessible to pedestrians during wet conditions.',
    detectedObjects: [
      { label: 'Exposed 220V Conductors', confidence: 0.95, bbox: [15, 30, 50, 68], severity: 'Critical' as const },
      { label: 'Luminaire Casing Fracture', confidence: 0.91, bbox: [10, 25, 38, 75], severity: 'Medium' as const }
    ],
    severityScore: 84,
    priorityScore: 90,
    estimatedCost: '$380 - $550',
    estimatedResolutionTime: '8 Hours',
    recommendedMaterials: ['LED 150W Luminaire Module', 'Heat-Shrink Insulated Joint', 'Hydraulic Bucket Lift'],
    safetyRisk: 'Electrocution hazard and zero nighttime visibility at junction.'
  },
  {
    id: 'sample-tree',
    title: 'Storm-Fallen Timber Blocking Transit Corridor',
    category: 'Fallen Tree & Hazard',
    department: 'Parks & Horticulture',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    description: 'Mature elm tree uprooted by gale-force winds, crushing street signage and blocking two primary lanes.',
    detectedObjects: [
      { label: 'Uprooted Trunk Obstruction', confidence: 0.97, bbox: [22, 10, 80, 90], severity: 'Critical' as const },
      { label: 'Crushed Municipal Signage', confidence: 0.88, bbox: [60, 45, 82, 75], severity: 'Medium' as const }
    ],
    severityScore: 86,
    priorityScore: 95,
    estimatedCost: '$600 - $950',
    estimatedResolutionTime: '3 Hours',
    recommendedMaterials: ['Commercial Chainsaw Unit', 'Wood Chipper Trailer', 'Crane Rig'],
    safetyRisk: 'Complete blockage of emergency vehicle arterial corridor.'
  },
  {
    id: 'sample-drain',
    title: 'Uncovered Stormwater Catch Basin (Deep Fall Hazard)',
    category: 'Open Drain',
    department: 'Water Supply & Drainage',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    description: 'Manhole grating dislodged/stolen. 2.4m deep open vertical shaft directly adjacent to school footpath.',
    detectedObjects: [
      { label: 'Open Storm Drain Shaft', confidence: 0.99, bbox: [32, 28, 72, 68], severity: 'Critical' as const },
      { label: 'Missing Cast Grating', confidence: 0.95, bbox: [25, 20, 78, 75], severity: 'Critical' as const }
    ],
    severityScore: 96,
    priorityScore: 100,
    estimatedCost: '$450 - $700',
    estimatedResolutionTime: '2 Hours',
    recommendedMaterials: ['Ductile Iron Locking Manhole Cover', 'Epoxy Mortar Collar', 'Reflective Hazard Barricade'],
    safetyRisk: 'Extreme fatality/injury risk for pedestrians and cyclists.'
  }
];

// Rich Seed Incidents (120+ Incidents with full GIS and AI metadata)
export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-8801',
    title: 'Severe Asphalt Pothole & Sub-base Fracture',
    description: 'Large 1.8m crater on Market St eastbound corridor causing severe traffic deceleration and wheel rim damage.',
    category: 'Potholes & Road Cracks',
    department: 'Roads & Infrastructure',
    severity: 'Critical',
    severityScore: 89,
    priority: 'Immediate Action',
    priorityScore: 94,
    status: 'In Progress',
    latitude: 37.7812,
    longitude: -122.4101,
    address: '742 Market St, Market Square',
    ward: 'Ward 2 - Market Square',
    area: 'Central Commercial Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.97,
    detectedObjects: [
      { label: 'Deep Asphalt Crater', confidence: 0.97, bbox: [25, 20, 68, 78], severity: 'Critical' },
      { label: 'Crack Network Propagation', confidence: 0.92, bbox: [12, 10, 40, 90], severity: 'High' }
    ],
    estimatedCost: '$750 - $1,100',
    estimatedResolutionTime: '18 Hours',
    recommendedMaterials: ['Hot Mix Bitumen PG-70', 'Tack Emulsion Spray', 'Vibratory Plate Compaction'],
    safetyRiskLevel: 'Severe risk of vehicle axle failure and cyclist overturn.',
    aiSummary: 'High-traffic commercial road defect with active aggregate loosening. AI automated priority level raised due to peak hour bus route overlap.',
    citizenId: 'cit-9921',
    citizenName: 'Alexandre Mercer',
    citizenPhone: '+1 (555) 782-9901',
    createdAt: '2026-08-15T08:30:00Z',
    updatedAt: '2026-08-15T11:15:00Z',
    duplicateCount: 24,
    duplicateIncidentIds: ['DUP-101', 'DUP-102', 'DUP-103'],
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Officer Jason Miller',
    assignedOfficerPhone: '+1 (555) 431-8890',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T08:30:00Z',
        title: 'Incident Reported',
        description: 'Citizen submitted image report via CivicLens Mobile Portal.',
        actor: 'Alexandre Mercer',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-15T08:30:04Z',
        title: 'AI Computer Vision Triaged',
        description: 'YOLOv11 & Gemini Neural Engine classified defect with 97% confidence. Severity score 89/100.',
        actor: 'CivicLens AI Vision',
        role: 'AI System',
        statusChangedTo: 'Assigned'
      },
      {
        id: 't-3',
        timestamp: '2026-08-15T09:10:00Z',
        title: 'Officer Dispatched',
        description: 'Assigned to Officer Jason Miller (PWD Road Unit 4). Crew en route with hot-asphalt repair rig.',
        actor: 'Command Center',
        role: 'Dispatcher',
        statusChangedTo: 'In Progress'
      }
    ]
  },
  {
    id: 'INC-2026-8802',
    title: 'Commercial Solid Waste Overflow & Drain Ingress',
    description: 'Triple dumpster overflow blocking pedestrian walkway and washing into stormwater drain.',
    category: 'Garbage & Waste',
    department: 'Sanitation & Waste',
    severity: 'High',
    severityScore: 78,
    priority: 'High',
    priorityScore: 84,
    status: 'Assigned',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '1200 Van Ness Ave, Metro Hub',
    ward: 'Ward 4 - Metro Hub',
    area: 'Civic Transit Center',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.98,
    detectedObjects: [
      { label: 'Dumpster Overflow Spillage', confidence: 0.98, bbox: [20, 15, 82, 85], severity: 'High' },
      { label: 'Single-Use Plastic Waste', confidence: 0.94, bbox: [50, 22, 78, 55], severity: 'Medium' }
    ],
    estimatedCost: '$220 - $350',
    estimatedResolutionTime: '4 Hours',
    recommendedMaterials: ['Compactor Truck Dispatch', 'Disinfectant Bleach Wash'],
    safetyRiskLevel: 'Public health bio-hazard and drain clog risk.',
    aiSummary: 'Major commercial garbage accumulation with drain contamination threat. Smart route optimization triggered.',
    citizenId: 'cit-1044',
    citizenName: 'Maya Lin',
    citizenPhone: '+1 (555) 302-1199',
    createdAt: '2026-08-15T09:15:00Z',
    updatedAt: '2026-08-15T09:20:00Z',
    duplicateCount: 16,
    assignedOfficerId: 'off-2',
    assignedOfficerName: 'Inspector Meera Patel',
    assignedOfficerPhone: '+1 (555) 431-5521',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T09:15:00Z',
        title: 'Incident Logged',
        description: 'Citizen report with photo uploaded.',
        actor: 'Maya Lin',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-15T09:15:02Z',
        title: 'AI Smart Category Assignment',
        description: 'Assigned to Sanitation & Solid Waste Department with High Priority.',
        actor: 'CivicLens AI',
        role: 'AI System',
        statusChangedTo: 'Assigned'
      }
    ]
  },
  {
    id: 'INC-2026-8803',
    title: 'High-Pressure Potable Water Main Rupture',
    description: 'Subsurface pipe burst producing high water geyser; localized street inundation.',
    category: 'Water Leakage & Drainage',
    department: 'Water Supply & Drainage',
    severity: 'Critical',
    severityScore: 94,
    priority: 'Immediate Action',
    priorityScore: 98,
    status: 'In Progress',
    latitude: 37.7654,
    longitude: -122.4289,
    address: '450 Mission Bay Blvd S, South Bay',
    ward: 'Ward 7 - South Bay',
    area: 'Waterfront District',
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.96,
    detectedObjects: [
      { label: 'High Pressure Water Geyser', confidence: 0.96, bbox: [30, 25, 75, 70], severity: 'Critical' }
    ],
    estimatedCost: '$1,400 - $2,200',
    estimatedResolutionTime: '6 Hours',
    recommendedMaterials: ['Cast Iron Mechanical Coupler', 'Pneumatic Excavation Rig'],
    safetyRiskLevel: 'Risk of roadway structural collapse and drinking water loss.',
    aiSummary: 'Critical infrastructure rupture. Automated valve isolation telemetry alert transmitted to Water Board.',
    citizenId: 'cit-3091',
    citizenName: 'Devon Vance',
    createdAt: '2026-08-15T07:45:00Z',
    updatedAt: '2026-08-15T08:00:00Z',
    duplicateCount: 42,
    assignedOfficerId: 'off-3',
    assignedOfficerName: 'Engineer Alan Zhang',
    assignedOfficerPhone: '+1 (555) 431-2983',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T07:45:00Z',
        title: 'Emergency Report',
        description: 'Reported by multiple citizens and IoT pressure sensor anomaly.',
        actor: 'Devon Vance',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-15T07:48:00Z',
        title: 'Emergency Crew Deployed',
        description: 'Hydraulics crew dispatched with emergency valve shutoff keys.',
        actor: 'Command Center',
        role: 'Dispatcher',
        statusChangedTo: 'In Progress'
      }
    ]
  },
  {
    id: 'INC-2026-8804',
    title: 'Uncovered Storm Drain Shaft near Elementary School',
    description: 'Hazardous uncovered storm sewer grate posing severe pedestrian safety risk right outside elementary school boundary.',
    category: 'Open Drain',
    department: 'Water Supply & Drainage',
    severity: 'Critical',
    severityScore: 98,
    priority: 'Immediate Action',
    priorityScore: 100,
    status: 'Resolved',
    latitude: 37.7712,
    longitude: -122.4410,
    address: '88 Cole St, University Quarter',
    ward: 'Ward 8 - University Quarter',
    area: 'Academic Park',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    repairImageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.99,
    detectedObjects: [
      { label: 'Open Storm Drain Shaft', confidence: 0.99, bbox: [32, 28, 72, 68], severity: 'Critical' }
    ],
    estimatedCost: '$450 - $700',
    estimatedResolutionTime: '2 Hours',
    recommendedMaterials: ['Ductile Iron Locking Manhole Cover', 'Epoxy Mortar Collar'],
    safetyRiskLevel: 'Extreme fatality/injury risk.',
    aiSummary: 'Critical open vertical shaft near school zone. Instant escalation successfully resolved within SLA.',
    citizenId: 'cit-9921',
    citizenName: 'Alexandre Mercer',
    createdAt: '2026-08-14T14:20:00Z',
    updatedAt: '2026-08-14T16:05:00Z',
    resolvedAt: '2026-08-14T16:05:00Z',
    resolutionNotes: 'Heavy-duty ductile iron locking cover installed and anchored with rapid-cure epoxy mortar. Barricades removed after inspection.',
    citizenSatisfactionRating: 5,
    citizenFeedback: 'Incredible response speed! Replaced within 2 hours of posting.',
    duplicateCount: 18,
    assignedOfficerId: 'off-3',
    assignedOfficerName: 'Engineer Alan Zhang',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-14T14:20:00Z',
        title: 'Hazard Reported',
        description: 'Reported by citizen Alexandre Mercer with high urgency.',
        actor: 'Alexandre Mercer',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-14T14:21:00Z',
        title: 'Auto-Triage Emergency SOS',
        description: 'Open drain near school auto-flagged for 2-hour SLA response.',
        actor: 'CivicLens AI',
        role: 'AI System',
        statusChangedTo: 'Assigned'
      },
      {
        id: 't-3',
        timestamp: '2026-08-14T16:05:00Z',
        title: 'Work Completed & Verified',
        description: 'Officer uploaded repair proof photo. AI Vision confirmed locking cover in place.',
        actor: 'Engineer Alan Zhang',
        role: 'Officer',
        statusChangedTo: 'Resolved'
      }
    ]
  },
  {
    id: 'INC-2026-8805',
    title: 'High-Mast LED Streetlight Blackout & Dangling Cable',
    description: 'Pole #44-E luminaire dropped due to rusted bracket; exposed cabling hanging 1.9m from grade.',
    category: 'Streetlight & Electrical',
    department: 'Electrical & Streetlights',
    severity: 'High',
    severityScore: 82,
    priority: 'High',
    priorityScore: 88,
    status: 'In Progress',
    latitude: 37.7892,
    longitude: -122.4014,
    address: '350 Pine St, Cyber District',
    ward: 'Ward 1 - Cyber District',
    area: 'Tech Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.95,
    detectedObjects: [
      { label: 'Exposed 220V Conductors', confidence: 0.95, bbox: [15, 30, 50, 68], severity: 'Critical' }
    ],
    estimatedCost: '$380 - $550',
    estimatedResolutionTime: '8 Hours',
    recommendedMaterials: ['LED 150W Luminaire Module', 'Heat-Shrink Insulated Joint'],
    safetyRiskLevel: 'Shock hazard and zero street illuminance.',
    aiSummary: 'Damaged electrical head with hanging low-clearance cabling.',
    citizenId: 'cit-4412',
    citizenName: 'Tariq Johnson',
    createdAt: '2026-08-15T02:10:00Z',
    updatedAt: '2026-08-15T08:45:00Z',
    duplicateCount: 9,
    assignedOfficerId: 'off-4',
    assignedOfficerName: 'Sergeant Carlos Mendez',
    assignedOfficerPhone: '+1 (555) 431-9011',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T02:10:00Z',
        title: 'Night Patrol Report',
        description: 'Reported during night shift.',
        actor: 'Tariq Johnson',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-15T08:45:00Z',
        title: 'Bucket Truck Dispatched',
        description: 'Electrical maintenance truck on site replacing bracket.',
        actor: 'Sergeant Carlos Mendez',
        role: 'Officer',
        statusChangedTo: 'In Progress'
      }
    ]
  },
  {
    id: 'INC-2026-8806',
    title: 'Storm-Uprooted Oak Blocking Dual Lanes',
    description: 'Severe thunderstorm uprooted 40-year old oak tree, crushing street parking meter and blocking transit.',
    category: 'Fallen Tree & Hazard',
    department: 'Parks & Horticulture',
    severity: 'Critical',
    severityScore: 88,
    priority: 'Immediate Action',
    priorityScore: 96,
    status: 'In Progress',
    latitude: 37.7600,
    longitude: -122.4450,
    address: '1420 Clayton St, Green Valley',
    ward: 'Ward 6 - Green Valley Heights',
    area: 'Hillside Corridor',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.97,
    detectedObjects: [
      { label: 'Uprooted Trunk Obstruction', confidence: 0.97, bbox: [22, 10, 80, 90], severity: 'Critical' }
    ],
    estimatedCost: '$600 - $950',
    estimatedResolutionTime: '3 Hours',
    recommendedMaterials: ['Commercial Chainsaw Unit', 'Wood Chipper Trailer'],
    safetyRiskLevel: 'Total lane obstruction.',
    aiSummary: 'Large tree fall obstructing transit corridor. Heavy machinery dispatched.',
    citizenId: 'cit-5501',
    citizenName: 'Claire Redfield',
    createdAt: '2026-08-15T06:15:00Z',
    updatedAt: '2026-08-15T07:00:00Z',
    duplicateCount: 31,
    assignedOfficerId: 'off-6',
    assignedOfficerName: 'Officer Nathan Hayes',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T06:15:00Z',
        title: 'Emergency Tree Hazard',
        description: 'Citizen report submitted.',
        actor: 'Claire Redfield',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-15T07:00:00Z',
        title: 'Emergency Chainsaw Crew Assigned',
        description: 'Horticulture crew active on site cutting branches.',
        actor: 'Command Center',
        role: 'Dispatcher',
        statusChangedTo: 'In Progress'
      }
    ]
  },
  {
    id: 'INC-2026-8807',
    title: 'Broken Traffic Signal Optical Controller (Flashing Red Loop)',
    description: 'Major 4-way intersection signal stuck in cycling fault mode causing gridlock across both boulevards.',
    category: 'Traffic Signal Damage',
    department: 'Traffic & Transport',
    severity: 'High',
    severityScore: 85,
    priority: 'Immediate Action',
    priorityScore: 92,
    status: 'Assigned',
    latitude: 37.7925,
    longitude: -122.3990,
    address: 'Intersection of California & Battery St',
    ward: 'Ward 3 - Financial Plaza',
    area: 'Downtown Financial Center',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.94,
    detectedObjects: [
      { label: 'Faulty Signal Controller', confidence: 0.94, bbox: [20, 30, 60, 70], severity: 'High' }
    ],
    estimatedCost: '$500 - $850',
    estimatedResolutionTime: '2 Hours',
    recommendedMaterials: ['Solid State Traffic Controller Card', 'Firmware Reset Unit'],
    safetyRiskLevel: 'Intersection collision hazard.',
    aiSummary: 'Critical intersection controller fault with morning rush hour traffic impact.',
    citizenId: 'cit-7711',
    citizenName: 'Kenneth Branagh',
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-08-15T08:10:00Z',
    duplicateCount: 15,
    assignedOfficerId: 'off-5',
    assignedOfficerName: 'Officer Aisha Al-Mansoor',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T08:00:00Z',
        title: 'Signal Malfunction Reported',
        description: 'Automated AI categorization routed to Traffic Division.',
        actor: 'Kenneth Branagh',
        role: 'Citizen',
        statusChangedTo: 'Assigned'
      }
    ]
  },
  {
    id: 'INC-2026-8808',
    title: 'Illegal Concrete Debris & Construction Dumping',
    description: 'Approx 3 cubic tons of demolition rubble, exposed rebar and broken bricks illegally dumped in alleyway.',
    category: 'Construction Waste',
    department: 'Building & Encroachment',
    severity: 'Medium',
    severityScore: 62,
    priority: 'Normal',
    priorityScore: 65,
    status: 'Pending',
    latitude: 37.7550,
    longitude: -122.3850,
    address: '890 Illinois St, Harbor Point',
    ward: 'Ward 5 - Harbor Point Industrial',
    area: 'Industrial Waterfront',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.93,
    detectedObjects: [
      { label: 'Demolition Concrete Rubble', confidence: 0.93, bbox: [30, 20, 85, 80], severity: 'Medium' }
    ],
    estimatedCost: '$650 - $1,000',
    estimatedResolutionTime: '24 Hours',
    recommendedMaterials: ['Bobcat Skid-Steer Loader', 'Dump Truck Haulage'],
    safetyRiskLevel: 'Tire puncture hazard and alleyway passage blockage.',
    aiSummary: 'Unsanctioned industrial demolition dumping. Enforcement notice generated.',
    citizenId: 'cit-2020',
    citizenName: 'Leon Kennedy',
    createdAt: '2026-08-15T07:10:00Z',
    updatedAt: '2026-08-15T07:10:00Z',
    duplicateCount: 4,
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-15T07:10:00Z',
        title: 'Incident Logged',
        description: 'Citizen report with photo submitted.',
        actor: 'Leon Kennedy',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      }
    ]
  },
  {
    id: 'INC-2026-8809',
    title: 'Pedestrian Sidewalk Concrete Heave & Trip Hazard',
    description: 'Tree roots lifted sidewalk slabs by 12cm directly outside senior healthcare center.',
    category: 'Broken Footpath',
    department: 'Roads & Infrastructure',
    severity: 'High',
    severityScore: 79,
    priority: 'High',
    priorityScore: 83,
    status: 'Resolved',
    latitude: 37.7892,
    longitude: -122.4014,
    address: '600 Bush St, Cyber District',
    ward: 'Ward 1 - Cyber District',
    area: 'Medical & Commercial Zone',
    imageUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=800&auto=format&fit=crop&q=80',
    repairImageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
    aiConfidence: 0.96,
    detectedObjects: [
      { label: 'Sidewalk Concrete Heave', confidence: 0.96, bbox: [25, 25, 75, 75], severity: 'High' }
    ],
    estimatedCost: '$450 - $700',
    estimatedResolutionTime: '12 Hours',
    recommendedMaterials: ['Concrete Grinder', 'Precast Slab Leveling Shims'],
    safetyRiskLevel: 'Severe trip and fall risk for elderly pedestrians.',
    aiSummary: 'Pedestrian pavement displacement near medical facility. Grinding and leveling completed.',
    citizenId: 'cit-9921',
    citizenName: 'Alexandre Mercer',
    createdAt: '2026-08-13T10:00:00Z',
    updatedAt: '2026-08-13T16:30:00Z',
    resolvedAt: '2026-08-13T16:30:00Z',
    resolutionNotes: 'Root barrier installed; concrete surface ground smooth with non-slip polymer bevel.',
    citizenSatisfactionRating: 5,
    citizenFeedback: 'Quick fix, smooth transition now for wheelchairs.',
    duplicateCount: 11,
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Officer Jason Miller',
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-08-13T10:00:00Z',
        title: 'Report Submitted',
        description: 'Citizen report received.',
        actor: 'Alexandre Mercer',
        role: 'Citizen',
        statusChangedTo: 'Pending'
      },
      {
        id: 't-2',
        timestamp: '2026-08-13T16:30:00Z',
        title: 'Repair Complete',
        description: 'Pavement leveling verified by field inspector.',
        actor: 'Officer Jason Miller',
        role: 'Officer',
        statusChangedTo: 'Resolved'
      }
    ]
  }
];

// Generate extra realistic mock incidents to reach over 110 items
function generateRichMockIncidents(): Incident[] {
  const categories = [
    { cat: 'Potholes & Road Cracks', dept: 'Roads & Infrastructure', sev: 'Critical' as const, sevScore: 86, pri: 'Immediate Action' as const, priScore: 92, cost: '$650 - $950', time: '18 Hours', img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Garbage & Waste', dept: 'Sanitation & Waste', sev: 'High' as const, sevScore: 74, pri: 'High' as const, priScore: 80, cost: '$200 - $350', time: '4 Hours', img: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Water Leakage & Drainage', dept: 'Water Supply & Drainage', sev: 'High' as const, sevScore: 81, pri: 'High' as const, priScore: 85, cost: '$900 - $1,400', time: '8 Hours', img: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Streetlight & Electrical', dept: 'Electrical & Streetlights', sev: 'Medium' as const, sevScore: 65, pri: 'Normal' as const, priScore: 70, cost: '$300 - $450', time: '12 Hours', img: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Fallen Tree & Hazard', dept: 'Parks & Horticulture', sev: 'Critical' as const, sevScore: 89, pri: 'Immediate Action' as const, priScore: 95, cost: '$550 - $850', time: '4 Hours', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Open Drain', dept: 'Water Supply & Drainage', sev: 'Critical' as const, sevScore: 95, pri: 'Immediate Action' as const, priScore: 98, cost: '$400 - $600', time: '3 Hours', img: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Traffic Signal Damage', dept: 'Traffic & Transport', sev: 'High' as const, sevScore: 84, pri: 'Immediate Action' as const, priScore: 90, cost: '$500 - $800', time: '2 Hours', img: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80' },
    { cat: 'Construction Waste', dept: 'Building & Encroachment', sev: 'Medium' as const, sevScore: 58, pri: 'Normal' as const, priScore: 60, cost: '$600 - $900', time: '24 Hours', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80' }
  ];

  const statuses: ('Pending' | 'Assigned' | 'In Progress' | 'Resolved')[] = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'In Progress', 'Resolved', 'Resolved'];
  const streets = ['Montgomery St', 'Geary Blvd', 'Folsom St', 'Howard St', 'Valencia St', 'Mission St', 'Columbus Ave', 'Broadway', 'Lombard St', 'Embarcadero', 'Kearny St', 'Third St'];
  const citizens = ['Liam Davies', 'Sophia Rossi', 'Noah Kim', 'Emma Watson', 'Lucas Silva', 'Isabella Garcia', 'Ethan Hunt', 'Mia Tanaka', 'Oliver Queen', 'Harper Lee'];

  const results: Incident[] = [...INITIAL_INCIDENTS];

  for (let i = 10; i <= 115; i++) {
    const ward = INITIAL_WARDS[i % INITIAL_WARDS.length];
    const catItem = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const street = streets[i % streets.length];
    const citizen = citizens[i % citizens.length];
    const officer = INITIAL_OFFICERS[i % INITIAL_OFFICERS.length];
    
    // Spread coordinates around ward center
    const lat = ward.centerLat + (Math.sin(i * 1.5) * 0.008);
    const lng = ward.centerLng + (Math.cos(i * 1.5) * 0.008);
    
    const day = (i % 28) + 1;
    const hour = (i * 3) % 24;
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}T${hour < 10 ? '0' + hour : hour}:15:00Z`;

    results.push({
      id: `INC-2026-${8800 + i}`,
      title: `${catItem.cat} - ${street}`,
      description: `Reported civic defect regarding ${catItem.cat.toLowerCase()} in ${ward.name}. Requires municipal inspection and dispatch.`,
      category: catItem.cat,
      department: catItem.dept,
      severity: catItem.sev,
      severityScore: Math.min(100, Math.max(30, catItem.sevScore + ((i % 11) - 5))),
      priority: catItem.pri,
      priorityScore: Math.min(100, Math.max(40, catItem.priScore + ((i % 7) - 3))),
      status: status,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      address: `${100 + (i * 15)} ${street}, ${ward.name}`,
      ward: `Ward ${ward.number} - ${ward.name}`,
      area: `${ward.name} Sector ${1 + (i % 4)}`,
      imageUrl: catItem.img,
      repairImageUrl: status === 'Resolved' ? 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80' : undefined,
      aiConfidence: Number((0.91 + ((i % 8) * 0.01)).toFixed(2)),
      detectedObjects: [
        { label: catItem.cat, confidence: 0.94, bbox: [25, 20, 75, 80], severity: catItem.sev }
      ],
      estimatedCost: catItem.cost,
      estimatedResolutionTime: catItem.time,
      recommendedMaterials: ['Standard Municipal Repair Kit', 'Field Barricades'],
      safetyRiskLevel: 'Monitored municipal safety issue.',
      aiSummary: `AI auto-triaged and assigned to ${catItem.dept}. Location verified in ${ward.name}.`,
      citizenId: `cit-${3000 + i}`,
      citizenName: citizen,
      createdAt: dateStr,
      updatedAt: dateStr,
      resolvedAt: status === 'Resolved' ? `2026-08-01T12:00:00Z` : undefined,
      resolutionNotes: status === 'Resolved' ? 'Standard repair procedure completed and verified by ward inspector.' : undefined,
      citizenSatisfactionRating: status === 'Resolved' ? 4 + (i % 2) : undefined,
      duplicateCount: (i % 6) * 3 + 1,
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
      timeline: [
        {
          id: `t-${i}-1`,
          timestamp: dateStr,
          title: 'Incident Logged',
          description: 'Citizen report received with GPS coordinates.',
          actor: citizen,
          role: 'Citizen',
          statusChangedTo: 'Pending'
        },
        {
          id: `t-${i}-2`,
          timestamp: dateStr,
          title: 'AI Triage & Routing',
          description: `Dispatched to ${catItem.dept}. Priority: ${catItem.pri}.`,
          actor: 'CivicLens AI',
          role: 'AI System',
          statusChangedTo: status === 'Pending' ? 'Pending' : 'Assigned'
        }
      ]
    });
  }

  return results;
}

export const ALL_MOCK_INCIDENTS = generateRichMockIncidents();

export const PREDICTIVE_HOTSPOTS: PredictiveHotspot[] = [
  {
    id: 'pred-1',
    title: 'Monsoon Flash-Flood & Drain Siltation Inundation',
    type: 'flood',
    ward: 'Ward 7 - South Bay',
    riskProbability: 88,
    forecastDate: '2026-08-20',
    factors: [
      'High tide convergence during expected 45mm/hr precipitation event',
      'Historic 62% silt blockage in underground Storm Interceptor B',
      'Low topographic elevation (1.2m above sea datum)'
    ],
    recommendedPreventativeAction: 'Deploy high-velocity suction silt excavators to clear Interceptor B within 72 hours. Stage mobile dewatering pumps at Marina Pier.',
    potentialCostAvoidance: '$85,000 in commercial property flood damage',
    coordinates: { lat: 37.7654, lng: -122.4289 }
  },
  {
    id: 'pred-2',
    title: 'Weekend Nightlife Solid Waste Spillover Surge',
    type: 'garbage',
    ward: 'Ward 2 - Market Square',
    riskProbability: 82,
    forecastDate: '2026-08-22',
    factors: [
      'Scheduled 30,000-attendee Food & Arts Festival on 4th & Market',
      'Existing bin volumetric capacity only accommodates 1,200L/hr',
      'High wind dispersion vector towards pedestrian mall'
    ],
    recommendedPreventativeAction: 'Position 12 additional 1100L heavy-duty wheelie bins and schedule two dedicated 2:00 AM compactor sweep passes.',
    potentialCostAvoidance: 'Prevents 60+ duplicate citizen complaints and storm drain contamination',
    coordinates: { lat: 37.7812, lng: -122.4101 }
  },
  {
    id: 'pred-3',
    title: 'Bus Corridor Bitumen Shear & Fatigue Pothole Formation',
    type: 'road_wear',
    ward: 'Ward 4 - Metro Hub',
    riskProbability: 79,
    forecastDate: '2026-08-28',
    factors: [
      'Heavy 18-ton articulated electric bus deceleration strain at 8 bus bays',
      'Subsurface acoustic vibration sensor reports micro-fracture network expansion of 14% week-over-week'
    ],
    recommendedPreventativeAction: 'Execute micro-surfacing polymer slurry seal overnight before asphalt sub-base delaminates.',
    potentialCostAvoidance: '$42,000 vs emergency deep pavement milling',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  }
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: 'notif-1',
    title: '🚨 Critical Open Drain Resolved',
    message: 'Ward 8 open drain near Cole St has been secured with heavy ductile cover within 1h 45m.',
    category: 'critical',
    timestamp: '10 mins ago',
    read: false,
    incidentId: 'INC-2026-8804'
  },
  {
    id: 'notif-2',
    title: '🤖 AI Duplicate Merge Alert',
    message: 'Merged 24 citizen reports for Market St Pothole into master case #INC-2026-8801. 24 notification SMS dispatched.',
    category: 'duplicate',
    timestamp: '25 mins ago',
    read: false,
    incidentId: 'INC-2026-8801'
  },
  {
    id: 'notif-3',
    title: '👮 Officer Dispatched',
    message: 'Officer Jason Miller assigned to Van Ness Ave road hazard.',
    category: 'assignment',
    timestamp: '45 mins ago',
    read: true,
    incidentId: 'INC-2026-8802'
  },
  {
    id: 'notif-4',
    title: '⛈️ Monsoon Risk Warning Triggered',
    message: 'Ward 7 South Bay predictive model crossed 88% flood probability threshold.',
    category: 'system',
    timestamp: '2 hours ago',
    read: true
  }
];
