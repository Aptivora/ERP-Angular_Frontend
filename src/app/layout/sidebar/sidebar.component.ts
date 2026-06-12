import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BiComponent } from '../../shared/components/bi/bi.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';

const NAV = [
  { group: 'operations', items: [
    { id: 'dashboard', k: 'dashboard', icon: 'Dashboard' },
    { id: 'attendance', k: 'attendance', icon: 'Clock', badge: '8' },
    { id: 'dps', k: 'dps', icon: 'Droplet' },
    { id: 'collection', k: 'collection', icon: 'Truck' },
    { id: 'tapping', k: 'tapping', icon: 'Cycle' }
  ]},
  { group: 'masters', items: [
    { id: 'workers', k: 'workers', icon: 'Users' },
    { id: 'assets', k: 'assets', icon: 'Layers' },
    { id: 'inventory', k: 'inventory', icon: 'Boxes' },
    { id: 'mazdoor', k: 'mazdoor', icon: 'Map' }
  ]},
  { group: 'finance', items: [
    { id: 'payroll', k: 'payroll', icon: 'Wallet' },
    { id: 'payslip', k: 'payslip', icon: 'Print' }
  ]},
  { group: 'insight', items: [
    { id: 'reports', k: 'reports', icon: 'Bar' }
  ]},
  { group: 'system', items: [
    { id: 'field', k: 'field', icon: 'Smartphone' },
    { id: 'settings', k: 'settings', icon: 'Settings' }
  ]}
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, BiComponent, LogoComponent],
  template: `
    <aside class="sidebar" [class.mobile-open]="isMobileMenuOpen">
      <div class="row between" style="width: 100%; align-items: center;">
        <div class="logo">
          <app-logo type="sfck" [size]="32"></app-logo>
          <div class="logo-text">
            <div class="logo-name">SFCK</div>
            <div class="logo-sub">Estate Operations</div>
          </div>
        </div>
        
        <button
          class="icon-btn mobile-close-btn"
          (click)="closeMenu.emit()"
          style="margin-right: 16px; border: none; background: transparent; cursor: pointer;"
          title="Close Menu">
          <app-icon name="X" [size]="16"></app-icon>
        </button>
      </div>

      <nav class="nav">
        @for (g of navGroups; track g.group) {
          @if (g.items.length) {
            <div>
              <div class="nav-group-title">
                <app-bi [k]="g.group" overrideLang="en"></app-bi>
              </div>
              @for (it of g.items; track it.id) {
                <div class="nav-item" [class.active]="currentRoute === it.id" (click)="navigate(it.id)">
                  <app-icon [name]="it.icon" [size]="16" class="nav-icon"></app-icon>
                  <span style="color:rgb(213, 170, 70)"><app-bi [k]="it.k"></app-bi></span>
                  @if (it.badge) {
                    <span class="nav-badge">{{ it.badge }}</span>
                  }
                </div>
              }
            </div>
          }
        }
      </nav>

      <div style="padding: 12px 16px; border-top: var(--bd-soft); margin-top: 8px;">
        <div class="row gap-8" style="font-size: 11px; color: var(--ink-3);">
          <div class="dot leaf"></div>
          <span>All systems operational</span>
        </div>
        <div class="row between mt-8" style="font-size: 10.5px; color: var(--ink-mute); font-family: var(--font-mono);">
          <span>v2.4.1 · MAY 2026</span>
          <span>{{ role().label }}</span>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isMobileMenuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  private auth = inject(AuthService);
  private router = inject(Router);

  role = () => this.auth.authState().role;
  currentRoute = '';

  get navGroups() {
    const allowed = new Set(this.role()?.nav || []);
    return NAV.map(g => ({
      group: g.group,
      items: g.items.filter(it => allowed.has(it.id))
    }));
  }

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects.split('/')[1] || 'dashboard';
    });
  }

  navigate(id: string) {
    this.router.navigate(['/', id]);
    this.closeMenu.emit();
  }
}
