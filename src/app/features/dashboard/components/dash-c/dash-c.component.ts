import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparklineComponent } from '../../../../shared/components/charts/sparkline.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-dash-c',
  standalone: true,
  imports: [CommonModule, SparklineComponent, IconComponent],
  template: `
    <div class="grid g-6 mb-16">
      @for (k of kpis; track k.l) {
        <div class="kpi">
          <div class="label">{{ k.l }}</div>
          <div class="value">{{ k.v }}<span class="unit">{{ k.u }}</span></div>
          <div class="delta" 
               [class.up]="k.col==='leaf'" 
               [class.down]="k.col==='oxide'" 
               [style.color]="'var(--' + k.col + ')'">
            {{ k.d }}
          </div>
        </div>
      }
    </div>

    <div class="grid g-2 mb-16">
      <div class="card bold">
        <div class="card-head"><div class="ttl">Estate-wise performance · MTD</div></div>
        <table class="tbl">
          <thead>
            <tr>
              <th>Estate</th><th class="num">Plan kg</th><th class="num">Actual</th><th class="num">Δ%</th><th>Trend</th><th class="num">Wage/kg</th>
            </tr>
          </thead>
          <tbody>
            @for (e of rosterEstates; track e.id) {
              <tr>
                <td><b>{{ e.name.split(' ')[0] }}</b><div class="muted" style="font-size: 11px;">{{ e.mgr }}</div></td>
                <td class="num">{{ (e.plan).toLocaleString() }}</td>
                <td class="num"><b>{{ (e.actual).toLocaleString() }}</b></td>
                <td class="num">
                  <span [style.color]="e.diff >= 0 ? 'var(--leaf)' : 'var(--oxide)'" style="font-weight: 700;">
                    {{ e.diff >= 0 ? '+' : '' }}{{ e.diff }}%
                  </span>
                </td>
                <td>
                  <app-sparkline 
                    [data]="e.trend" [w]="90" [h]="28" 
                    [stroke]="e.diff >= 0 ? 'var(--leaf)' : 'var(--oxide)'" 
                    [fill]="e.diff >= 0 ? 'var(--leaf-soft)' : 'var(--oxide-soft)'">
                  </app-sparkline>
                </td>
                <td class="num">₹{{ e.wpk }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">Strategic alerts</div></div>
        <div class="card-body col" style="gap: 10px;">
          <div style="padding: 12px; border: 1.5px solid var(--oxide); border-radius: 6px; background: var(--oxide-soft);">
            <div class="row gap-8" style="font-weight: 700;"><app-icon name="Alert" [size]="14"></app-icon>Kallar Estate · 3-month decline</div>
            <div class="muted" style="font-size: 12px; margin-top: 4px;">NPP down 5.8% YoY. Worker attrition 12%. Audit recommended by GM office.</div>
          </div>
          <div style="padding: 12px; border: 1.5px solid var(--amber); border-radius: 6px; background: var(--amber-soft);">
            <div class="row gap-8" style="font-weight: 700;"><app-icon name="Boxes" [size]="14"></app-icon>Ammonia stock critical · 3 estates</div>
            <div class="muted" style="font-size: 12px; margin-top: 4px;">Below safety threshold. Tender SFCK/CHM/2026-27 awaiting MD signoff.</div>
          </div>
          <div style="padding: 12px; border: 1.5px solid var(--leaf); border-radius: 6px; background: var(--leaf-soft);">
            <div class="row gap-8" style="font-weight: 700;"><app-icon name="Activity" [size]="14"></app-icon>Athirappilly Estate beating plan</div>
            <div class="muted" style="font-size: 12px; margin-top: 4px;">+4.2% above NPP. Tapping cycle D3 averaging 38.6 kg/hectare/day.</div>
          </div>
          <div style="padding: 12px; border: var(--bd-soft); border-radius: 6px;">
            <div class="row gap-8" style="font-weight: 700;"><app-icon name="Wallet" [size]="14"></app-icon>Payroll · ready for closure</div>
            <div class="muted" style="font-size: 12px; margin-top: 4px;">1,623 payslips queued. DA hike of ₹186 (mid-cycle) auto-applied.</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashCComponent {
  dataService = inject(DataService);

  kpis = [
    {l:'MTD Latex', v:'214.6', u:'tonnes', d:'+ 8.4% vs target', col:'leaf'},
    {l:'Wage Liability', v:'₹68.4', u:'lakh', d:'cycle 21 Apr–20 May', col:'amber'},
    {l:'DRC Avg', v:'33.8', u:'%', d:'industry 32.4%', col:'leaf'},
    {l:'Active Tappers', v:'1,623', u:'/ 1,679', d:'96.7% utilisation', col:'leaf'},
    {l:'Inventory Days', v:'18.4', u:'days', d:'ammonia critical', col:'oxide'},
    {l:'NPP Variance', v:'+2.1', u:'%', d:'above plan', col:'leaf'},
  ];

  get rosterEstates() {
    const plans = [220000, 180000, 200000, 170000, 150000];
    const actuals = [228600, 172400, 206800, 178100, 143200];
    const wpks = [38.2, 41.6, 36.9, 39.1, 44.2];
    const trends = [
      [210,215,218,220,225,228],
      [182,180,178,176,174,172],
      [198,201,204,205,206,207],
      [170,172,175,176,177,178],
      [152,150,148,146,144,143]
    ];

    return this.dataService.estates.map((e, i) => {
      const plan = plans[i];
      const actual = actuals[i];
      const diff = parseFloat(((actual - plan) / plan * 100).toFixed(1));
      return {
        ...e,
        plan,
        actual,
        diff,
        wpk: wpks[i],
        trend: trends[i]
      };
    });
  }
}
