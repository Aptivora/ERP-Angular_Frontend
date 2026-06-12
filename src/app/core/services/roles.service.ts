import { Injectable } from '@angular/core';

export interface Role {
  id: string;
  label: string;
  sub: string;
  title: string;
  name: string;
  nameMl: string;
  empId: string;
  avatar: string;
  scope: string;
  crumb: string;
  color: string;
  nav: string[];
  defaultRoute: string;
  dashView: string;
  canApprove: boolean;
  scopeAll: boolean;
  readOnly: boolean;
  estate: string;
  block?: string;
  level: number;
  isAdmin?: boolean;
}

export const ROLES: Record<string, Role> = {
  'worker': {
    id: 'worker', label: 'Worker', sub: 'Tapping / General', title: 'Tapper',
    name: 'Rajan Pillai', nameMl: 'രാജൻ പിള്ള', empId: 'EMP-1042', avatar: 'RP',
    scope: 'My own attendance, production & wages', crumb: 'My account', color: 'var(--leaf)',
    nav: ['dashboard','payslip','field'], defaultRoute: 'dashboard', dashView: 'worker',
    canApprove: false, scopeAll: false, readOnly: true, estate: 'KLP', block: 'KLP-B07', level: 1,
  },
  'cc-worker': {
    id: 'cc-worker', label: 'Collection Centre Worker', sub: 'CC intake & weighing', title: 'Collection Centre Worker',
    name: 'Beena Thomas', nameMl: 'ബീന തോമസ്', empId: 'EMP-1276', avatar: 'BT',
    scope: 'CC-Main · Kulathupuzha · intake & DRC tests', crumb: 'CC-Main · Kulathupuzha', color: 'var(--leaf)',
    nav: ['dashboard','collection','inventory','attendance','field'], defaultRoute: 'collection', dashView: 'collection',
    canApprove: false, scopeAll: false, readOnly: false, estate: 'KLP', level: 2,
  },
  'tapping-sup': {
    id: 'tapping-sup', label: 'Tapping Supervisor', sub: 'D1–D4 cycle owner', title: 'Tapping Supervisor',
    name: 'Vinod Raj', nameMl: 'വിനോദ് രാജ്', empId: 'EMP-1944', avatar: 'VR',
    scope: 'KLP · D1–D4 cycle · 18 blocks', crumb: 'KLP · Tapping cycle', color: 'var(--accent)',
    nav: ['dashboard','attendance','dps','tapping','collection','field'], defaultRoute: 'tapping', dashView: 'block',
    canApprove: false, scopeAll: false, readOnly: false, estate: 'KLP', level: 3,
  },
  'supervisor': {
    id: 'supervisor', label: 'Field Supervisor', sub: 'Muster · DPS · Mazdoor', title: 'Field Supervisor',
    name: 'Reena Vijayan', nameMl: 'റീന വിജയൻ', empId: 'EMP-1830', avatar: 'RV',
    scope: 'KLP-B07 · KLP-B08 · KLP-B12', crumb: 'KLP · Blocks B07–B12', color: 'var(--accent)',
    nav: ['dashboard','attendance','dps','collection','tapping','inventory','mazdoor','field'], defaultRoute: 'attendance', dashView: 'block',
    canApprove: false, scopeAll: false, readOnly: false, estate: 'KLP', level: 3,
  },
  'field-off': {
    id: 'field-off', label: 'Field Officer', sub: 'Approvals · oversight', title: 'Field Officer',
    name: 'Asha M.', nameMl: 'ആശ എം.', empId: 'EMP-0884', avatar: 'AM',
    scope: 'KLP · North Division · 6 blocks', crumb: 'KLP · North Div.', color: 'var(--leaf)',
    nav: ['dashboard','attendance','dps','collection','tapping','workers','assets','inventory','mazdoor','reports','field'], defaultRoute: 'dashboard', dashView: 'map',
    canApprove: true, scopeAll: false, readOnly: false, estate: 'KLP', level: 4,
  },
  'asst-estate-mgr': {
    id: 'asst-estate-mgr', label: 'Assistant Estate Manager', sub: 'Deputy to Estate Manager', title: 'Asst. Estate Manager',
    name: 'Lakshmi Menon', nameMl: 'ലക്ഷ്മി മേനോൻ', empId: 'EMP-0418', avatar: 'LM',
    scope: 'Kulathupuzha Estate · operations', crumb: 'Kulathupuzha Estate', color: 'var(--accent)',
    nav: ['dashboard','attendance','dps','collection','tapping','workers','assets','inventory','mazdoor','payroll','reports','field'], defaultRoute: 'dashboard', dashView: 'ops',
    canApprove: true, scopeAll: false, readOnly: false, estate: 'KLP', level: 5,
  },
  'estate-mgr': {
    id: 'estate-mgr', label: 'Estate Manager', sub: 'Estate head', title: 'Estate Manager',
    name: 'P. Suresh Kumar', nameMl: 'പി. സുരേഷ് കുമാർ', empId: 'EMP-0312', avatar: 'PS',
    scope: 'Kulathupuzha Estate · full', crumb: 'Kulathupuzha Estate', color: 'var(--accent)',
    nav: ['dashboard','attendance','dps','collection','tapping','workers','assets','inventory','mazdoor','payroll','payslip','reports','field','settings'], defaultRoute: 'dashboard', dashView: 'ops',
    canApprove: true, scopeAll: false, readOnly: false, estate: 'KLP', level: 6,
  },
  'gm': {
    id: 'gm', label: 'General Manager', sub: 'Plantations & Operations', title: 'General Manager',
    name: 'Ratheesh K.', nameMl: 'രതീഷ് കെ.', empId: 'EMP-0008', avatar: 'RK',
    scope: 'All 5 estates · plantation operations', crumb: 'SFCK · GM Office', color: 'var(--ink)',
    nav: ['dashboard','reports','payroll','workers','assets','inventory','mazdoor','settings'], defaultRoute: 'dashboard', dashView: 'exec',
    canApprove: true, scopeAll: true, readOnly: false, estate: 'ALL', level: 7,
  },
  'md': {
    id: 'md', label: 'Managing Director', sub: 'SFCK head', title: 'Managing Director',
    name: 'Dr. K. Vasudevan IAS', nameMl: 'ഡോ. കെ. വാസുദേവൻ ഐഎഎസ്', empId: 'EMP-0001', avatar: 'KV',
    scope: 'All 5 estates · final authority', crumb: 'SFCK · MD Office', color: 'var(--ink)',
    nav: ['dashboard','reports','payroll','workers','assets','inventory','mazdoor','settings'], defaultRoute: 'dashboard', dashView: 'exec',
    canApprove: true, scopeAll: true, readOnly: false, estate: 'ALL', level: 8,
  },
  'admin': {
    id: 'admin', label: 'IT Admin', sub: 'System configuration', title: 'IT Administrator',
    name: 'Krishnan Nair', nameMl: 'കൃഷ്ണൻ നായർ', empId: 'EMP-0042', avatar: 'KN',
    scope: 'System-wide · configuration only', crumb: 'SFCK · System', color: 'var(--tap-d3)',
    nav: ['dashboard','settings','reports','workers'], defaultRoute: 'settings', dashView: 'system',
    canApprove: false, scopeAll: true, readOnly: false, estate: 'ALL', isAdmin: true, level: 0,
  },
  'auditor': {
    id: 'auditor', label: 'Auditor', sub: 'Read-only · audit trail', title: 'External Auditor',
    name: 'CA Suja Krishnan', nameMl: 'സിഎ സുജ കൃഷ്ണൻ', empId: 'AUD-2026-04', avatar: 'SK',
    scope: 'Read-only · all estates · audit trail', crumb: 'SFCK · Audit', color: 'var(--amber)',
    nav: ['dashboard','attendance','dps','collection','workers','assets','inventory','mazdoor','payroll','payslip','reports'], defaultRoute: 'reports', dashView: 'audit',
    canApprove: false, scopeAll: true, readOnly: true, estate: 'ALL', level: 0,
  },
};

export const ROLE_ORDER_OPS = [
  'md', 'gm', 'estate-mgr', 'asst-estate-mgr', 'field-off',
  'supervisor', 'tapping-sup', 'cc-worker', 'worker'
];

export const ROLE_ORDER_SYS = ['admin', 'auditor'];

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  getRole(id: string): Role {
    return ROLES[id] || ROLES['estate-mgr'];
  }

  routeAllowed(roleId: string, route: string): boolean {
    const r = this.getRole(roleId);
    return !route || r.nav.includes(route);
  }
}
