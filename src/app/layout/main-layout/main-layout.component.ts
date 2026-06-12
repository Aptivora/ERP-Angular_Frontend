import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TweaksPanelComponent } from '../../shared/components/tweaks-panel/tweaks-panel.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, IconComponent, TweaksPanelComponent],
  template: `
    <div class="app" [attr.data-screen-label]="currentRoute">
      @if (isMobileMenuOpen) {
        <div 
          class="sidebar-backdrop" 
          (click)="isMobileMenuOpen = false"
          style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); z-index: 999;">
        </div>
      }

      <app-sidebar 
        [isMobileMenuOpen]="isMobileMenuOpen"
        (closeMenu)="isMobileMenuOpen = false">
      </app-sidebar>

      <app-topbar 
        (toggleMenu)="isMobileMenuOpen = !isMobileMenuOpen">
      </app-topbar>

      <main class="main">
        @if (role().readOnly) {
          <div style="padding: 8px 24px; background: var(--amber-soft); border-bottom: 2px solid var(--amber); display: flex; align-items: center; gap: 12px; font-size: 12px;">
            <app-icon name="Eye" [size]="14"></app-icon>
            <b>Read-only audit view.</b>
            <span class="muted">No data can be modified. All your actions and queries are recorded in the audit log.</span>
            <span class="mono" style="margin-left: auto; font-size: 11px;">Engagement · SFCK/AUD/26-27/04</span>
          </div>
        }
        <router-outlet></router-outlet>
      </main>

      <!-- Tweaks Panel -->
      <app-tweaks-panel></app-tweaks-panel>
    </div>
  `
})
export class MainLayoutComponent {
  isMobileMenuOpen = false;
  currentRoute = '';

  private auth = inject(AuthService);
  private router = inject(Router);

  role = () => this.auth.authState().role;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects.split('/')[1] || 'dashboard';
      this.isMobileMenuOpen = false;
    });
  }
}
