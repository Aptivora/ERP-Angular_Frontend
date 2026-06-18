import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, BiComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Collection Centre"
        ml="ശേഖരണ കേന്ദ്രം"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="cc_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <div class="row gap-8 responsive-actions">
            <button class="btn ghost sm" (click)="printPage()"><app-icon name="Print" [size]="13"></app-icon><app-bi k="print_intake"></app-bi></button>
            <button class="btn primary sm" (click)="onAction('+ New intake: Scan tapper ID or select block to begin weighing.')"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="new_intake"></app-bi></button>
          </div>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        @for (k of kpis; track k.l) {
          <div class="kpi">
            <div class="label"><app-bi [k]="k.l"></app-bi></div>
            <div class="value">{{ k.v }}<span class="unit"><app-bi [k]="k.u"></app-bi></span></div>
            <div class="delta"><app-bi [k]="k.d"></app-bi></div>
          </div>
        }
      </div>

      <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
        <div class="card bold">
          <div class="card-head">
            <div class="ttl"><app-bi k="intake_log"></app-bi></div>
            <div class="row gap-8" style="margin-left: auto;">
              <button class="chip" [class.active]="activeFilter() === 'All'" (click)="setFilter('All')" style="cursor: pointer; border: none; background: var(--bg-2);"><app-bi k="all"></app-bi></button>
              <button class="chip" [class.active]="activeFilter() === 'Auto'" (click)="setFilter('Auto')" style="cursor: pointer; border: none; background: var(--bg-2);"><app-bi k="auto"></app-bi></button>
              <button class="chip" [class.active]="activeFilter() === 'Manual'" (click)="setFilter('Manual')" style="cursor: pointer; border: none; background: var(--bg-2);"><app-bi k="manual"></app-bi></button>
              <button class="chip" [class.active]="activeFilter() === 'Disputed'" (click)="setFilter('Disputed')" style="cursor: pointer; border: none; background: var(--bg-2);"><app-bi k="disputed"></app-bi></button>
            </div>
          </div>
          <div class="table-responsive" style="overflow-x: auto; width: 100%;">
            <table class="tbl">
              <thead>
                <tr>
                  <th><app-bi k="time"></app-bi></th><th><app-bi k="batch"></app-bi></th><th><app-bi k="from_block"></app-bi></th><th><app-bi k="tapper"></app-bi></th>
                  <th class="num"><app-bi k="gross_kg"></app-bi></th><th class="num"><app-bi k="net_kg"></app-bi></th>
                  <th class="num"><app-bi k="drc_pct"></app-bi></th><th class="num"><app-bi k="dry"></app-bi></th>
                  <th><app-bi k="status"></app-bi></th>
                </tr>
              </thead>
              <tbody>
                @for (r of filteredIntakes(); track r.b) {
                  <tr>
                    <td class="mono">{{ r.t }}</td>
                    <td class="mono"><b>{{ r.b }}</b></td>
                    <td>{{ r.blk }}</td>
                    <td>{{ r.n }}</td>
                    <td class="num">{{ r.g }}</td>
                    <td class="num"><b>{{ r.net }}</b></td>
                    <td class="num"><span [style.color]="r.drc < 32 ? 'var(--oxide)' : (r.drc >= 34 ? 'var(--leaf)' : 'inherit')">{{ r.drc }}</span></td>
                    <td class="num mono"><b>{{ r.dry }}</b></td>
                    <td><span class="badge" [ngClass]="r.st">{{ r.sl }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="col">
          <div class="card bold">
            <div class="card-head"><div class="ttl"><app-bi k="drc_test"></app-bi></div></div>
            <div class="card-body col" style="gap: 14px;">
              <div class="row gap-16" style="align-items: flex-end;">
                <div class="field grow"><label><app-bi k="sample_id"></app-bi></label><input class="input mono" [value]="'DRC-2026-0512-08'"/></div>
                <div class="field">
                  <label><app-bi k="method"></app-bi></label>
                  <select class="select" [(ngModel)]="collMethod">
                    <option>Field hydrometer</option>
                    <option>Oven dry (lab)</option>
                  </select>
                </div>
              </div>
              <div class="grid g-3" style="gap: 8px;">
                <div><div class="muted up" style="font-size: 10px;"><app-bi k="latex_wt"></app-bi></div><div class="mono" style="font-size: 20px; font-weight: 700;">26.8 kg</div></div>
                <div><div class="muted up" style="font-size: 10px;"><app-bi k="sample"></app-bi></div><div class="mono" style="font-size: 20px; font-weight: 700;">100 ml</div></div>
                <div><div class="muted up" style="font-size: 10px;"><app-bi k="coagulum_dry"></app-bi></div><div class="mono" style="font-size: 20px; font-weight: 700;">31.4 g</div></div>
              </div>
              <div style="padding: 12px; background: var(--oxide-soft); border-radius: 6px; font-size: 12px;">
                <b class="hl-oxide">DRC 31.4% — below normal range (33–35%)</b><br/>
                <span class="muted"><app-bi k="recommend_fresh"></app-bi></span>
              </div>
              <button class="btn primary" (click)="onAction('DRC result recorded (31.4% via ' + collMethod + '). Flagged for retest.')"><app-bi k="record_flag"></app-bi></button>
            </div>
          </div>

          <div class="card bold">
            <div class="card-head"><div class="ttl"><app-bi k="block_contrib"></app-bi></div></div>
            <div class="card-body col" style="gap: 8px; font-size: 12px;">
              @for (r of blocks; track r.b) {
                <div>
                  <div class="row between"><span>{{ r.b }}</span><b class="mono">{{ r.v }} kg</b></div>
                  <div class="bar"><i [style.width.%]="r.p"></i></div>
                </div>
              }
            </div>
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
export class CollectionComponent {
  collMethod = 'Field hydrometer';
  toastMessage = signal<string | null>(null);
  activeFilter = signal<'All' | 'Auto' | 'Manual' | 'Disputed'>('All');

  kpis = [
    {l:'today_intake', v:'2,584', u:'kg_wet', d:'batches_desc'},
    {l:'avg_drc',      v:'33.8',  u:'pct',     d:'samples_flagged'},
    {l:'dry_equiv',v:'873.4',u:'kg',    d:'lot_sfck'},
    {l:'scrap_rubber', v:'212',   u:'kg',    d:'awaiting_grading'},
  ];

  intakes = [
    {t:'06:42', b:'B-001', blk:'KLP-B07', n:'Rajan Pillai', g:33.8, net:32.4, drc:33.8, dry:10.95, st:'leaf', sl:'OK', type: 'Auto'},
    {t:'06:48', b:'B-002', blk:'KLP-B07', n:'Lekha Devi',   g:35.5, net:34.1, drc:34.2, dry:11.66, st:'leaf', sl:'OK', type: 'Auto'},
    {t:'07:02', b:'B-003', blk:'KLP-B08', n:'Sasi Kumar',   g:31.1, net:29.6, drc:32.9, dry: 9.74, st:'leaf', sl:'OK', type: 'Auto'},
    {t:'07:14', b:'B-004', blk:'KLP-B08', n:'Saritha Anand',g:28.4, net:26.8, drc:31.4, dry: 8.42, st:'amber', sl:'Low DRC · resample', type: 'Disputed'},
    {t:'07:31', b:'B-005', blk:'KLP-B12', n:'Mini Joseph',  g:38.2, net:36.8, drc:33.5, dry:12.33, st:'leaf', sl:'OK', type: 'Auto'},
    {t:'07:46', b:'B-006', blk:'KLP-B27', n:'Anil Kumar',   g:36.5, net:35.2, drc:34.0, dry:11.97, st:'clay', sl:'Hold · DPS pending', type: 'Manual'},
    {t:'08:02', b:'B-007', blk:'KLP-B27', n:'Geetha Mohan', g:40.1, net:38.6, drc:34.6, dry:13.36, st:'leaf', sl:'OK', type: 'Auto'},
    {t:'08:18', b:'B-008', blk:'KLP-B12', n:'Suresh Babu',  g:0,    net:0,    drc:0,    dry:0,     st:'oxide',sl:'Tapper absent', type: 'Manual'},
  ];

  filteredIntakes = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') return this.intakes;
    return this.intakes.filter(r => r.type === filter);
  });

  blocks = [
    {b:'KLP-B07 Kallarkutty', v:412, p:48},
    {b:'KLP-B08 Kallarkutty', v:286, p:33},
    {b:'KLP-B12 Aryankavu',   v:362, p:42},
    {b:'KLP-B27 Tenmala',     v:484, p:56},
  ];

  setFilter(filter: 'All' | 'Auto' | 'Manual' | 'Disputed') {
    this.activeFilter.set(filter);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }

  printPage() {
    window.print();
  }
}
