import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AppConfigService } from '../../core/services/app-config.service';
import { PdfExportService } from '../../core/services/pdf-export.service';

import { DashAComponent } from './components/dash-a/dash-a.component';
import { DashBComponent } from './components/dash-b/dash-b.component';
import { DashCComponent } from './components/dash-c/dash-c.component';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PageHeadComponent,
    IconComponent,
    DashAComponent,
    DashBComponent,
    DashCComponent,
    BiComponent
  ],
  template: `
    <div class="page" id="dashboard-export-content">
      <app-page-head
        title="Dashboard"
        ml="ഡാഷ്‌ബോർഡ്"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="dash_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon><app-bi k="tweaks"></app-bi></button>
          <button class="btn ghost sm"><app-icon name="Refresh" [size]="13"></app-icon><app-bi k="refresh"></app-bi></button>
          <button class="btn ghost sm" (click)="downloadPdf('dashboard_report')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="export_pdf"></app-bi></button>
          <button class="btn ghost sm"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="new_dps"></app-bi></button>
          <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon><app-bi k="save_changes"></app-bi></button>
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
  private pdfService = inject(PdfExportService);

  get resolvedVariant() {
    return this.variant || this.config.dashVariant() || 'A';
  }

  saveChanges() {
    window.alert('Changes saved successfully.');
  }

  downloadPdf(name: string) {
    this.pdfService.exportElementToPdf('dashboard-export-content', name + '.pdf');
  }
}
