import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparklineComponent } from '../../../../shared/components/charts/sparkline.component';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-kpi-row',
  standalone: true,
  imports: [CommonModule, SparklineComponent],
  template: `
    <div class="grid g-4 mb-16">
      <div class="kpi" [class.accent]="accent">
        <div class="label">Today · Latex (Dry)</div>
        <div class="value">9,420<span class="unit">kg</span></div>
        <div class="delta up">▲ 14.9% vs base 8,200</div>
        <div class="spark">
          <app-sparkline 
            [data]="trendData" 
            [stroke]="accent ? '#fff' : 'var(--leaf)'" 
            [fill]="accent ? 'rgba(255,255,255,0.15)' : 'var(--leaf-soft)'">
          </app-sparkline>
        </div>
      </div>
      
      <div class="kpi">
        <div class="label">Tappers Present</div>
        <div class="value">404<span class="unit">/ 412</span></div>
        <div class="delta up">▲ 98.1% attendance</div>
        <div class="spark">
          <app-sparkline 
            [data]="[395,402,398,406,401,398,404]" 
            stroke="var(--accent)" 
            fill="var(--accent-soft)">
          </app-sparkline>
        </div>
      </div>
      
      <div class="kpi">
        <div class="label">Avg DRC</div>
        <div class="value">33.8<span class="unit">%</span></div>
        <div class="delta up">▲ 0.6 pp WoW</div>
        <div class="spark">
          <app-sparkline 
            [data]="[33.1,33.3,33.6,33.4,33.7,33.5,33.8]" 
            stroke="var(--ink)" 
            fill="var(--bg-3)">
          </app-sparkline>
        </div>
      </div>
      
      <div class="kpi">
        <div class="label">Wage Cycle</div>
        <div class="value">26<span class="unit">/ 31 days</span></div>
        <div class="delta">Cycle ends 20 May · ₹68.4 L est.</div>
        <div class="spark">
          <app-sparkline 
            [data]="[8,12,16,18,22,24,26]" 
            stroke="var(--amber)" 
            fill="var(--amber-soft)">
          </app-sparkline>
        </div>
      </div>
    </div>
  `
})
export class KpiRowComponent {
  @Input() accent = false;
  
  private dataService = inject(DataService);
  trendData = this.dataService.prodTrend.map(d => d.latex);
}
