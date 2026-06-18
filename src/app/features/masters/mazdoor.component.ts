import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-mazdoor',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, BiComponent],
  template: `
    <div class="page" id="mazdoor-export-content">
      <app-page-head
        title="Mazdoor Estimate"
        ml="മസ്ദൂർ എസ്റ്റിമേറ്റ്"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="mzd_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="downloadPdf('mazdoor_estimate')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="export_pdf"></app-bi></button>
          <button class="btn primary sm" (click)="onAction('+ New Estimate: Fill in task, block, mandays, day rate, and submit for approval.')"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="new_estimate"></app-bi></button>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        <div class="kpi"><div class="label"><app-bi k="open_estimates"></app-bi></div><div class="value">23</div><div class="delta">across 18 blocks</div></div>
        <div class="kpi"><div class="label"><app-bi k="sanctioned_budget"></app-bi></div><div class="value">₹14.2<span class="unit">lakh</span></div><div class="delta">FY26 Q1 · MD approved</div></div>
        <div class="kpi"><div class="label"><app-bi k="consumed"></app-bi></div><div class="value">₹8.7<span class="unit">lakh</span></div><div class="delta">61% of sanction</div></div>
        <div class="kpi"><div class="label"><app-bi k="pending_approval"></app-bi></div><div class="value">5</div><div class="delta">3 from Estate Manager · 2 GM</div></div>
      </div>

      <div class="card bold mb-16">
        <div class="card-head">
          <div class="ttl"><app-bi k="active_estimates"></app-bi> · Kulathupuzha</div>
          <div class="row gap-8" style="margin-left: auto; font-size: 11px;">
            <span class="chip"><span class="dot leaf"></span>Under budget</span>
            <span class="chip"><span class="dot amber"></span>Approaching limit</span>
            <span class="chip"><span class="dot oxide"></span>Over budget</span>
          </div>
        </div>
        <table class="tbl">
          <thead>
            <tr>
              <th><app-bi k="est_no"></app-bi></th><th><app-bi k="task"></app-bi></th><th><app-bi k="block"></app-bi></th><th class="num"><app-bi k="mandays"></app-bi></th>
              <th class="num"><app-bi k="used"></app-bi></th><th><app-bi k="burn"></app-bi></th><th class="num"><app-bi k="budget"></app-bi></th><th><app-bi k="manager"></app-bi></th><th><app-bi k="status"></app-bi></th>
            </tr>
          </thead>
          <tbody>
            @for (r of estimates; track r.n) {
              <tr>
                <td class="mono"><b>{{ r.n }}</b></td>
                <td><b>{{ r.t }}</b></td>
                <td class="mono" style="font-size: 12px;">{{ r.blk }}</td>
                <td class="num">{{ r.s }}</td>
                <td class="num">{{ r.u }}</td>
                <td>
                  <div class="bar" style="width: 90px;">
                    <i [style.width.%]="getPercent(r.u, r.s)"
                       [style.background]="r.st === 'mute' ? 'var(--ink-mute)' : 'var(--' + r.st + ')'"></i>
                  </div>
                </td>
                <td class="num"><b>₹{{ r.b.toLocaleString('en-IN') }}</b></td>
                <td>{{ r.sup }}</td>
                <td><span class="badge" [ngClass]="r.st">{{ r.sl }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="grid g-2">
        <div class="card bold">
          <div class="card-head"><div class="ttl"><app-bi k="create_estimate"></app-bi></div></div>
          <div class="card-body grid g-2" style="gap: 14px;">
            <div class="field">
              <label><app-bi k="task"></app-bi></label>
              <select class="select" [(ngModel)]="mzdTask">
                <option>— Select task —</option>
                <option>Block clearing & weeding</option>
                <option>Rainguard application</option>
                <option>Fertilizer broadcast</option>
                <option>Drain cleaning</option>
                <option>Custom…</option>
              </select>
            </div>
            <div class="field">
              <label><app-bi k="block"></app-bi></label>
              <select class="select" [(ngModel)]="mzdBlock">
                <option>KLP-B07 Kallarkutty B7</option>
                <option>KLP-B08 Kallarkutty B8</option>
                <option>KLP-B12 Aryankavu A</option>
                <option>KLP-B19 Vilakkupara V2</option>
              </select>
            </div>
            <div class="field"><label><app-bi k="mandays"></app-bi></label><input class="input mono" [value]="'60'" /></div>
            <div class="field"><label><app-bi k="day_rate_mzd"></app-bi></label><input class="input mono" [value]="'380'" /></div>
            <div class="field"><label><app-bi k="est_cost"></app-bi></label><input class="input mono" [value]="'₹22,800'" readonly /></div>
            <div class="field"><label><app-bi k="start_date"></app-bi></label><input class="input mono" [value]="'01-06-2026'" /></div>
            <div class="field" style="grid-column: span 2;"><label><app-bi k="notes"></app-bi></label><textarea class="textarea" rows="2" placeholder="Justification…"></textarea></div>
            <div class="row gap-8" style="grid-column: span 2;">
              <button class="btn ghost" (click)="onAction('Draft saved for task: ' + mzdTask + ' at block ' + mzdBlock)">Save draft</button>
              <button class="btn primary" style="margin-left: auto;" (click)="onAction('Estimate submitted for approval.\\nTask: ' + mzdTask + '\\nBlock: ' + mzdBlock + '\\nRouted to: Estate Manager (P. Suresh Kumar)')">Submit for approval</button>
            </div>
          </div>
        </div>

        <div class="card bold">
          <div class="card-head"><div class="ttl">Approval flow</div></div>
          <div class="card-body col" style="gap: 14px;">
            @for (a of approvals; track a.who; let i = $index) {
              <div class="row gap-16">
                <div [style.background]="a.st === 'done' ? 'var(--leaf)' : (a.st === 'current' ? 'var(--accent)' : 'var(--bg-3)')"
                     [style.color]="a.st === 'pending' ? 'var(--ink-3)' : 'white'"
                     style="width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700;">
                  {{ a.st === 'done' ? '✓' : (i + 1) }}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px;">
                    {{ a.who }}
                    @if (a.st === 'current') {
                      <span class="badge clay" style="margin-left: 6px;">Current step</span>
                    }
                  </div>
                  <div class="muted" style="font-size: 12px;">{{ a.name }} · {{ a.limit }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class MazdoorComponent {
  private pdfService = inject(PdfExportService);
  mzdTask = '— Select task —';
  mzdBlock = 'KLP-B07 Kallarkutty B7';

  estimates = [
    { n: 'EST-1042', t: 'Block clearing & weeding', blk: 'KLP-B19', s: 120, u: 88, b: 42800, sup: 'Reena Vijayan', st: 'leaf', sl: 'On track' },
    { n: 'EST-1043', t: 'Rainguard application', blk: 'KLP-B07', s: 60, u: 54, b: 21600, sup: 'Vinod Raj', st: 'amber', sl: '90% used' },
    { n: 'EST-1044', t: 'Fertilizer broadcast', blk: 'KLP-B12, B14', s: 180, u: 96, b: 68400, sup: 'Reena Vijayan', st: 'leaf', sl: 'On track' },
    { n: 'EST-1045', t: 'Drain cleaning', blk: 'KLP-B27, B28', s: 80, u: 82, b: 30400, sup: 'Vinod Raj', st: 'oxide', sl: '+3% overrun' },
    { n: 'EST-1046', t: 'Tree painting (preventive)', blk: 'KLP-B08', s: 45, u: 12, b: 17100, sup: 'Reena Vijayan', st: 'leaf', sl: 'Started 23 May' },
    { n: 'EST-1047', t: 'Boundary fence repair', blk: 'KLP-B23', s: 35, u: 0, b: 13300, sup: '—', st: 'mute', sl: 'Awaiting MD sign' },
  ];

  approvals = [
    { who: 'Field Supervisor', name: 'Reena Vijayan', limit: 'up to ₹5,000', st: 'done' },
    { who: 'Field Officer', name: 'Asha M.', limit: 'up to ₹25,000', st: 'done' },
    { who: 'Estate Manager', name: 'P. Suresh Kumar', limit: 'up to ₹1,00,000', st: 'current' },
    { who: 'General Manager', name: 'Ratheesh K.', limit: 'up to ₹5,00,000', st: 'pending' },
    { who: 'Managing Director', name: 'Dr. K. Vasudevan', limit: 'above ₹5,00,000', st: 'pending' },
  ];

  getPercent(u: number, s: number) {
    return Math.min(100, (u / s) * 100);
  }

  onAction(msg: string) {
    alert(msg);
  }

  downloadPdf(name: string) {
    this.pdfService.exportElementToPdf('mazdoor-export-content', name + '.pdf');
  }
}
