import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PayslipAComponent } from './components/payslip-a.component';
import { PayslipBComponent } from './components/payslip-b.component';
import { PayslipCComponent } from './components/payslip-c.component';
import { AppConfigService } from '../../core/services/app-config.service';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent, PayslipAComponent, PayslipBComponent, PayslipCComponent, BiComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Payslip"
        ml="വേതന ചീട്ട്"
      >
        <div content class="page-sub"><app-bi k="payslip_sub"></app-bi></div>
        <ng-container actions>
          <button class="btn ghost sm" (click)="downloadPdf('payslip_en')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="pdf_en"></app-bi></button>
          <button class="btn ghost sm" (click)="downloadPdf('payslip_ml')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="pdf_ml"></app-bi></button>
          <button class="btn ghost sm" (click)="downloadPdf('payslip')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="download_pdf"></app-bi></button>
          <button class="btn primary sm" (click)="onAction('Sending SMS payslip to +91 98*** **421...')"><app-bi k="sms_to_worker"></app-bi></button>
        </ng-container>
      </app-page-head>

      <div class="mb-16" style="display: flex; gap: 8px; align-items: center;">
        <span class="muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;"><app-bi k="variant"></app-bi></span>
        <div class="lang-toggle">
          <button [class.on]="variant() === 'A'" (click)="setVariant('A')"><app-bi k="official"></app-bi></button>
          <button [class.on]="variant() === 'B'" (click)="setVariant('B')"><app-bi k="malayalam"></app-bi></button>
          <button [class.on]="variant() === 'C'" (click)="setVariant('C')"><app-bi k="mobile_sms"></app-bi></button>
        </div>
      </div>

      <div id="payslip-export-content">
        @switch (variant()) {
          @case ('A') { <app-payslip-a [lang]="config.lang()"></app-payslip-a> }
          @case ('B') { <app-payslip-b></app-payslip-b> }
          @case ('C') { <app-payslip-c></app-payslip-c> }
          @default { <app-payslip-a [lang]="config.lang()"></app-payslip-a> }
        }
      </div>
    </div>

    <!-- Toast Notification -->
    @if (toastMessage()) {
      <div style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink-1); color: var(--bg-1); padding: 12px 24px; border-radius: var(--r-md); font-size: 13px; font-weight: 500; z-index: 1000; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px;">
        <app-icon name="Check" [size]="16"></app-icon>
        {{ toastMessage() }}
      </div>
    }
  `
})
export class PayslipComponent {
  public config = inject(AppConfigService);
  private pdfService = inject(PdfExportService);
  
  // Reuse dashboard variant for payslip variant mapping (A, B, C)
  // This matches window.setPayslipVariant behavior in React, 
  // keeping the demo unified via AppConfigService.
  variant = signal(this.config.dashVariant() || 'A');
  toastMessage = signal<string | null>(null);

  setVariant(v: string) {
    this.variant.set(v);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }

  downloadPdf(name: string) {
    this.showToast('Generating PDF...');
    this.pdfService.exportElementToPdf('payslip-export-content', name + '.pdf');
  }
}
