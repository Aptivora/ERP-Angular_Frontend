import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `
    <svg [attr.width]="w" [attr.height]="h" style="display:block;">
      @for (t of [0, 0.25, 0.5, 0.75, 1]; track t) {
        <line x1="0" [attr.x2]="w" [attr.y1]="h - h*t" [attr.y2]="h - h*t" stroke="var(--rule-soft)" stroke-dasharray="2 3"/>
      }
      
      @for (col of chartData(); track col.i) {
        <g [attr.transform]="'translate(' + (col.i * bw()) + ', 0)'">
          @for (rect of col.rects; track rect.key) {
            <rect [attr.x]="pad/2" [attr.y]="rect.y" [attr.width]="bw() - pad" [attr.height]="rect.h" [attr.fill]="rect.color"/>
          }
          
          <line [attr.x1]="pad/2" [attr.x2]="bw() - pad/2" [attr.y1]="col.baseY" [attr.y2]="col.baseY" stroke="var(--oxide)" stroke-dasharray="3 2"/>
          <text [attr.x]="bw()/2" [attr.y]="h + 14" text-anchor="middle" font-size="10" fill="var(--ink-3)" font-family="var(--font-mono)">{{ col.label }}</text>
        </g>
      }
    </svg>
  `,
  styles: [':host { display: block; }']
})
export class BarChartComponent {
  @Input({ required: true }) data!: any[];
  @Input() w = 600;
  @Input() h = 200;
  @Input() keys = ['latex', 'scrap'];
  @Input() colors = ['var(--accent)', 'var(--ink-3)'];
  
  pad = 14;

  bw = computed(() => this.w / Math.max(1, this.data?.length || 1));

  chartData = computed(() => {
    if (!this.data || this.data.length === 0) return [];
    
    const maxVal = Math.max(...this.data.map(d => this.keys.reduce((s, k) => s + (d[k] || 0), 0))) * 1.15;
    const height = this.h;
    
    return this.data.map((d, i) => {
      let yOff = height;
      const rects = this.keys.map((k, ki) => {
        const bh = ((d[k] || 0) / maxVal) * height;
        yOff -= bh;
        return { key: k, color: this.colors[ki], y: yOff, h: bh };
      });
      
      const baseY = height - ((d.base || 0) / maxVal) * height;
      
      return {
        i,
        label: d.d,
        rects,
        baseY
      };
    });
  });
}
