export type RoleId = 'md' | 'gm' | 'estate-mgr' | 'asst-estate-mgr' | 'field-off' | 'supervisor' | 'tapping-sup' | 'cc-worker' | 'worker' | 'admin' | 'auditor';

export interface Role {
  id: RoleId;
  label: string;
  title: string;
  name: string;
  avatar: string;
  color: string;
  scopeAll: boolean;
  scope: string;
  crumb: string;
  defaultRoute: string;
  readOnly: boolean;
  nav: string[];
}

export const ROLES: Record<RoleId, Role> = {
  // EXECUTIVE
  'md': {
    id: 'md',
    label: 'Managing Director',
    title: 'Managing Director',
    name: 'S. Rajeev IAS',
    avatar: 'SR',
    color: '#8b5cf6', // purple
    scopeAll: true,
    scope: 'All Estates & HQ',
    crumb: 'Corporate HQ',
    defaultRoute: 'dashboard',
    readOnly: false,
    nav: ['dashboard', 'dps', 'attendance', 'assets', 'reports']
  },
  'gm': {
    id: 'gm',
    label: 'General Manager',
    title: 'General Manager (Plantations)',
    name: 'T. Mohan Kumar',
    avatar: 'MK',
    color: '#3b82f6', // blue
    scopeAll: true,
    scope: 'All Estates',
    crumb: 'Plantations HQ',
    defaultRoute: 'dashboard',
    readOnly: false,
    nav: ['dashboard', 'dps', 'attendance', 'assets', 'reports', 'workers']
  },

  // ESTATE LEVEL
  'estate-mgr': {
    id: 'estate-mgr',
    label: 'Estate Manager',
    title: 'Estate Manager',
    name: 'P. Suresh Kumar',
    avatar: 'SK',
    color: '#0f172a', // slate
    scopeAll: false,
    scope: 'Estate Level',
    crumb: '', // dynamic
    defaultRoute: 'dashboard',
    readOnly: false,
    nav: ['dashboard', 'attendance', 'dps', 'collection', 'tapping', 'workers', 'assets', 'inventory', 'mazdoor', 'payroll', 'reports', 'settings']
  },
  'asst-estate-mgr': {
    id: 'asst-estate-mgr',
    label: 'Assistant Estate Mgr',
    title: 'Asst. Manager',
    name: 'M. Ramesh',
    avatar: 'MR',
    color: '#475569',
    scopeAll: false,
    scope: 'Estate Level',
    crumb: '',
    defaultRoute: 'dps',
    readOnly: false,
    nav: ['dashboard', 'attendance', 'dps', 'collection', 'tapping', 'workers', 'assets', 'inventory']
  },

  // FIELD STAFF
  'field-off': {
    id: 'field-off',
    label: 'Field Officer',
    title: 'Field Officer',
    name: 'V. Prakash',
    avatar: 'VP',
    color: '#059669', // emerald
    scopeAll: false,
    scope: 'Division Level',
    crumb: '',
    defaultRoute: 'attendance',
    readOnly: false,
    nav: ['dashboard', 'attendance', 'dps', 'tapping', 'workers', 'assets', 'field']
  },
  'supervisor': {
    id: 'supervisor',
    label: 'Field Supervisor',
    title: 'Field Supervisor',
    name: 'Reena Vijayan',
    avatar: 'RV',
    color: '#10b981', // green
    scopeAll: false,
    scope: 'Block Level',
    crumb: '',
    defaultRoute: 'field',
    readOnly: false,
    nav: ['attendance', 'dps', 'field', 'workers']
  },
  'tapping-sup': {
    id: 'tapping-sup',
    label: 'Tapping Supervisor',
    title: 'Tapping Supervisor',
    name: 'Vinod Raj',
    avatar: 'VR',
    color: '#f59e0b', // amber
    scopeAll: false,
    scope: 'Block Level',
    crumb: '',
    defaultRoute: 'field',
    readOnly: false,
    nav: ['attendance', 'dps', 'tapping', 'field']
  },
  'cc-worker': {
    id: 'cc-worker',
    label: 'Collection Worker',
    title: 'Coll. Centre Supervisor',
    name: 'Beena Thomas',
    avatar: 'BT',
    color: '#d97706',
    scopeAll: false,
    scope: 'Collection Centre',
    crumb: '',
    defaultRoute: 'collection',
    readOnly: false,
    nav: ['collection', 'inventory', 'field']
  },

  // WORKERS
  'worker': {
    id: 'worker',
    label: 'Worker',
    title: 'Worker (Tapper)',
    name: 'Rajan Pillai',
    avatar: 'RP',
    color: '#64748b',
    scopeAll: false,
    scope: 'Self',
    crumb: '',
    defaultRoute: 'payslip',
    readOnly: true,
    nav: ['payslip'] // Mobile view mainly
  },

  // SYSTEM / AUDIT
  'admin': {
    id: 'admin',
    label: 'IT Admin',
    title: 'System Administrator',
    name: 'Admin',
    avatar: 'AD',
    color: '#ef4444', // red
    scopeAll: true,
    scope: 'System-wide',
    crumb: 'System Admin',
    defaultRoute: 'settings',
    readOnly: false,
    nav: ['dashboard', 'attendance', 'dps', 'collection', 'tapping', 'workers', 'assets', 'inventory', 'mazdoor', 'payroll', 'payslip', 'reports', 'settings']
  },
  'auditor': {
    id: 'auditor',
    label: 'Auditor',
    title: 'External Auditor',
    name: 'Audit Desk',
    avatar: 'AU',
    color: '#b45309', // amber dark
    scopeAll: true,
    scope: 'System-wide (Read Only)',
    crumb: 'Audit Console',
    defaultRoute: 'dashboard',
    readOnly: true, // Key flag
    nav: ['dashboard', 'attendance', 'dps', 'collection', 'tapping', 'workers', 'assets', 'inventory', 'payroll', 'reports']
  }
};

export const getRole = (id: RoleId | null | undefined): Role => {
  return ROLES[id as RoleId] || ROLES['estate-mgr'];
};
