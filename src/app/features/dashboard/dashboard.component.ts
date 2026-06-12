import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AppConfigService } from '../../core/services/app-config.service';

import { DashAComponent } from './components/dash-a/dash-a.component';
import { DashBComponent } from './components/dash-b/dash-b.component';
import { DashCComponent } from './components/dash-c/dash-c.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeadComponent,
    IconComponent,
    DashAComponent,
    DashBComponent,
    DashCComponent
  ],
  template: `
    <div class="page">
      <app-page-head
        title="Dashboard"
        ml="ഡാഷ്ബോർഡ്"
        sub="Monday · 25 May 2026 · 09:42 IST · Cycle Day 26 of 31"
      >
        <ng-container content></ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
          <button class="btn ghost sm"><app-icon name="Refresh" [size]="13"></app-icon>Refresh</button>
          <button class="btn ghost sm"><app-icon name="Download" [size]="13"></app-icon>Export</button>
          <button class="btn ghost sm"><app-icon name="Plus" [size]="13"></app-icon>New DPS</button>
          <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
        </ng-container>
      </app-page-head>

      @switch (resolvedVariant) {
        @case ('A') { <app-dash-a></app-dash-a> }
        @case ('B') { <app-dash-b></app-dash-b> }
        @case ('C') { <app-dash-c></app-dash-c> }
        @default { <app-dash-a></app-dash-a> }
      }
    </div>
  `
})
export class DashboardComponent {
  @Input() variant?: 'A' | 'B' | 'C';
  
  public config = inject(AppConfigService);

  get resolvedVariant() {
    return this.variant || this.config.dashVariant() || 'A';
  }

  saveChanges() {
    window.alert('Changes saved successfully.');
  }
}
