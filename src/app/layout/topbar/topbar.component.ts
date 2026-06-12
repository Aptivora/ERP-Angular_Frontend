import { Component, EventEmitter, Output, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { DataService } from '../../core/services/data.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BiComponent, TRANSLATIONS } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IconComponent, BiComponent],
  template: `
    <header class="topbar">
      <button
        class="icon-btn mobile-hamburger"
        (click)="toggleMenu.emit()"
        style="margin-right: 8px; border: none; background: transparent; cursor: pointer;"
        title="Toggle Menu">
        <app-icon name="Menu" [size]="16"></app-icon>
      </button>

      <div class="crumbs">
        <span>SFCK</span>
        <app-icon name="ChevronR" [size]="12" class="sep"></app-icon>
        <span>{{ role().scopeAll ? role().crumb : currentEstate.name }}</span>
        <app-icon name="ChevronR" [size]="12" class="sep"></app-icon>
        <strong style="text-transform: capitalize;">{{ routeLabel }}</strong>
        @if (role().readOnly) {
          <span class="badge amber" style="margin-left: 8px;">READ-ONLY · AUDIT</span>
        }
      </div>

      <div class="topbar-search">
        <app-icon name="Search" [size]="14"></app-icon>
        <input
          #searchInput
          type="search"
          [(ngModel)]="searchQuery"
          (keydown.enter)="onSearchSubmit($event)"
          [placeholder]="searchPlaceholder"
          aria-label="Search"
        />
        @if (searchQuery) {
          <button (click)="searchQuery = ''" style="background:none; border:none; color: var(--ink-3); font-weight: bold; cursor: pointer; padding: 0 4px; font-size: 16px; line-height: 1;">×</button>
        } @else {
          <kbd>⌘K</kbd>
        }
      </div>

      <div class="topbar-right">
        @if (!role().scopeAll) {
          <div class="estate-pill" style="position: relative; cursor: pointer;" title="Switch estate">
            <span class="dot"></span>
            <span>{{ currentEstate.id }} · {{ currentEstate.name.split(' ')[0] }}</span>
            <app-icon name="Chevron" [size]="12"></app-icon>
            <select [(ngModel)]="currentEstateId" (ngModelChange)="onEstateChange($event)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; font-size: 16px;">
              @for (e of dataService.estates; track e.id) {
                <option [value]="e.id">{{ e.id }} · {{ e.name }}</option>
              }
            </select>
          </div>
        } @else {
          <div class="estate-pill" title="Scope">
            <span class="dot" style="background: var(--accent);"></span>
            <span>All estates · {{ dataService.estates.length }}</span>
          </div>
        }

        <div class="lang-toggle">
          <button [class.on]="lang() === 'en'" (click)="config.setTweak('lang', 'en')">EN</button>
          <button class="ml" [class.on]="lang() === 'ml'" (click)="config.setTweak('lang', 'ml')">മ</button>
          <button [class.on]="lang() === 'both'" (click)="config.setTweak('lang', 'both')">BI</button>
        </div>

        <button class="icon-btn" (click)="toggleTheme()" title="Toggle theme">
          @if (theme() === 'dark') {
            <app-icon name="Sun" [size]="14"></app-icon>
          } @else {
            <app-icon name="Moon" [size]="14"></app-icon>
          }
        </button>

        <button class="icon-btn" title="Notifications" (click)="showAlert()">
          <app-icon name="Bell" [size]="14"></app-icon>
          <span class="dot-r"></span>
        </button>

        <div class="user-pill" title="Account">
          <div style="line-height: 1.2; text-align: right;">
            <div class="role">{{ role().title }}</div>
            <div class="name">{{ role().name }}</div>
          </div>
          <div class="avatar" [style.background]="role().color">{{ role().avatar }}</div>
          <button class="icon-btn" style="margin-left: 6px; width: 24px; height: 24px; border: none; background: transparent;" title="Sign out" (click)="onLogout()">
            <app-icon name="Logout" [size]="13"></app-icon>
          </button>
        </div>
      </div>
    </header>

    <!-- Toast Notification -->
    @if (toastMessage) {
      <div style="position: fixed; top: 64px; left: 50%; transform: translateX(-50%); background: var(--ink-1); color: var(--bg-1); padding: 12px 24px; border-radius: var(--r-md); font-size: 13px; font-weight: 500; z-index: 1000; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px;">
        <app-icon name="Check" [size]="16"></app-icon>
        {{ toastMessage }}
      </div>
    }
  `
})
export class TopbarComponent {
  @Output() toggleMenu = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  public auth = inject(AuthService);
  public config = inject(AppConfigService);
  public dataService = inject(DataService);
  private router = inject(Router);

  role = () => this.auth.authState().role;
  lang = this.config.lang;
  theme = this.config.theme;

  searchQuery = '';
  currentRoute = '';
  currentEstateId = 'KLP';
  toastMessage: string | null = null;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects.split('/')[1] || 'dashboard';
    });
  }

  get currentEstate() {
    return this.dataService.estates.find(e => e.id === this.currentEstateId) || this.dataService.estates[0];
  }

  get routeLabel() {
    return TRANSLATIONS['en'][this.currentRoute] || this.currentRoute;
  }

  get searchPlaceholder() {
    return TRANSLATIONS[this.lang() === 'ml' ? 'ml' : 'en']['search_p'];
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = null, 3000);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement?.focus();
    }
  }

  onSearchSubmit(e: Event) {
    e.preventDefault();
    const trimmed = this.searchQuery.trim();
    if (trimmed) {
      this.showToast(`Searched for "${trimmed}"`);
    } else {
      this.showToast('Please enter a search term.');
    }
  }

  onEstateChange(newId: string) {
    this.currentEstateId = newId;
    this.showToast(`Switched estate to ${this.currentEstate.name}`);
  }

  toggleTheme() {
    this.config.setTweak('theme', this.theme() === 'dark' ? 'light' : 'dark');
    this.showToast(`Theme changed to ${this.theme()}`);
  }

  showAlert() {
    this.showToast('You have no new notifications.');
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
