import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  template: `
    <svg [attr.width]="w" [attr.height]="h" style="display:block;">
      <path [attr.d]="areaPath()" [attr.fill]="fill"/>
      <path [attr.d]="linePath()" [attr.stroke]="stroke" stroke-width="1.5" fill="none"/>
    </svg>
  `,
  styles: [':host { display: block; }']
})
export class SparklineComponent {
  @Input({ required: true }) data!: number[];
  @Input() w = 120;
  @Input() h = 36;
  @Input() stroke = 'var(--accent)';
  @Input() fill = 'var(--accent-soft)';

  pts = computed(() => {
    const d = this.data;
    if (!d || d.length === 0) return [];
    const max = Math.max(...d);
    const min = Math.min(...d);
    const range = (max - min) || 1;
    return d.map((v, i) => [
      (i / (d.length - 1)) * this.w,
      this.h - ((v - min) / range) * (this.h - 4) - 2
    ]);
  });

  linePath = computed(() => {
    const points = this.pts();
    if (points.length === 0) return '';
    return 'M' + points.map(p => p.join(',')).join(' L');
  });

  areaPath = computed(() => {
    const p = this.linePath();
    if (!p) return '';
    return `${p} L${this.w},${this.h} L0,${this.h} Z`;
  });
}
