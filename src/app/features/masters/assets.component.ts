import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';
import { DonutComponent } from '../../shared/components/charts/donut.component';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent, DonutComponent, BiComponent],
  template: `
    <div class="page" id="assets-export-content">
      <app-page-head
        title="Estate & Block Master"
        ml="എസ്റ്റേറ്റ് & ബ്ലോക്ക് മാസ്റ്റർ"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="assets_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="downloadPdf('assets_report')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="export_pdf"></app-bi></button>
          <button class="btn primary sm" (click)="onAction('+ New Block: Enter block ID, name, division, hectares, tree count, variety, planted year.')"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="new_block"></app-bi></button>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        <div class="kpi"><div class="label"><app-bi k="estates_kpi"></app-bi></div><div class="value">5</div><div class="delta">4,960 <app-bi k="hectares_total"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="blocks_kpi"></app-bi></div><div class="value">144</div><div class="delta">108 <app-bi k="mature_stats"></app-bi> 26 <app-bi k="immature_stats"></app-bi> 10 <app-bi k="cut_stats"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="tree_census"></app-bi></div><div class="value">2.14<span class="unit">M trees</span></div><div class="delta"><app-bi k="last_verified"></app-bi></div></div>
        <div class="kpi"><div class="label"><app-bi k="replant_queue"></app-bi></div><div class="value">42<span class="unit">hectares</span></div><div class="delta"><app-bi k="fy_plan"></app-bi></div></div>
      </div>

      <div class="tabs mb-16">
        @for (t of tabs; track t.id) {
          <div class="tab" [class.active]="tab === t.id" (click)="tab = t.id"><app-bi [k]="t.l"></app-bi></div>
        }
      </div>

      @if (tab === 'blocks') {
        <div class="card bold">
          <div class="card-head">
            <div class="ttl"><app-bi k="blocks_kpi"></app-bi> · Kulathupuzha Estate</div>
            <div class="row gap-8" style="margin-left: auto;">
              <span class="chip"><span class="dot leaf"></span><app-bi k="mature"></app-bi></span>
              <span class="chip"><span class="dot amber"></span><app-bi k="immature"></app-bi></span>
              <span class="chip"><span class="dot oxide"></span><app-bi k="cut"></app-bi></span>
              <span class="chip"><span class="dot mute"></span><app-bi k="slaughter"></app-bi></span>
            </div>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th><app-bi k="block_id"></app-bi></th><th><app-bi k="block_name"></app-bi></th><th><app-bi k="division"></app-bi></th>
                <th class="num"><app-bi k="hectares"></app-bi></th><th class="num"><app-bi k="trees"></app-bi></th>
                <th><app-bi k="variety"></app-bi></th><th><app-bi k="planted"></app-bi></th><th><app-bi k="maturity"></app-bi></th><th><app-bi k="cycle"></app-bi></th>
                <th class="num"><app-bi k="tappers"></app-bi></th><th class="num"><app-bi k="yield_ha"></app-bi></th>
              </tr>
            </thead>
            <tbody>
              @for (b of blocksList; track b.id) {
                <tr>
                  <td class="mono"><b>{{ b.id }}</b></td>
                  <td><b>{{ b.n }}</b></td>
                  <td>{{ b.div }}</td>
                  <td class="num">{{ b.h }}</td>
                  <td class="num">{{ b.t.toLocaleString() }}</td>
                  <td class="mono" style="font-size: 12px;">{{ b.v }}</td>
                  <td class="mono">{{ b.pl }}</td>
                  <td>
                    <span class="badge" [ngClass]="b.m === 'Mature' ? 'leaf' : (b.m === 'Immature' ? 'amber' : (b.m === 'CUT' ? 'oxide' : ''))">
                      {{ b.m }}
                    </span>
                  </td>
                  <td>
                    @if (b.c === '—') {
                      <span class="muted">—</span>
                    } @else {
                      <span class="cycle" [ngClass]="b.c.toLowerCase()">{{ b.c }}</span>
                    }
                  </td>
                  <td class="num">{{ b.tp }}</td>
                  <td class="num">
                    @if (b.yld === '—') {
                      <span class="muted">—</span>
                    } @else {
                      {{ b.yld }} kg
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (tab === 'estates') {
        <div class="card bold">
          <table class="tbl">
            <thead>
              <tr><th>ID</th><th><app-bi k="estate"></app-bi></th><th><app-bi k="manager"></app-bi></th><th class="num"><app-bi k="hectares"></app-bi></th><th class="num"><app-bi k="divisions"></app-bi></th><th class="num"><app-bi k="blocks_kpi"></app-bi></th><th class="num"><app-bi k="tappers"></app-bi></th><th><app-bi k="address"></app-bi></th></tr>
            </thead>
            <tbody>
              @for (e of dataService.estates; track e.id) {
                <tr>
                  <td class="mono"><b>{{ e.id }}</b></td>
                  <td><b>{{ e.name }}</b><div class="ml muted" style="font-size: 11px;">{{ e.ml }}</div></td>
                  <td>{{ e.mgr }}</td>
                  <td class="num">{{ e.hectares.toLocaleString() }}</td>
                  <td class="num">5</td>
                  <td class="num">{{ e.blocks }}</td>
                  <td class="num">{{ e.tappers }}</td>
                  <td class="muted">{{ e.id }} P.O., Kollam Dt., Kerala</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (tab === 'divisions') {
        <div class="card bold">
          <div class="card-body muted">Division-level master · 25 divisions across 5 estates. Block grouping for supervisor assignment & wage calculation.</div>
        </div>
      }

      @if (tab === 'trees') {
        <div class="grid g-2 mb-16">
          <div class="card bold">
            <div class="card-head"><div class="ttl">Tree census · variety mix</div></div>
            <div class="card-body row" style="gap: 16px;">
              <app-donut [segments]="[
                { v: 1620000, color: 'var(--leaf)' },
                { v: 380000, color: 'var(--accent)' },
                { v: 140000, color: 'var(--amber)' }
              ]" [size]="150"></app-donut>
              <div class="col" style="flex: 1; gap: 8px; font-size: 12px;">
                <div class="row between"><span class="row gap-8"><span class="dot leaf"></span>RRII-105 (clone)</span><b class="mono">1.62 M</b></div>
                <div class="row between"><span class="row gap-8"><span class="dot clay"></span>RRII-414 (clone)</span><b class="mono">380 K</b></div>
                <div class="row between"><span class="row gap-8"><span class="dot amber"></span>PB-260 (immature)</span><b class="mono">140 K</b></div>
              </div>
            </div>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Tree maturity distribution</div></div>
            <div class="card-body col" style="gap: 10px; font-size: 12px;">
              @for (r of maturityDist; track r.l) {
                <div>
                  <div class="row between"><span>{{ r.l }}</span><b class="mono">{{ r.v }}</b></div>
                  <div class="bar" [ngClass]="{ 'leaf': r.c === 'leaf' }" style="background: var(--bg-3);">
                    <i [style.width.%]="r.p" [style.background]="r.c === 'mute' ? 'var(--ink-mute)' : 'var(--' + r.c + ')'"></i>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AssetsComponent {
  tab = 'blocks';
  dataService = inject(DataService);
  private pdfService = inject(PdfExportService);

  tabs = [
    { id: 'estates', l: 'estates_kpi' },
    { id: 'divisions', l: 'divisions' },
    { id: 'blocks', l: 'blocks_kpi' },
    { id: 'trees', l: 'tree_census' }
  ];

  blocksList = [
    { id: 'KLP-B07', n: 'Kallarkutty B7', div: 'North', h: 32.5, t: 14250, v: 'RRII-105', pl: 2007, m: 'Mature', c: 'D1', tp: 12, yld: 1842 },
    { id: 'KLP-B08', n: 'Kallarkutty B8', div: 'North', h: 28.2, t: 12640, v: 'RRII-105', pl: 2008, m: 'Mature', c: 'D2', tp: 10, yld: 1786 },
    { id: 'KLP-B12', n: 'Aryankavu A', div: 'South', h: 41.8, t: 18100, v: 'RRII-414', pl: 2005, m: 'Mature', c: 'D3', tp: 15, yld: 1924 },
    { id: 'KLP-B14', n: 'Aryankavu B', div: 'South', h: 36.4, t: 15780, v: 'RRII-414', pl: 2006, m: 'Mature', c: 'D3', tp: 13, yld: 1812 },
    { id: 'KLP-B19', n: 'Vilakkupara V2', div: 'East', h: 22.4, t: 9820, v: 'PB-260', pl: 2019, m: 'Immature', c: '—', tp: 0, yld: '—' },
    { id: 'KLP-B23', n: 'Edamon E3', div: 'West', h: 18.6, t: 7340, v: 'RRII-105', pl: 1989, m: 'CUT', c: '—', tp: 0, yld: '—' },
    { id: 'KLP-B27', n: 'Tenmala T1', div: 'Central', h: 35.0, t: 15400, v: 'RRII-105', pl: 2009, m: 'Mature', c: 'D4', tp: 13, yld: 1864 },
    { id: 'KLP-B28', n: 'Tenmala T2', div: 'Central', h: 31.2, t: 13680, v: 'RRII-105', pl: 2010, m: 'Mature', c: 'D4', tp: 11, yld: 1798 },
    { id: 'KLP-B31', n: 'Tenmala T2-S', div: 'Central', h: 12.8, t: 5210, v: 'RRII-105', pl: 1982, m: 'Slaughter', c: '—', tp: 0, yld: '—' },
    { id: 'KLP-B33', n: 'Vilakkupara V3', div: 'East', h: 24.8, t: 10840, v: 'RRII-105', pl: 2008, m: 'Mature', c: 'D1', tp: 9, yld: 1742 },
  ];

  maturityDist = [
    { l: 'Mature (tapping)', v: '1.72 M trees · 80.4%', p: 80, c: 'leaf' },
    { l: 'Immature (2–7 yr)', v: '248 K · 11.6%', p: 12, c: 'amber' },
    { l: 'CUT (declared)', v: '118 K · 5.5%', p: 6, c: 'oxide' },
    { l: 'Slaughter (ready for replant)', v: '54 K · 2.5%', p: 3, c: 'mute' },
  ];

  onAction(msg: string) {
    alert(msg);
  }

  downloadPdf(name: string) {
    this.pdfService.exportElementToPdf('assets-export-content', name + '.pdf');
  }
}
