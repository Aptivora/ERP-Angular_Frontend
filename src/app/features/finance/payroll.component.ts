import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Payroll"
        ml="വേതനം"
        sub="Cycle 21 Apr – 20 May 2026 · 21st-to-20th roll · 1,623 workers"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Recomputing wages based on latest attendance...')"><app-icon name="Refresh" [size]="13"></app-icon>Recompute</button>
          <button class="btn ghost sm" (click)="onAction('Generating bank transfer file (NEFT)...')"><app-icon name="Download" [size]="13"></app-icon>Bank file (NEFT)</button>
          <button class="btn primary sm" (click)="onAction('Closing payroll cycle and initiating approval ladder...')"><app-icon name="Check" [size]="13"></app-icon>Close cycle</button>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        <div class="kpi accent"><div class="label">Gross wages</div><div class="value">₹68.4<span class="unit">lakh</span></div><div class="delta">21 Apr – 20 May · 1,623 workers</div></div>
        <div class="kpi"><div class="label">Avg wage / worker</div><div class="value">₹21,432</div><div class="delta up">▲ ₹186 (DA hike applied)</div></div>
        <div class="kpi"><div class="label">DRC incentive pool</div><div class="value">₹8.6<span class="unit">lakh</span></div><div class="delta">412 tappers above base</div></div>
        <div class="kpi"><div class="label">Variance flags</div><div class="value">12</div><div class="delta down">needs review before close</div></div>
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
                  <b style="font-size: 13px;">{{ s.t }}</b>
                </div>
                <div class="muted" style="font-size: 11px; margin-left: 30px;">{{ s.sub }}</div>
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
            <div class="ttl">Wage variance · needs review</div>
            <span class="badge oxide" style="margin-left: auto;">12 flags</span>
          </div>
          <table class="tbl">
            <thead>
              <tr><th>EMP</th><th>Worker</th><th class="num">Last cycle</th><th class="num">This cycle</th><th class="num">Δ</th><th>Reason</th></tr>
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
                  <td class="muted" style="font-size: 12px;">{{ r.why }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="card bold">
          <div class="card-head"><div class="ttl">Composition of gross wages · ₹68.4 lakh</div></div>
          <div class="card-body">
            <div class="col" style="gap: 10px; font-size: 12px;">
              @for (r of comp; track r.l) {
                <div>
                  <div class="row between"><span>{{ r.l }}</span><b class="mono">₹{{ (r.v / 100000).toFixed(2) }} L</b></div>
                  <div class="bar">
                    <i [style.width.%]="r.p"
                       [style.background]="r.c === 'mute' ? 'var(--ink-mute)' : (r.c === 'leaf' ? 'var(--leaf)' : (r.c === 'amber' ? 'var(--amber)' : 'var(--accent)'))">
                    </i>
                  </div>
                </div>
              }
            </div>
            <div class="mt-16" style="padding: 12px; background: var(--bg-2); border-radius: 6px; font-size: 12px;">
              <b>Mid-cycle DA hike applied: ₹186/worker × 1,623 = ₹3,01,878</b><br/>
              <span class="muted">Per GO(Rt) No. 412/2026/Lab. dated 28-Apr-2026. Auto-prorated 21-Apr to 28-Apr at old rate, 29-Apr onward at new rate.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">Cycle preview · all workers</div></div>
        <table class="tbl">
          <thead>
            <tr>
              <th>EMP</th><th>Worker</th><th>Cat.</th><th class="num">Days</th>
              <th class="num">Basic</th><th class="num">DA</th><th class="num">HL</th>
              <th class="num">Incentive</th><th class="num">Gross</th>
              <th class="num">Deduct</th><th class="num">Net</th>
              <th>Status</th>
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
                      <span class="badge amber">Review</span>
                    } @else {
                      <span class="badge leaf">OK</span>
                    }
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
        <div class="card-foot">
          <span class="muted">Showing 8 of 1,623 · totals at bottom of cycle report</span>
          <div style="margin-left: auto;" class="row gap-8">
            <button class="btn ghost sm" (click)="onAction('Generating full payroll register...')">View full register</button>
            <button class="btn primary sm" (click)="onAction('Submitting payroll batch for GM approval...')">Submit for approval</button>
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
    { id: 'collect', t: 'Collect inputs', sub: 'Attendance + DPS + Mazdoor', st: 'done' },
    { id: 'compute', t: 'Compute wages', sub: 'Slabs · DA · incentives', st: 'done' },
    { id: 'review',  t: 'Review variances', sub: '12 anomalies flagged', st: 'current' },
    { id: 'approve', t: 'Approval ladder', sub: 'EM → GM → MD', st: 'pending' },
    { id: 'disburse',t: 'Disburse',        sub: 'NEFT batch to KSB', st: 'pending' },
    { id: 'payslip', t: 'Payslip release',sub: 'EN + ML PDFs · SMS link', st: 'pending' },
  ];

  variances = [
    {e:'EMP-1042', n:'Rajan Pillai', a:23142, b:28851, why:'DRC incentive ▲'},
    {e:'EMP-1311', n:'Suresh Babu',  a:18432, b:13280, why:'3 days absent'},
    {e:'EMP-1505', n:'Anil Kumar',   a:22480, b:25102, why:'OT 12 hrs'},
    {e:'EMP-1617', n:'Geetha Mohan', a:23146, b:29842, why:'DRC + head-load ▲'},
    {e:'EMP-2055', n:'Saritha Anand',a:14820, b:12640, why:'Low DRC penalty'},
  ];

  comp = [
    {l:'Basic wages',                  v: 4218000, p:62, c:'leaf'},
    {l:'Dearness Allowance (DA)',      v:  945000, p:14, c:'amber'},
    {l:'House Rent Allowance',         v:  302000, p: 4, c:'clay'},
    {l:'Head-load charge (slab-based)',v:  486000, p: 7, c:'clay'},
    {l:'DRC / yield incentive',        v:  864000, p:13, c:'leaf'},
    {l:'Overtime',                     v:   42000, p: 1, c:'mute'},
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
