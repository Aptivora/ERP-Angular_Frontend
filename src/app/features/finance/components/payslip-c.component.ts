import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SfckMarkComponent } from '../../../shared/components/icon/sfck-mark.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-payslip-c',
  standalone: true,
  imports: [CommonModule, SfckMarkComponent, IconComponent],
  template: `
    <div style="max-width: 380px; margin: 0 auto;">
      <div style="background: var(--ink); color: var(--bg); padding: 18px; border-radius: 8px 8px 0 0;">
        <div class="row between">
          <app-sfck-mark [size]="28"></app-sfck-mark>
          <div class="mono" style="font-size: 10px; opacity: 0.7;">SLP-KLP-1042-202605</div>
        </div>
        <div style="font-size: 11px; color: var(--bg-3); margin-top: 14px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">Wage slip · വേതന ചീട്ട്</div>
        <div class="ml" style="font-size: 18px; font-weight: 700; margin-top: 4px;">രാജൻ പിള്ള</div>
        <div style="font-size: 13px; opacity: 0.85;">Rajan Pillai · EMP-1042</div>
        <div class="muted" style="font-size: 11px; color: var(--bg-3); margin-top: 8px; font-family: var(--font-mono);">{{ p.period }}</div>
      </div>

      <div style="background: var(--accent); color: var(--accent-ink); padding: 18px; text-align: center;">
        <div style="font-size: 11px; opacity: 0.85; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">Net pay credited · അറ്റ വേതനം</div>
        <div class="mono" style="font-size: 38px; font-weight: 800; line-height: 1.1; margin-top: 4px;">₹{{ net.toLocaleString('en-IN') }}</div>
        <div style="font-size: 11px; margin-top: 4px;">NEFT credit · 31 May 2026 · KSB·0042178</div>
      </div>

      <div style="background: var(--surface); padding: 16px;">
        <div style="font-size: 11px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Earnings · വരവ്</div>
        @for (r of p.earnings; track r.code) {
          <div class="row between" style="padding: 4px 0; font-size: 13px; border-bottom: 1px dashed var(--rule-soft);">
            <span>{{ r.desc }}<span class="ml muted" style="font-size: 11px; display: block;">{{ r.desc_ml }}</span></span>
            <b class="mono">₹{{ r.amount.toLocaleString('en-IN') }}</b>
          </div>
        }
        <div class="row between mt-8" style="font-size: 13px; font-weight: 700;">
          <span>Gross · മൊത്തം വരവ്</span><b class="mono">₹{{ earningsTotal.toLocaleString('en-IN') }}</b>
        </div>

        <div style="font-size: 11px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; margin-top: 18px; margin-bottom: 8px;">Deductions · കിഴിവുകൾ</div>
        @for (r of p.deductions; track r.code) {
          <div class="row between" style="padding: 4px 0; font-size: 13px; border-bottom: 1px dashed var(--rule-soft);">
            <span>{{ r.desc }}<span class="ml muted" style="font-size: 11px; display: block;">{{ r.desc_ml }}</span></span>
            <b class="mono">₹{{ r.amount.toLocaleString('en-IN') }}</b>
          </div>
        }
        <div class="row between mt-8" style="font-size: 13px; font-weight: 700;">
          <span>Total deductions</span><b class="mono">₹{{ dedTotal.toLocaleString('en-IN') }}</b>
        </div>
      </div>

      <div style="padding: 14px; background: var(--bg-2); font-size: 11px; color: var(--ink-3); border-radius: 0 0 8px 8px;">
        <div class="row between">
          <span>SMS sent · +91 98••• 4521</span>
          <app-icon name="Check" [size]="12"></app-icon>
        </div>
        <div class="muted mt-8" style="font-size: 10px;">System-generated. For queries scan QR or call Estate office.</div>
      </div>
    </div>
  `
})
export class PayslipCComponent {
  dataService = inject(DataService);
  
  get p(): any { return this.dataService.payslip; }
  get earningsTotal() { return this.p.earnings.reduce((s: number, r: any) => s + r.amount, 0); }
  get dedTotal() { return this.p.deductions.reduce((s: number, r: any) => s + r.amount, 0); }
  get net() { return this.earningsTotal - this.dedTotal; }
}
