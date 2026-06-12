import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PayslipAComponent } from './components/payslip-a.component';
import { PayslipBComponent } from './components/payslip-b.component';
import { PayslipCComponent } from './components/payslip-c.component';
import { AppConfigService } from '../../core/services/app-config.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent, PayslipAComponent, PayslipBComponent, PayslipCComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Payslip"
        ml="വേതന ചീട്ട്"
        sub="Rajan Pillai · EMP-1042 · Cycle 21 Apr – 20 May 2026"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Downloading payslip as PDF...')"><app-icon name="Download" [size]="13"></app-icon>PDF (EN)</button>
          <button class="btn ghost sm" (click)="onAction('Downloading payslip as PDF (ML)...')"><app-icon name="Download" [size]="13"></app-icon>PDF (ML)</button>
          <button class="btn ghost sm" (click)="onAction('Downloading payslip as PDF...')"><app-icon name="Download" [size]="13"></app-icon>Download PDF</button>
          <button class="btn primary sm" (click)="onAction('Sending SMS payslip to +91 98*** **421...')">SMS to worker</button>
        </ng-container>
      </app-page-head>

      <div class="mb-16" style="display: flex; gap: 8px; align-items: center;">
        <span class="muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Variant</span>
        <div class="lang-toggle">
          <button [class.on]="variant() === 'A'" (click)="setVariant('A')">Official</button>
          <button [class.on]="variant() === 'B'" (click)="setVariant('B')">Malayalam</button>
          <button [class.on]="variant() === 'C'" (click)="setVariant('C')">Mobile/SMS</button>
        </div>
      </div>

      @switch (variant()) {
        @case ('A') { <app-payslip-a lang="both"></app-payslip-a> }
        @case ('B') { <app-payslip-b></app-payslip-b> }
        @case ('C') { <app-payslip-c></app-payslip-c> }
        @default { <app-payslip-a lang="both"></app-payslip-a> }
      }
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
  private config = inject(AppConfigService);
  
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
}
