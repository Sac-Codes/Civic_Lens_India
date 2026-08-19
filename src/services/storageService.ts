import { Incident } from '../types';

const INCIDENTS_KEY = 'civiclens_incidents_v2';
const CITIZEN_KEY = 'civiclens_citizen_profile_v2';
const NOTIFICATIONS_KEY = 'civiclens_notifications_v2';

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
