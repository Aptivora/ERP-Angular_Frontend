import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BarChartComponent } from '../../../shared/components/charts/bar-chart.component';
import { DataService } from '../../../core/services/data.service';
import { BiComponent } from '../../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dps-a',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BiComponent],
  template: `
    <div class="row mb-16 gap-16 dps-form-row" style="flex-wrap: wrap;">
      <div class="field"><label><app-bi k="date"></app-bi></label><input class="input mono" [value]="'25-05-2026'" readonly style="width: 130px;"/></div>
      <div class="field">
        <label><app-bi k="block"></app-bi></label>
        <select class="select" style="min-width: 200px;" [(ngModel)]="block">
          <option>KLP-B07 · Kallarkutty B7</option>
          <option>KLP-B08 · Kallarkutty B8</option>
          <option>KLP-B12 · Aryankavu A</option>
        </select>
      </div>
      <div class="field">
        <label><app-bi k="cycle"></app-bi></label>
        <select class="select" [(ngModel)]="cycle">
          <option>D1 · Today</option>
          <option>D2</option>
          <option>D3</option>
          <option>D4</option>
        </select>
      </div>
      <div class="field">
        <label><app-bi k="supervisor"></app-bi></label>
        <div class="row gap-8" style="padding: 8px 10px; border: var(--bd-soft); border-radius: 4px;">
          <div class="avatar" style="width: 20px; height: 20px; font-size: 9px;">RV</div>
          <span style="font-size: 12px; font-weight: 600;">Reena Vijayan</span>
        </div>
      </div>
      <div style="margin-left: auto;" class="row gap-8 mt-16">
        <button class="btn ghost sm" (click)="onAction('Bulk import dialog: Upload CSV/Excel with tapper-wise production data.')"><app-icon name="Upload" [size]="13"></app-icon><app-bi k="bulk_import"></app-bi></button>
        <button class="btn ghost sm" (click)="printPage()"><app-icon name="Print" [size]="13"></app-icon><app-bi k="print_sheet"></app-bi></button>
        <button class="btn primary sm" (click)="onAction('DPS verified & submitted for ' + block + ' (' + cycle + ').')"><app-icon name="Check" [size]="13"></app-icon><app-bi k="verify_submit"></app-bi></button>
      </div>
    </div>

    <div class="card bold">
      <div class="card-head">
        <div class="ttl">DPS · Block KLP-B07 · D1 <app-bi k="cycle"></app-bi> · 25-May-2026</div>
        <div class="row gap-16" style="margin-left: auto; font-size: 12px;">
          <span><app-bi k="trees_in_block"></app-bi>: <b class="mono">14,250</b></span>
          <span><app-bi k="expected_yield"></app-bi>: <b class="mono">35.2 kg/<app-bi k="tapper"></app-bi></b></span>
          <span><app-bi k="base_drc"></app-bi>: <b class="mono">33.0%</b></span>
        </div>
      </div>
      <table class="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th><app-bi k="tapper"></app-bi></th>
            <th class="num"><app-bi k="trees_tapped"></app-bi></th>
            <th class="num"><app-bi k="cups_recovered"></app-bi></th>
            <th class="num"><app-bi k="latex_l"></app-bi></th>
            <th class="num"><app-bi k="wt_kg"></app-bi></th>
            <th class="num"><app-bi k="scrap_kg"></app-bi></th>
            <th class="num"><app-bi k="drc_pct"></app-bi></th>
            <th class="num"><app-bi k="dry_kg"></app-bi></th>
            <th class="num"><app-bi k="base"></app-bi></th>
            <th><app-bi k="status"></app-bi></th>
          </tr>
        </thead>
        <tbody>
          @for (r of dpsRows; track r.emp; let i = $index) {
            <tr>
              <td class="mono muted">{{ (i + 1).toString().padStart(2, '0') }}</td>
              <td><b>{{ r.name }}</b><div class="muted" style="font-size: 11px;">{{ r.emp }}</div></td>
              <td class="num"><input class="input mono" [value]="r.trees" style="text-align: right; padding: 4px 6px; width: 70px;"/></td>
              <td class="num"><input class="input mono" [value]="r.cups" style="text-align: right; padding: 4px 6px; width: 70px;"/></td>
              <td class="num mono">{{ (r.latex * 1.08).toFixed(1) }}</td>
              <td class="num"><input class="input mono" [value]="r.latex" style="text-align: right; padding: 4px 6px; width: 70px;"/></td>
              <td class="num"><input class="input mono" [value]="r.scrap" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
              <td class="num"><input class="input mono" [value]="r.drc" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
              <td class="num mono"><b>{{ getDry(r) }}</b></td>
              <td class="num mono" [style.color]="getDelta(r) >= 0 ? 'var(--leaf)' : 'var(--oxide)'" style="font-weight: 700;">
                {{ getDelta(r) >= 0 ? '+' : '' }}{{ getDelta(r) }}%
              </td>
              <td>
                @if (r.status === 'verified') {
                  <span class="badge leaf"><app-icon name="Check" [size]="10"></app-icon> <app-bi k="verified"></app-bi></span>
                } @else {
                  <span class="badge amber"><app-bi k="pending"></app-bi></span>
                }
              </td>
            </tr>
          }
          <tr style="background: var(--bg-2); font-weight: 700;">
            <td colspan="2"><app-bi k="totals"></app-bi></td>
            <td class="num">2,692</td>
            <td class="num">2,582</td>
            <td class="num">252.8</td>
            <td class="num">233.5</td>
            <td class="num">20.0</td>
            <td class="num mono">33.5</td>
            <td class="num mono">78.22</td>
            <td class="num mono hl-leaf">+ 6.4%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div class="card-foot">
        <span>Auto-calc: <b>Dry kg = Wet × DRC%</b> · Incentive applies above base yield (10.5 kg/tapper)</span>
        <div style="margin-left: auto;" class="row gap-8">
          <button class="btn ghost sm" (click)="onAction('DPS draft saved.')">Save draft</button>
          <button class="btn primary sm" (click)="onAction('DPS forwarded to Estate Manager (P. Suresh Kumar).')">Forward to Estate Manager</button>
        </div>
      </div>
    </div>
  `
})
export class DpsAComponent {
  block = 'KLP-B07 · Kallarkutty B7';
  cycle = 'D1 · Today';
  dataService = inject(DataService);
  dpsRows: any[] = this.dataService.dpsRows;

  getDry(r: any) {
    return (r.latex * r.drc / 100).toFixed(2);
  }

  getDelta(r: any) {
    const dry = parseFloat(this.getDry(r));
    return parseFloat((((dry - 10.5) / 10.5) * 100).toFixed(1));
  }

  onAction(msg: string) {
    alert(msg);
  }

  printPage() {
    window.print();
  }
}
