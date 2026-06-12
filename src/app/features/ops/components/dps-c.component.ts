import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { BarChartComponent } from '../../../shared/components/charts/bar-chart.component';

@Component({
  selector: 'app-dps-c',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BarChartComponent],
  template: `
    <div class="row mb-16 gap-16">
      <div class="field"><label>Date</label><input class="input mono" [value]="'25-05-2026'" readonly style="width: 130px;"/></div>
      <div class="field">
        <label>Tapper</label>
        <select class="select" style="min-width: 240px;" [(ngModel)]="tapper">
          <option>EMP-1042 · Rajan Pillai</option>
          <option>EMP-1158 · Lekha Devi</option>
          <option>EMP-1209 · Sasi Kumar</option>
          <option>EMP-1402 · Mini Joseph</option>
        </select>
      </div>
    </div>

    <div class="grid mb-16" style="grid-template-columns: 1fr 1fr;">
      <div class="card bold">
        <div class="card-head">
          <div class="avatar" style="background: var(--accent); width: 36px; height: 36px; font-size: 14px;">RP</div>
          <div>
            <div style="font-weight: 700; font-size: 16px;">Rajan Pillai</div>
            <div class="muted" style="font-size: 12px;">EMP-1042 · Permanent · joined Jun 2011</div>
          </div>
          <span class="badge solid" style="margin-left: auto;">D1</span>
        </div>
        <div class="card-body">
          <div class="grid g-2" style="gap: 14px;">
            <div class="field"><label>Trees tapped</label><input class="input mono" [value]="'380'" style="font-size: 18px;"/></div>
            <div class="field"><label>Cups recovered</label><input class="input mono" [value]="'364'" style="font-size: 18px;"/></div>
            <div class="field"><label>Latex weight (kg)</label><input class="input mono" [value]="'32.4'" style="font-size: 18px;"/></div>
            <div class="field"><label>Scrap rubber (kg)</label><input class="input mono" [value]="'3.1'" style="font-size: 18px;"/></div>
            <div class="field"><label>DRC %  (lab/field test)</label><input class="input mono" [value]="'33.8'" style="font-size: 18px;"/></div>
            <div class="field"><label>Head-load distance (m)</label><input class="input mono" [value]="'1,402'" style="font-size: 18px;"/></div>
          </div>
          <div class="mt-16 field"><label>Field remarks</label><textarea class="textarea" rows="2" placeholder="Optional…"></textarea></div>
        </div>
        <div class="card-foot">
          <span class="muted">Latex sample collected for DRC verification at CC-Main</span>
          <button class="btn primary" style="margin-left: auto;" (click)="onAction('Saved entry for ' + tapper + '. Loading next tapper…')"><app-icon name="Check" [size]="13"></app-icon>Save & next tapper</button>
        </div>
      </div>

      <div class="col">
        <div class="card bold">
          <div class="card-head"><div class="ttl">Auto-calculated</div></div>
          <div class="card-body grid g-2" style="gap: 14px;">
            <div><div class="muted up" style="font-size: 10px;">Dry yield</div><div class="mono" style="font-size: 28px; font-weight: 700;">10.95<span style="font-size: 14px; color: var(--ink-3);"> kg</span></div></div>
            <div><div class="muted up" style="font-size: 10px;">Δ base yield</div><div class="mono hl-leaf" style="font-size: 28px; font-weight: 700;">+ 4.3%</div></div>
            <div><div class="muted up" style="font-size: 10px;">DRC incentive</div><div class="mono" style="font-size: 22px; font-weight: 700;">₹ 84.20</div></div>
            <div><div class="muted up" style="font-size: 10px;">Head-load charge</div><div class="mono" style="font-size: 22px; font-weight: 700;">₹ 117.80</div></div>
            <div><div class="muted up" style="font-size: 10px;">Today's earnings</div><div class="mono" style="font-size: 28px; font-weight: 700; color: var(--accent);">₹ 914</div></div>
            <div><div class="muted up" style="font-size: 10px;">MTD dry rubber</div><div class="mono" style="font-size: 22px; font-weight: 700;">284.7 kg</div></div>
          </div>
        </div>
        <div class="card bold">
          <div class="card-head"><div class="ttl">Last 14 days · Rajan Pillai</div></div>
          <div class="card-body">
            <app-bar-chart [data]="chartData" [w]="500" [h]="170"></app-bar-chart>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DpsCComponent {
  tapper = 'EMP-1042 · Rajan Pillai';

  chartData = [
    {d:'12',latex:10.1,scrap:0.9,base:10.5},
    {d:'13',latex:11.2,scrap:1.0,base:10.5},
    {d:'14',latex:10.8,scrap:1.1,base:10.5},
    {d:'15',latex:9.4,scrap:0.8,base:10.5},
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

  onAction(msg: string) {
    alert(msg);
  }
}
