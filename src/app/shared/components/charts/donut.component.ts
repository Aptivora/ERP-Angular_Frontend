import { Component, Input, computed } from '@angular/core';

@Component({
  selector: 'app-donut',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" [attr.viewBox]="'0 0 ' + size + ' ' + size">
      <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="r()" fill="none" stroke="var(--bg-3)" stroke-width="12"/>
      
      @for (seg of renderSegments(); track seg.i) {
        <circle [attr.cx]="size/2" [attr.cy]="size/2" [attr.r]="r()" fill="none"
                [attr.stroke]="seg.color" stroke-width="12"
                [attr.stroke-dasharray]="seg.dash" [attr.stroke-dashoffset]="-seg.off"
                [attr.transform]="'rotate(-90 ' + size/2 + ' ' + size/2 + ')'"/>
      }
      
      <text [attr.x]="size/2" [attr.y]="size/2 - 2" text-anchor="middle" font-size="22" font-family="var(--font-mono)" font-weight="700" fill="var(--ink)">{{ total() }}</text>
      <text [attr.x]="size/2" [attr.y]="size/2 + 14" text-anchor="middle" font-size="9" fill="var(--ink-3)" letter-spacing="0.1em">TOTAL</text>
    </svg>
  `,
  styles: [':host { display: block; }']
})
export class DonutComponent {
  @Input({ required: true }) segments!: {v: number, color: string}[];
  @Input() size = 120;

  total = computed(() => this.segments?.reduce((s, x) => s + x.v, 0) || 0);
  r = computed(() => this.size / 2 - 6);
  c = computed(() => 2 * Math.PI * this.r());

  renderSegments = computed(() => {
    if (!this.segments) return [];
    let off = 0;
    const tot = this.total();
    const circ = this.c();
    
    return this.segments.map((s, i) => {
      const len = tot > 0 ? (s.v / tot) * circ : 0;
      const dash = `${len} ${circ - len}`;
      const currOff = off;
      off += len;
      return { i, color: s.color, dash, off: currOff };
    });
  });
}
