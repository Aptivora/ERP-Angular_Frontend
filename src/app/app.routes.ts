import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/role-dashboard.component').then(m => m.RoleDashboardComponent) },
      { path: 'attendance', loadComponent: () => import('./features/ops/attendance.component').then(m => m.AttendanceComponent) },
      { path: 'dps', loadComponent: () => import('./features/ops/dps.component').then(m => m.DpsComponent) },
      { path: 'collection', loadComponent: () => import('./features/ops/collection.component').then(m => m.CollectionComponent) },
      { path: 'tapping', loadComponent: () => import('./features/ops/tapping.component').then(m => m.TappingComponent) },
      { path: 'workers', loadComponent: () => import('./features/masters/workers.component').then(m => m.WorkersComponent) },
      { path: 'assets', loadComponent: () => import('./features/masters/assets.component').then(m => m.AssetsComponent) },
      { path: 'inventory', loadComponent: () => import('./features/masters/inventory.component').then(m => m.InventoryComponent) },
      { path: 'mazdoor', loadComponent: () => import('./features/masters/mazdoor.component').then(m => m.MazdoorComponent) },
      { path: 'payroll', loadComponent: () => import('./features/finance/payroll.component').then(m => m.PayrollComponent) },
      { path: 'payslip', loadComponent: () => import('./features/finance/payslip.component').then(m => m.PayslipComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'field', loadComponent: () => import('./features/field/field.component').then(m => m.FieldComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
