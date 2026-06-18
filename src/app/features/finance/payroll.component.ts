import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent, BiComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Payroll"
        ml="വേതനം"
      >
        <div content class="page-sub"><app-bi k="payroll_sub"></app-bi></div>
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Recomputing wages based on latest attendance...')"><app-icon name="Refresh" [size]="13"></app-icon><app-bi k="recompute"></app-bi></button>
          <button class="btn ghost sm" (click)="onAction('Generating bank transfer file (NEFT)...')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="bank_file_neft"></app-bi></button>
          <button class="btn primary sm" (click)="onAction('Closing payroll cycle and initiating approval ladder...')"><app-icon name="Check" [size]="13"></app-icon><app-bi k="close_cycle"></app-bi></button>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        <div class="kpi accent"><div class="label"><app-bi k="gross_wages"></app-bi></div><div class="value">₹68.4<span class="unit"><app-bi k="lakh"></app-bi></span></div><div class="delta"><app-bi k="gross_wages_sub"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="avg_wage_worker"></app-bi></div><div class="value">₹21,432</div><div class="delta up"><app-bi k="da_hike_applied"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="drc_incentive_pool"></app-bi></div><div class="value">₹8.6<span class="unit"><app-bi k="lakh"></app-bi></span></div><div class="delta"><app-bi k="tappers_above_base"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="variance_flags"></app-bi></div><div class="value">12</div><div class="delta down"><app-bi k="needs_review_before_close"></app-bi></div></div>
      </div>

      <!-- Stepper -->
      <div class="card bold mb-16">
        <div class="card-body" style="padding: 18px 16px;">
          <div class="row" style="gap: 0;">
            @for (s of stages; track s.id; let i = $index) {
              <div class="col" style="flex: 1; gap: 6px; align-items: flex-start;">
                <div class="row gap-8">
                  <div [style.background]="s.st === 'done' ? 'var(--leaf)' : (s.st === 'current' ? 'var(--ink)' : 'var(--bg-3)')"
                       [style.color]="s.st === 'pending' ? 'var(--ink-3)' : 'white'"
                       style="width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700;">
                    {{ s.st === 'done' ? '✓' : (i + 1) }}
                  </div>
                  <b style="font-size: 13px;"><app-bi [k]="s.t"></app-bi></b>
                </div>
                <div class="muted" style="font-size: 11px; margin-left: 30px;"><app-bi [k]="s.sub"></app-bi></div>
              </div>
              @if (i < stages.length - 1) {
                <div [style.background]="s.st === 'done' ? 'var(--leaf)' : 'var(--bg-3)'"
                     style="flex: 0 0 16px; height: 2px; margin-top: 11px; margin-inline: -4px;"></div>
              }
            }
          </div>
        </div>
      </div>

      <div class="grid mb-16" style="grid-template-columns: 1fr 1fr;">
        <div class="card bold">
          <div class="card-head">
            <div class="ttl"><app-bi k="wage_variance_needs_review"></app-bi></div>
            <span class="badge oxide" style="margin-left: auto;"><app-bi k="flags_12"></app-bi></span>
          </div>
          <table class="tbl">
            <thead>
              <tr><th><app-bi k="emp"></app-bi></th><th><app-bi k="worker_lbl"></app-bi></th><th class="num"><app-bi k="last_cycle"></app-bi></th><th class="num"><app-bi k="this_cycle"></app-bi></th><th class="num"><app-bi k="delta"></app-bi></th><th><app-bi k="reason"></app-bi></th></tr>
            </thead>
            <tbody>
              @for (r of variances; track r.e) {
                <tr>
                  <td class="mono">{{ r.e }}</td>
                  <td><b>{{ r.n }}</b></td>
                  <td class="num">₹{{ r.a.toLocaleString('en-IN') }}</td>
                  <td class="num"><b>₹{{ r.b.toLocaleString('en-IN') }}</b></td>
                  <td class="num" [style.color]="getDeltaColor(r)" style="font-weight: 700;">
                    {{ getDeltaSign(r) }}{{ getDelta(r) }}%
                  </td>
                  <td class="muted" style="font-size: 12px;"><app-bi [k]="r.why"></app-bi></td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="card bold">
          <div class="card-head"><div class="ttl"><app-bi k="comp_gross_wages"></app-bi></div></div>
          <div class="card-body">
            <div class="col" style="gap: 10px; font-size: 12px;">
              @for (r of comp; track r.l) {
                <div>
                  <div class="row between"><span><app-bi [k]="r.l"></app-bi></span><b class="mono">₹{{ (r.v / 100000).toFixed(2) }} L</b></div>
                  <div class="bar">
                    <i [style.width.%]="r.p"
                       [style.background]="r.c === 'mute' ? 'var(--ink-mute)' : (r.c === 'leaf' ? 'var(--leaf)' : (r.c === 'amber' ? 'var(--amber)' : 'var(--accent)'))">
                    </i>
                  </div>
                </div>
              }
            </div>
            <div class="mt-16" style="padding: 12px; background: var(--bg-2); border-radius: 6px; font-size: 12px;">
              <b><app-bi k="mid_cycle_da_applied"></app-bi></b><br/>
              <span class="muted"><app-bi k="mid_cycle_da_sub"></app-bi></span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl"><app-bi k="cycle_preview"></app-bi></div></div>
        <table class="tbl">
          <thead>
            <tr>
              <th><app-bi k="emp"></app-bi></th><th><app-bi k="worker_lbl"></app-bi></th><th><app-bi k="cat"></app-bi></th><th class="num"><app-bi k="days_lbl"></app-bi></th>
              <th class="num"><app-bi k="basic_lbl"></app-bi></th><th class="num"><app-bi k="da_lbl"></app-bi></th><th class="num"><app-bi k="hl_lbl"></app-bi></th>
              <th class="num"><app-bi k="incentive_lbl"></app-bi></th><th class="num"><app-bi k="gross_lbl"></app-bi></th>
              <th class="num"><app-bi k="deduct_lbl"></app-bi></th><th class="num"><app-bi k="net_lbl"></app-bi></th>
              <th><app-bi k="status"></app-bi></th>
            </tr>
          </thead>
          <tbody>
            @for (w of workers(); track w.id; let i = $index) {
              @if (i < 8) {
                <tr>
                  <td class="mono">{{ w.id }}</td>
                  <td><b>{{ w.name }}</b></td>
                  <td>
                    <span class="badge" [ngClass]="w.cat === 'Permanent' ? 'leaf' : (w.cat === 'Casual' ? 'amber' : 'clay')" style="font-size: 9px;">
                      {{ w.cat[0] }}
                    </span>
                  </td>
                  <td class="num">{{ 26 - (i % 4) }}</td>
                  <td class="num">{{ getBasic(w, i).toLocaleString('en-IN') }}</td>
                  <td class="num">{{ getDa(w, i).toLocaleString('en-IN') }}</td>
                  <td class="num">{{ getHl(w, i) ? getHl(w, i).toLocaleString('en-IN') : '—' }}</td>
                  <td class="num">{{ getInc(w, i).toLocaleString('en-IN') }}</td>
                  <td class="num"><b>{{ getGross(w, i).toLocaleString('en-IN') }}</b></td>
                  <td class="num hl-oxide">{{ getDed(w, i).toLocaleString('en-IN') }}</td>
                  <td class="num"><b>₹{{ getNet(w, i).toLocaleString('en-IN') }}</b></td>
                  <td>
                    @if (i % 5 === 2) {
                      <span class="badge amber"><app-bi k="review_badge"></app-bi></span>
                    } @else {
                      <span class="badge leaf"><app-bi k="ok_badge"></app-bi></span>
                    }
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
        <div class="card-foot">
          <span class="muted"><app-bi k="showing_8_of"></app-bi></span>
          <div style="margin-left: auto;" class="row gap-8">
            <button class="btn ghost sm" (click)="onAction('Generating full payroll register...')"><app-bi k="view_full_register"></app-bi></button>
            <button class="btn primary sm" (click)="onAction('Submitting payroll batch for GM approval...')"><app-bi k="submit_for_approval"></app-bi></button>
          </div>
        </div>
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
export class PayrollComponent {
  dataService = inject(DataService);
  workers = this.dataService.workers;
  toastMessage = signal<string | null>(null);

  stages = [
    { id: 'collect', t: 'collect_inputs', sub: 'collect_inputs_sub', st: 'done' },
    { id: 'compute', t: 'compute_wages', sub: 'compute_wages_sub', st: 'done' },
    { id: 'review',  t: 'review_variances', sub: 'review_variances_sub', st: 'current' },
    { id: 'approve', t: 'approval_ladder', sub: 'approval_ladder_sub', st: 'pending' },
    { id: 'disburse',t: 'disburse',        sub: 'disburse_sub', st: 'pending' },
    { id: 'payslip', t: 'payslip_release',sub: 'payslip_release_sub', st: 'pending' },
  ];

  variances = [
    {e:'EMP-1042', n:'Rajan Pillai', a:23142, b:28851, why:'drc_inc_up'},
    {e:'EMP-1311', n:'Suresh Babu',  a:18432, b:13280, why:'days_3_absent'},
    {e:'EMP-1505', n:'Anil Kumar',   a:22480, b:25102, why:'ot_12_hrs'},
    {e:'EMP-1617', n:'Geetha Mohan', a:23146, b:29842, why:'drc_hl_up'},
    {e:'EMP-2055', n:'Saritha Anand',a:14820, b:12640, why:'low_drc_pen'},
  ];

  comp = [
    {l:'basic_wages',                  v: 4218000, p:62, c:'leaf'},
    {l:'da',      v:  945000, p:14, c:'amber'},
    {l:'hra',         v:  302000, p: 4, c:'clay'},
    {l:'hl_slab',v:  486000, p: 7, c:'clay'},
    {l:'drc_yield_inc',        v:  864000, p:13, c:'leaf'},
    {l:'overtime',                     v:   42000, p: 1, c:'mute'},
  ];

  getDelta(r: any) { return ((r.b - r.a) / r.a * 100).toFixed(1); }
  getDeltaSign(r: any) { return parseFloat(this.getDelta(r)) >= 0 ? '+' : ''; }
  getDeltaColor(r: any) { return parseFloat(this.getDelta(r)) >= 0 ? 'var(--leaf)' : 'var(--oxide)'; }

  getBasic(w: any, i: number) { return w.wage * 26; }
  getDa(w: any, i: number) { return Math.round(this.getBasic(w, i) * 0.25); }
  getHl(w: any, i: number) { return w.role === 'Tapper' ? Math.round(1200 + i * 54) : 0; }
  getInc(w: any, i: number) { return w.role === 'Tapper' ? Math.round(2200 + i * 180) : (w.role.includes('Sup.') ? 1800 : 600); }
  getGross(w: any, i: number) { return this.getBasic(w, i) + this.getDa(w, i) + this.getHl(w, i) + this.getInc(w, i) + Math.round(w.wage * 0.08); }
  getDed(w: any, i: number) { return Math.round(this.getGross(w, i) * 0.135); }
  getNet(w: any, i: number) { return this.getGross(w, i) - this.getDed(w, i); }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }
}
