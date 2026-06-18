import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiRowComponent } from '../kpi-row/kpi-row.component';
import { BarChartComponent } from '../../../../shared/components/charts/bar-chart.component';
import { DonutComponent } from '../../../../shared/components/charts/donut.component';
import { DataService } from '../../../../core/services/data.service';
import { RouterModule } from '@angular/router';
import { BiComponent } from '../../../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dash-a',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiRowComponent, BarChartComponent, DonutComponent, BiComponent],
  template: `
    <app-kpi-row [accent]="true"></app-kpi-row>

    <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
      <div class="card bold">
        <div class="card-head">
          <div>
            <div class="ttl"><app-bi k="estate_production"></app-bi></div>
            <div class="sub"><app-bi k="estate_sub"></app-bi></div>
          </div>
          <div style="margin-left: auto;" class="row gap-8">
            <span class="chip"><span class="dot" style="background: var(--accent);"></span> <app-bi k="latex"></app-bi></span>
            <span class="chip"><span class="dot" style="background: var(--ink-3);"></span> <app-bi k="scrap"></app-bi></span>
            <span class="chip"><span class="dot" style="background: var(--oxide);"></span> <app-bi k="base"></app-bi></span>
          </div>
        </div>
        <div class="card-body">
          <app-bar-chart [data]="dataService.prodTrend" [w]="720" [h]="220"></app-bar-chart>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head">
          <div class="ttl"><app-bi k="today_by_cycle"></app-bi></div>
          <span class="badge clay" style="margin-left: auto;"><app-bi k="d4_in_progress"></app-bi></span>
        </div>
        <div class="card-body row" style="gap: 16px;">
          <app-donut 
            [segments]="[
              {v: 1880, color:'var(--tap-d1)'},
              {v: 2240, color:'var(--tap-d2)'},
              {v: 2480, color:'var(--tap-d3)'},
              {v: 2820, color:'var(--tap-d4)'}
            ]" 
            [size]="140">
          </app-donut>
          <div class="col" style="flex: 1; gap: 6px;">
            @for (r of cycleRows; track r.d) {
              <div>
                <div class="row between" style="font-size: 12px;">
                  <span class="row gap-8"><span class="cycle" [ngClass]="r.d.toLowerCase()">{{ r.d }}</span> {{ r.l }}</span>
                  <span class="mono"><b>{{ r.v }}</b> kg</span>
                </div>
                <div class="bar mt-8" style="margin-top: 4px;"><i [style.width.%]="r.p"></i></div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <div class="grid g-2 mb-16">
      <div class="card bold">
        <div class="card-head">
          <div class="ttl"><app-bi k="tappers_attention"></app-bi></div>
          <button class="btn ghost sm" style="margin-left: auto;" routerLink="/workers"><app-bi k="view_all"></app-bi></button>
        </div>
        <table class="tbl dense">
          <thead>
            <tr>
              <th><app-bi k="tapper"></app-bi></th><th><app-bi k="block"></app-bi></th><th><app-bi k="issue"></app-bi></th><th class="num"><app-bi k="vs_base"></app-bi></th>
            </tr>
          </thead>
          <tbody>
            <tr><td><b>Saritha Anand</b><div class="muted" style="font-size: 11px;">EMP-2055</div></td><td><span class="cycle d2">D2</span> KLP-B08</td><td><span class="badge oxide">Low DRC 31.4%</span></td><td class="num hl-oxide">-18%</td></tr>
            <tr><td><b>Suresh Babu</b><div class="muted" style="font-size: 11px;">EMP-1311</div></td><td><span class="cycle d3">D3</span> KLP-B12</td><td><span class="badge amber">Absent · 3 days</span></td><td class="num hl-oxide">-100%</td></tr>
            <tr><td><b>Anil Kumar</b><div class="muted" style="font-size: 11px;">EMP-1505</div></td><td><span class="cycle d4">D4</span> KLP-B27</td><td><span class="badge amber">DPS pending</span></td><td class="num">—</td></tr>
            <tr><td><b>Vinod Raj</b><div class="muted" style="font-size: 11px;">EMP-1944</div></td><td>Supervisor</td><td><span class="badge clay">9 entries to verify</span></td><td class="num">—</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head">
          <div class="ttl"><app-bi k="approvals_queue"></app-bi></div>
          <span class="badge solid" style="margin-left: auto;"><app-bi k="pending_badge"></app-bi></span>
        </div>
        <div class="card-body col" style="gap: 10px;">
          @for (a of approvals; track a.t) {
            <div class="row" style="padding: 10px; border: var(--bd-soft); border-radius: 6px; gap: 12px;">
              <span class="badge solid" style="min-width: 46px; justify-content: center;">{{ a.tag }}</span>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 13px;">{{ a.t }}</div>
                <div class="muted" style="font-size: 11px;">{{ a.who }} · {{ a.time }}</div>
              </div>
              <div class="mono" style="font-weight: 700; font-size: 12px;">{{ a.amt }}</div>
              <button class="btn primary sm" routerLink="/dps"><app-bi k="review"></app-bi></button>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Estate roster -->
    <div class="card bold">
      <div class="card-head">
        <div class="ttl">Estates roster</div>
        <div class="muted" style="margin-left: auto; font-size: 11px;">Updated 09:42 IST · 25 May 2026</div>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>Estate</th><th class="num">Hect.</th><th class="num">Blocks</th><th class="num">Tappers</th>
            <th>Manager</th><th>Today's Latex</th><th class="num">DRC</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (e of rosterEstates; track e.id) {
            <tr>
              <td><b>{{ e.name }}</b><div class="ml muted" style="font-size: 11px;">{{ e.ml }}</div></td>
              <td class="num">{{ (e.hectares).toLocaleString() }}</td>
              <td class="num">{{ e.blocks }}</td>
              <td class="num">{{ e.tappers }}</td>
              <td>{{ e.mgr }}</td>
              <td>
                <div class="mono"><b>{{ (e.latex).toLocaleString() }}</b> kg</div>
                <div class="bar" style="width: 120px; margin-top: 3px;"><i [style.width.%]="(e.latex/12000)*100"></i></div>
              </td>
              <td class="num">{{ e.drc }}%</td>
              <td><span class="badge" [ngClass]="e.statusCol">{{ e.statusTxt }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class DashAComponent {
  dataService = inject(DataService);

  cycleRows = [
    {d:'D1', l:'Kallarkutty B7+', v:1880, p:78},
    {d:'D2', l:'Vilakkupara B8+', v:2240, p:84},
    {d:'D3', l:'Aryankavu A+',    v:2480, p:91},
    {d:'D4', l:'Tenmala T1+',     v:2820, p:96},
  ];

  approvals = [
    {t:'DPS verification · 9 entries',  who:'V. Raj (Supervisor)',     time:'10 min ago', tag:'DPS', amt:'9 ent.'},
    {t:'Mazdoor estimate · Block KLP-B19', who:'Reena Vijayan',          time:'1 h ago',    tag:'EST', amt:'₹42,800'},
    {t:'Stock issue · Ammonia 200L drum',  who:'CC-Main',                 time:'2 h ago',    tag:'INV', amt:'2 drums'},
    {t:'Payroll cycle close',              who:'System · auto-trigger',   time:'tomorrow',   tag:'PAY', amt:'₹68.4L'},
  ];

  get rosterEstates() {
    const ltx = [9420, 7150, 8240, 6420, 5860];
    const dr = [33.8, 33.2, 34.1, 33.9, 32.7];
    const sts = [['leaf','On target'],['amber','Below base'],['leaf','On target'],['leaf','Above base'],['oxide','Critical']];
    return this.dataService.estates.map((e, i) => ({
      ...e,
      latex: ltx[i],
      drc: dr[i],
      statusCol: sts[i][0],
      statusTxt: sts[i][1]
    }));
  }

  onAction(msg: string) {
    alert(msg);
  }
}
