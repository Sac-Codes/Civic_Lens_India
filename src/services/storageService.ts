import { Incident, Department, Officer, Ward, CityAnalytics, CitizenProfile, ActivityNotification, PredictiveHotspot } from '../types';
import { ALL_MOCK_INCIDENTS, INITIAL_DEPARTMENTS, INITIAL_OFFICERS, INITIAL_WARDS, INITIAL_ANALYTICS, INITIAL_CITIZEN_PROFILE, INITIAL_NOTIFICATIONS, PREDICTIVE_HOTSPOTS } from '../data/mockData';

const INCIDENTS_KEY = 'civiclens_incidents_v2';
const CITIZEN_KEY = 'civiclens_citizen_profile_v2';
const NOTIFICATIONS_KEY = 'civiclens_notifications_v2';

export function getStoredIncidents(): Incident[] {
  try {
    const raw = localStorage.getItem(INCIDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to read incidents from localStorage', e);
  }
  return ALL_MOCK_INCIDENTS;
}

export function saveStoredIncidents(incidents: Incident[]): void {
  try {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  } catch (e) {
    console.error('Failed to save incidents to localStorage', e);
  }
}

export function getStoredCitizenProfile(): CitizenProfile {
  try {
    const raw = localStorage.getItem(CITIZEN_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read citizen profile', e);
  }
  return INITIAL_CITIZEN_PROFILE;
}

export function saveStoredCitizenProfile(profile: CitizenProfile): void {
  try {
    localStorage.setItem(CITIZEN_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save citizen profile', e);
  }
}

export function getStoredNotifications(): ActivityNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveStoredNotifications(notifs: ActivityNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

// Distance Calculation (Haversine formula in meters)
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Duplicate Detection: Checks if an existing active complaint exists within 300m of the same category
export function findPotentialDuplicate(
  incidents: Incident[],
  lat: number,
  lng: number,
  category: string,
  thresholdMeters = 350
): Incident | null {
  for (const inc of incidents) {
    if (inc.status !== 'Resolved' && inc.status !== 'Rejected') {
      const isSimilarCategory =
        inc.category.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(inc.category.toLowerCase());

      if (isSimilarCategory) {
        const dist = calculateDistanceMeters(lat, lng, inc.latitude, inc.longitude);
        if (dist <= thresholdMeters) {
          return inc;
        }
      }
    }
  }
  return null;
}

// Generate CSV export string
export function exportIncidentsToCsv(incidents: Incident[]): string {
  const headers = [
    'Complaint ID',
    'Citizen ID',
    'Citizen Name',
    'Date',
    'Category',
    'Department',
    'Priority',
    'Severity',
    'Severity Score',
    'Status',
    'Ward',
    'Address',
    'Latitude',
    'Longitude',
    'Assigned Officer',
    'Estimated Cost',
    'Estimated Resolution Time',
    'AI Confidence',
    'Duplicate Reports Count'
  ];

  const rows = incidents.map((inc) => [
    `"${inc.id}"`,
    `"${inc.citizenId}"`,
    `"${inc.citizenName}"`,
    `"${inc.createdAt}"`,
    `"${inc.category}"`,
    `"${inc.department}"`,
    `"${inc.priority}"`,
    `"${inc.severity}"`,
    inc.severityScore,
    `"${inc.status}"`,
    `"${inc.ward}"`,
    `"${inc.address.replace(/"/g, '""')}"`,
    inc.latitude,
    inc.longitude,
    `"${inc.assignedOfficerName || 'Unassigned'}"`,
    `"${inc.estimatedCost}"`,
    `"${inc.estimatedResolutionTime}"`,
    inc.aiConfidence,
    inc.duplicateCount
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
