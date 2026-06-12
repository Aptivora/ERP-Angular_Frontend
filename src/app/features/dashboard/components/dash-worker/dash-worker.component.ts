import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { BarChartComponent } from '../../../../shared/components/charts/bar-chart.component';
import { DataService } from '../../../../core/services/data.service';
import { Role } from '../../../../core/services/roles.service';

@Component({
  selector: 'app-dash-worker',
  standalone: true,
  imports: [CommonModule, IconComponent, BarChartComponent],
  template: `
    <div class="grid mb-16" style="grid-template-columns: 1fr 1.4fr; gap: 16px;">
      <!-- Hero card · my pay -->
      <div class="card bold" style="background: var(--accent); color: var(--accent-ink); border: none;">
        <div class="card-body" style="padding: 24px;">
          <div class="row gap-16" style="align-items: center;">
            <div class="avatar" style="width: 48px; height: 48px; font-size: 16px; background: var(--accent-ink); color: var(--accent);">{{ role?.avatar }}</div>
            <div>
              <div class="ml" style="font-weight: 700; font-size: 18px;">{{ role?.nameMl }}</div>
              <div style="font-size: 13px; opacity: 0.85;">{{ role?.name }} · {{ role?.title }}</div>
              <div style="font-size: 11px; opacity: 0.7; font-family: var(--font-mono);">{{ role?.empId }} · {{ role?.block }}</div>
            </div>
          </div>
          <div style="margin-top: 24px;">
            <div style="font-size: 10px; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Net pay · this cycle · അറ്റ വേതനം</div>
            <div class="mono" style="font-size: 46px; font-weight: 800; line-height: 1; margin-top: 4px;">₹{{ netPay.toLocaleString('en-IN') }}</div>
            <div style="font-size: 12px; opacity: 0.85; margin-top: 4px;">NEFT credit · 31 May 2026 · {{ p.emp.acct }}</div>
          </div>
          <div class="row gap-8 mt-16">
            <a href="#payslip" class="btn" style="background: var(--accent-ink); color: var(--accent); border-color: var(--accent-ink);"><app-icon name="Download" [size]="12"></app-icon>Download payslip</a>
            <a href="#payslip" class="btn ghost" style="border-color: rgba(255,255,255,0.4); color: var(--accent-ink);">View detail</a>
          </div>
        </div>
      </div>

      <!-- This cycle stats -->
      <div class="card bold">
        <div class="card-head"><div class="ttl">This cycle so far · 21 Apr → 25 May</div></div>
        <div class="card-body grid g-4" style="gap: 14px;">
          <div><div class="muted up" style="font-size: 10px;">Days present</div><div class="mono" style="font-size: 26px; font-weight: 700;">24<span style="font-size: 12px; color: var(--ink-3);">/26</span></div></div>
          <div><div class="muted up" style="font-size: 10px;">Latex dry</div><div class="mono" style="font-size: 26px; font-weight: 700;">284<span style="font-size: 12px; color: var(--ink-3);"> kg</span></div></div>
          <div><div class="muted up" style="font-size: 10px;">Δ Base yield</div><div class="mono" style="font-size: 26px; font-weight: 700; color: var(--leaf);">+ 6.4%</div></div>
          <div><div class="muted up" style="font-size: 10px;">DRC avg</div><div class="mono" style="font-size: 26px; font-weight: 700;">33.8<span style="font-size: 12px; color: var(--ink-3);">%</span></div></div>
          <div><div class="muted up" style="font-size: 10px;">Head-load</div><div class="mono" style="font-size: 26px; font-weight: 700;">1,402<span style="font-size: 12px; color: var(--ink-3);"> m</span></div></div>
          <div><div class="muted up" style="font-size: 10px;">Incentive earned</div><div class="mono" style="font-size: 26px; font-weight: 700; color: var(--accent);">₹2,840</div></div>
          <div><div class="muted up" style="font-size: 10px;">Leave balance</div><div class="mono" style="font-size: 26px; font-weight: 700;">8<span style="font-size: 12px; color: var(--ink-3);"> CL · 4 EL</span></div></div>
          <div><div class="muted up" style="font-size: 10px;">Co-op balance</div><div class="mono" style="font-size: 26px; font-weight: 700;">₹4,200</div></div>
        </div>
      </div>
    </div>

    <div class="grid mb-16" style="grid-template-columns: 1.4fr 1fr; gap: 16px;">
      <div class="card bold">
        <div class="card-head">
          <div class="ttl">My daily production · last 14 days</div>
          <div class="row gap-8" style="margin-left: auto; font-size: 11px;">
            <span class="chip"><span class="dot" style="background: var(--accent);"></span>My dry kg</span>
            <span class="chip"><span class="dot" style="background: var(--oxide);"></span>Base 10.5 kg</span>
          </div>
        </div>
        <div class="card-body">
          <app-bar-chart [data]="chartData" [w]="620" [h]="200"></app-bar-chart>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">My recent days</div></div>
        <table class="tbl dense">
          <thead><tr><th>Date</th><th>Cycle</th><th class="num">Trees</th><th class="num">Dry kg</th><th>Status</th></tr></thead>
          <tbody>
            @for (r of recentDays; track r.d) {
              <tr>
                <td>{{ r.d }}</td>
                <td><span class="cycle" [ngClass]="r.c.toLowerCase()">{{ r.c }}</span></td>
                <td class="num">{{ r.t }}</td>
                <td class="num mono"><b>{{ r.y }}</b></td>
                <td>
                  @if (r.s === 'verified') {
                    <span class="badge leaf">Verified</span>
                  } @else {
                    <span class="badge amber">Pending</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid g-4 mb-16">
      @for (a of actions; track a.l) {
        <a [href]="a.r === '#' ? null : '#' + a.r" class="card bold" style="padding: 18px; text-decoration: none; cursor: pointer;">
          <div class="row gap-16" style="align-items: center;">
            <div style="width: 42px; height: 42px; border-radius: 8px; background: var(--bg-3); display: grid; place-items: center;">
              <app-icon [name]="a.i" [size]="20"></app-icon>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px;">{{ a.l }}</div>
              <div class="muted" style="font-size: 11px;">{{ a.s }}</div>
            </div>
          </div>
        </a>
      }
    </div>

    <div class="card bold">
      <div class="card-head"><div class="ttl">Notices from estate office · എസ്റ്റേറ്റ് നോട്ടീസ്</div></div>
      <div class="card-body col" style="gap: 12px; font-size: 12px;">
        <div class="row gap-8" style="align-items: flex-start;">
          <span class="badge clay" style="min-width: 54px; justify-content: center;">WAGES</span>
          <div>
            <b>DA hike of ₹186/day applicable from 29-Apr-2026</b>
            <div class="muted">Per GO(Rt) 412/2026/Lab. Mid-cycle rate auto-prorated in this payslip.</div>
          </div>
        </div>
        <div class="row gap-8" style="align-items: flex-start; padding-top: 10px; border-top: var(--bd-soft);">
          <span class="badge leaf" style="min-width: 54px; justify-content: center;">MEDICAL</span>
          <div>
            <b>Free health camp · 02 June 2026 · Kulathupuzha Estate clinic</b>
            <div class="muted">All workers and dependents eligible. Report 08:00 to 14:00.</div>
          </div>
        </div>
        <div class="row gap-8" style="align-items: flex-start; padding-top: 10px; border-top: var(--bd-soft);">
          <span class="badge amber" style="min-width: 54px; justify-content: center;">RAIN</span>
          <div>
            <b>Monsoon rainguarding starts 10 June</b>
            <div class="muted">Apply rainguard polythene strips before south-west monsoon. Field supervisor will instruct.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashWorkerComponent {
  @Input({ required: true }) role!: Role | undefined;

  private dataService = inject(DataService);

  get p() {
    return this.dataService.payslip;
  }

  get netPay() {
    const earningsTotal = this.p.earnings.reduce((s,r) => s + r.amount, 0);
    const dedTotal = this.p.deductions.reduce((s,r) => s + r.amount, 0);
    return earningsTotal - dedTotal;
  }

  chartData = [
    {d:'12',latex:10.1,scrap:0.9,base:10.5},
    {d:'13',latex:11.2,scrap:1.0,base:10.5},
    {d:'14',latex:10.8,scrap:1.1,base:10.5},
    {d:'15',latex:9.4, scrap:0.8,base:10.5},
    {d:'16',latex:11.6,scrap:1.2,base:10.5},
    {d:'17',latex:12.1,scrap:1.3,base:10.5},
    {d:'19',latex:10.9,scrap:1.0,base:10.5},
    {d:'20',latex:11.3,scrap:1.1,base:10.5},
    {d:'21',latex:10.6,scrap:0.9,base:10.5},
    {d:'22',latex:11.8,scrap:1.2,base:10.5},
    {d:'23',latex:12.4,scrap:1.3,base:10.5},
    {d:'24',latex:10.9,scrap:1.0,base:10.5},
    {d:'25',latex:10.95,scrap:1.05,base:10.5},
  ];

  recentDays = [
    {d:'25 May',c:'D1',t:380, y:10.95, s:'pending'},
    {d:'24 May',c:'D4',t:380, y:10.93, s:'verified'},
    {d:'23 May',c:'D3',t:380, y:12.40, s:'verified'},
    {d:'22 May',c:'D2',t:380, y:11.80, s:'verified'},
    {d:'21 May',c:'D1',t:380, y:10.60, s:'verified'},
    {d:'20 May',c:'D4',t:380, y:11.30, s:'verified'},
    {d:'19 May',c:'D3',t:380, y:10.90, s:'verified'},
  ];

  get actions() {
    return [
      {l:'View payslip', s:'EN · ML · Mobile', i:'Print', r:'payslip'},
      {l:'Apply for leave', s:'CL · EL · Sick', i:'Calendar', r:'#'},
      {l:'Co-op society', s:'Balance ₹4,200', i:'Wallet', r:'#'},
      {l:'My bank details', s:`A/c ${this.p.emp.acct}`, i:'Lock', r:'#'},
    ];
  }
}
