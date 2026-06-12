import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BarChartComponent } from '../../shared/components/charts/bar-chart.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, BarChartComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Reports & Analytics"
        ml="റിപ്പോർട്ടുകൾ"
        sub="Production · Wages · Yield variance · Compliance · Audit"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Exporting report as CSV...')"><app-icon name="Download" [size]="13"></app-icon>Export</button>
          <button class="btn ghost sm" (click)="onAction('Report schedule configured.')">Schedule</button>
          <button class="btn primary sm" (click)="onAction('Opening custom report builder...')"><app-icon name="Plus" [size]="13"></app-icon>Custom report</button>
        </ng-container>
      </app-page-head>

      <div class="tabs mb-16">
        @for (t of tabsList; track t.id) {
          <div class="tab" [class.active]="tab === t.id" (click)="tab = t.id">{{ t.l }}</div>
        }
      </div>

      <div class="row mb-16 gap-8" style="flex-wrap: wrap;">
        <div class="field"><label>Date range</label><input class="input mono" [value]="'01-04-2026 → 25-05-2026'" style="width: 230px;" /></div>
        <div class="field">
          <label>Estate</label>
          <select class="select" [ngModel]="selectedEstate()" (ngModelChange)="selectedEstate.set($event)">
            <option value="All estates">All estates</option>
            @for (e of dataService.estates; track e.id) {
              <option [value]="e.id">{{ e.name }}</option>
            }
          </select>
        </div>
        <div class="field"><label>Group by</label><select class="select" [(ngModel)]="groupBy"><option>Estate</option><option>Block</option><option>Worker</option><option>Cycle (D1–D4)</option></select></div>
        <div class="field"><label>Aggregate</label><select class="select" [(ngModel)]="aggregateBy"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
        <button class="btn ghost sm mt-16" (click)="onAction('Filters applied and data refreshed.')">Apply</button>
      </div>

      @if (tab === 'production') {
        <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
          <div class="card bold">
            <div class="card-head">
              <div class="ttl">FY26 Production · monthly</div>
              <span class="muted" style="margin-left: auto; font-size: 12px;">Latex (dry, tonnes) · all estates</span>
            </div>
            <div class="card-body" style="overflow-x: auto;">
              <app-bar-chart [data]="prodChartData" [w]="780" [h]="240"></app-bar-chart>
            </div>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Top performing blocks · MTD</div></div>
            <table class="tbl dense">
              <thead><tr><th>#</th><th>Block</th><th class="num">Dry kg</th><th class="num">Δ Base</th></tr></thead>
              <tbody>
                @for (r of topBlocks; track r.b; let i = $index) {
                  <tr>
                    <td class="mono">{{ i + 1 }}</td>
                    <td><b>{{ r.b }}</b></td>
                    <td class="num">{{ r.v.toLocaleString('en-IN') }}</td>
                    <td class="num hl-leaf">{{ r.d }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div class="card bold">
          <div class="card-head"><div class="ttl">Estate × cycle production matrix · this week</div></div>
          <table class="tbl">
            <thead><tr><th>Estate</th><th class="num">D1</th><th class="num">D2</th><th class="num">D3</th><th class="num">D4</th><th class="num">Total</th><th>Cycle balance</th></tr></thead>
            <tbody>
              @for (e of filteredEstates(); track e.id; let i = $index) {
                <tr>
                  <td><b>{{ e.name }}</b></td>
                  <td class="num">{{ getCyc(i, 1).toLocaleString() }}</td>
                  <td class="num">{{ getCyc(i, 2).toLocaleString() }}</td>
                  <td class="num">{{ getCyc(i, 3).toLocaleString() }}</td>
                  <td class="num">{{ getCyc(i, 4).toLocaleString() }}</td>
                  <td class="num"><b>{{ getTot(i).toLocaleString() }}</b></td>
                  <td>
                    <div class="row gap-8" style="height: 14px;">
                      <div [style.flex]="getCyc(i, 1)" style="background: var(--tap-d1);"></div>
                      <div [style.flex]="getCyc(i, 2)" style="background: var(--tap-d2);"></div>
                      <div [style.flex]="getCyc(i, 3)" style="background: var(--tap-d3);"></div>
                      <div [style.flex]="getCyc(i, 4)" style="background: var(--tap-d4);"></div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (tab === 'wages') {
        <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
          <div class="card bold">
            <div class="card-head"><div class="ttl">Wage cost · last 6 cycles</div></div>
            <div class="card-body" style="overflow-x: auto;">
              <app-bar-chart [data]="wageChartData" [w]="580" [h]="230" [colors]="['var(--accent)', 'var(--amber)']"></app-bar-chart>
              <div class="muted" style="font-size: 11px; margin-top: 8px;">Basic + DA + HL · vs incentives + OT (dashed = budget envelope)</div>
            </div>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Cost per kg dry rubber</div></div>
            <div class="card-body col" style="gap: 10px; font-size: 12px;">
              @for (e of filteredEstates(); track e.id; let i = $index) {
                <div>
                  <div class="row between"><span>{{ e.name.split(' ')[0] }}</span><b class="mono">₹{{ getCost(i) }}/kg</b></div>
                  <div class="bar">
                    <i [style.width.%]="getCostPct(i)"
                       [style.background]="getCost(i) < 40 ? 'var(--leaf)' : (getCost(i) < 43 ? 'var(--amber)' : 'var(--oxide)')"></i>
                  </div>
                </div>
              }
              <div class="mt-16 muted" style="font-size: 11px;">Industry benchmark: ₹38–42/kg dry rubber</div>
            </div>
          </div>
        </div>
      }

      @if (tab === 'yield') {
        <div class="card bold">
          <div class="card-head"><div class="ttl">Yield vs base yield · variance map</div></div>
          <div class="card-body" style="overflow-x: auto;">
            <div style="display: grid; grid-template-columns: 120px repeat(14, 1fr); gap: 2px; font-size: 10px; min-width: 600px;">
              <div></div>
              @for (i of arr14; track i) {
                <div class="mono" style="text-align: center; color: var(--ink-3); font-weight: 700;">{{ pad(i + 12) }}</div>
              }
              @for (b of yieldBlocks; track b) {
                <div class="mono" style="padding: 4px 6px; font-weight: 700; font-size: 11px;">{{ b }}</div>
                @for (i of arr14; track i) {
                  <div [style.background]="getYieldColor(i, b)"
                       [style.color]="getYieldTextColor(i, b)"
                       style="height: 28px; display: grid; place-items: center; font-family: var(--font-mono); font-size: 9px;">
                    {{ getYieldVal(i, b) }}%
                  </div>
                }
              }
            </div>
            <div class="row gap-16 mt-16" style="font-size: 11px; flex-wrap: wrap;">
              <span class="row gap-8"><span style="width: 14px; height: 14px; background: var(--oxide);"></span>Below −10%</span>
              <span class="row gap-8"><span style="width: 14px; height: 14px; background: var(--oxide-soft);"></span>−5 to −10%</span>
              <span class="row gap-8"><span style="width: 14px; height: 14px; background: var(--amber-soft);"></span>±5%</span>
              <span class="row gap-8"><span style="width: 14px; height: 14px; background: #84b89f;"></span>+5 to +10%</span>
              <span class="row gap-8"><span style="width: 14px; height: 14px; background: var(--leaf);"></span>Above +10%</span>
            </div>
          </div>
        </div>
      }

      @if (tab === 'workforce') {
        <div class="card bold">
          <div class="card-head"><div class="ttl">Workforce attendance · 30-day trend</div></div>
          <div class="card-body" style="padding: 20px;">
            <div class="muted" style="font-size: 12px;">96.2% average attendance across 1,623 workers. 14 with chronic absenteeism flagged for HR review. See workforce dashboard for full analytics.</div>
          </div>
        </div>
      }

      @if (tab === 'compliance') {
        <div class="grid g-2">
          @for (r of compliances; track r.t) {
            <div class="card bold" [style.border-left]="'4px solid var(--' + r.st + ')'">
              <div class="card-body">
                <div class="row between">
                  <b>{{ r.t }}</b>
                  <span class="badge" [ngClass]="r.st">{{ r.st === 'leaf' ? 'Compliant' : (r.st === 'amber' ? 'Due soon' : 'Overdue') }}</span>
                </div>
                <div class="muted mt-8" style="font-size: 12px;">{{ r.s }}</div>
              </div>
            </div>
          }
        </div>
      }

      @if (tab === 'audit') {
        <div class="card bold">
          <div class="table-responsive">
            <table class="tbl">
              <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>Reference</th><th>IP</th></tr></thead>
              <tbody>
                @for (l of audits; track $index) {
                  <tr>
                    <td class="mono" style="font-size: 11px;">{{ l.ts }}</td>
                    <td>{{ l.u }}</td>
                    <td>{{ l.a }}</td>
                    <td><span class="chip">{{ l.m }}</span></td>
                    <td class="mono" style="font-size: 12px;">{{ l.r }}</td>
                    <td class="mono muted" style="font-size: 11px;">{{ l.ip }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
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
export class ReportsComponent {
  tab = 'production';
  dataService = inject(DataService);
  
  toastMessage = signal<string | null>(null);
  selectedEstate = signal('All estates');
  groupBy = 'Estate';
  aggregateBy = 'Monthly';

  filteredEstates = computed(() => {
    const est = this.selectedEstate();
    if (est === 'All estates') return this.dataService.estates;
    return this.dataService.estates.filter(e => e.id === est);
  });

  tabsList = [
    { id: 'production', l: 'Production' },
    { id: 'wages', l: 'Wages & Cost' },
    { id: 'yield', l: 'Yield vs Base' },
    { id: 'workforce', l: 'Workforce' },
    { id: 'compliance', l: 'Compliance' },
    { id: 'audit', l: 'Audit log' },
  ];

  prodChartData = [
    { d: 'Apr', latex: 178, scrap: 14, base: 170, target: 185 },
    { d: 'May', latex: 206, scrap: 18, base: 180, target: 200 },
    { d: 'Jun', latex: 165, scrap: 13, base: 165, target: 180 },
    { d: 'Jul', latex: 142, scrap: 11, base: 140, target: 155 },
    { d: 'Aug', latex: 118, scrap: 9, base: 120, target: 130 },
    { d: 'Sep', latex: 148, scrap: 12, base: 150, target: 165 },
    { d: 'Oct', latex: 212, scrap: 18, base: 190, target: 200 },
    { d: 'Nov', latex: 236, scrap: 21, base: 215, target: 230 },
    { d: 'Dec', latex: 268, scrap: 24, base: 240, target: 255 },
    { d: 'Jan', latex: 284, scrap: 26, base: 260, target: 270 },
    { d: 'Feb', latex: 241, scrap: 22, base: 220, target: 235 },
    { d: 'Mar', latex: 198, scrap: 18, base: 185, target: 200 },
  ];

  topBlocks = [
    { b: 'KLP-B12 Aryankavu A', v: 36412, d: '+18.2%' },
    { b: 'ATR-B04 Charpa', v: 34128, d: '+14.8%' },
    { b: 'THD-B19 Idamalayar', v: 32940, d: '+12.6%' },
    { b: 'KLP-B27 Tenmala T1', v: 31218, d: '+10.4%' },
    { b: 'PNR-B11 Anchal A', v: 30540, d: '+9.8%' },
    { b: 'KLP-B33 Vilakkupara V3', v: 28932, d: '+8.1%' },
  ];

  wageChartData = [
    { d: 'Dec', latex: 6420000, scrap: 850000, base: 7000000 },
    { d: 'Jan', latex: 6810000, scrap: 920000, base: 7000000 },
    { d: 'Feb', latex: 6520000, scrap: 880000, base: 7000000 },
    { d: 'Mar', latex: 6280000, scrap: 820000, base: 7000000 },
    { d: 'Apr', latex: 6184000, scrap: 760000, base: 7000000 },
    { d: 'May', latex: 6580000, scrap: 860000, base: 7000000 },
  ];

  arr14 = Array.from({ length: 14 }, (_, i) => i);
  yieldBlocks = ['KLP-B07', 'KLP-B08', 'KLP-B12', 'KLP-B14', 'KLP-B27', 'KLP-B28', 'KLP-B33', 'ATR-B04', 'ATR-B07', 'THD-B19'];

  compliances = [
    { t: 'PF · ESI remittance', s: 'On time · paid 18-May-2026', st: 'leaf' },
    { t: 'Plantation Labour Act registers', s: 'Form A, B, C up to date', st: 'leaf' },
    { t: 'Minimum wage', s: 'DA hike GO/412 applied 29-Apr', st: 'leaf' },
    { t: 'Welfare fund · Plantation', s: '₹80/worker remitted', st: 'leaf' },
    { t: 'GST returns', s: 'GSTR-1 filed · GSTR-3B due 24-May', st: 'amber' },
    { t: 'Rubber Board production return', s: 'Pending Apr submission', st: 'oxide' },
  ];

  audits = [
    { ts: '25 May · 09:41:12', u: 'P. Suresh Kumar (estate-mgr)', a: 'Approved DPS batch', m: 'DPS', r: 'DPS-9201/D1', ip: '10.42.18.6' },
    { ts: '25 May · 09:32:48', u: 'V. Raj (supervisor)', a: 'Verified entry', m: 'DPS', r: 'EMP-1042/25-May', ip: '10.42.18.42' },
    { ts: '25 May · 09:18:01', u: 'Reena Vijayan (supervisor)', a: 'Marked absent', m: 'Attendance', r: 'EMP-1311/25-May', ip: '10.42.18.31' },
    { ts: '25 May · 08:58:33', u: 'CC-Main (system)', a: 'Recorded intake', m: 'Collection', r: 'B-008/KLP-B12', ip: '10.42.18.2' },
    { ts: '25 May · 08:42:08', u: 'admin@sfck.in', a: 'Updated DA rate', m: 'Payroll Cfg', r: 'GO 412/2026', ip: '103.4.12.18' },
    { ts: '25 May · 08:20:11', u: 'P. Suresh Kumar (estate-mgr)', a: 'Generated muster', m: 'Attendance', r: 'M-9201', ip: '10.42.18.6' },
    { ts: '24 May · 18:42:01', u: 'system (cron)', a: 'Auto wage computation', m: 'Payroll', r: 'CYC-202605', ip: '127.0.0.1' },
    { ts: '24 May · 17:18:42', u: 'Ratheesh K. (GM)', a: 'Reviewed estate report', m: 'Reports', r: 'RPT-MTD-KLP', ip: '10.40.4.2' },
  ];

  getCyc(i: number, cyc: number) {
    const d1 = [2412, 2010, 2284, 1872, 1648][i];
    const d2 = [2510, 2104, 2378, 1962, 1742][i];
    const d3 = [2618, 2196, 2462, 2018, 1812][i];
    const d4 = [2740, 2266, 2540, 2104, 1898][i];
    return [d1, d2, d3, d4][cyc - 1];
  }

  getTot(i: number) {
    return this.getCyc(i, 1) + this.getCyc(i, 2) + this.getCyc(i, 3) + this.getCyc(i, 4);
  }

  getCost(i: number) {
    return [38.2, 41.6, 36.9, 39.1, 44.2][i];
  }

  getCostPct(i: number) {
    return ((50 - this.getCost(i)) / 12) * 100;
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  getYieldV(i: number, b: string) {
    return (Math.sin(i * 0.7 + b.length) * 0.5 + 0.5); // 0..1
  }

  getYieldColor(i: number, b: string) {
    const v = this.getYieldV(i, b);
    return v > 0.7 ? 'var(--leaf)' : v > 0.5 ? '#84b89f' : v > 0.35 ? 'var(--amber-soft)' : v > 0.2 ? 'var(--oxide-soft)' : 'var(--oxide)';
  }

  getYieldTextColor(i: number, b: string) {
    const v = this.getYieldV(i, b);
    return v > 0.5 ? 'white' : 'var(--ink)';
  }

  getYieldVal(i: number, b: string) {
    const v = this.getYieldV(i, b);
    return (v * 30 - 15).toFixed(0);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }
}
