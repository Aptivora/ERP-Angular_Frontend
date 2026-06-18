import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiRowComponent } from '../kpi-row/kpi-row.component';
import { BiComponent } from '../../../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dash-b',
  standalone: true,
  imports: [CommonModule, KpiRowComponent, BiComponent],
  template: `
    <app-kpi-row [accent]="false"></app-kpi-row>
    <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
      <div class="card bold" style="min-height: 420px;">
        <div class="card-head">
          <div class="ttl"><app-bi k="estate_map"></app-bi></div>
          <div class="row gap-8" style="margin-left: auto;">
            <span class="chip"><span class="dot leaf"></span> <app-bi k="mature"></app-bi></span>
            <span class="chip"><span class="dot amber"></span> <app-bi k="immature"></app-bi></span>
            <span class="chip"><span class="dot oxide"></span> <app-bi k="cut_slaughter"></app-bi></span>
          </div>
        </div>
        <div class="card-body" style="padding: 0; background: var(--bg-2); position: relative; height: 380px; overflow: hidden;">
          <!-- Stylized estate map -->
          <svg viewBox="0 0 800 380" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--rule-soft)" stroke-width="0.5"/>
              </pattern>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 0 6 L 6 0" stroke="var(--oxide)" stroke-width="0.7" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="800" height="380" fill="url(#grid)"/>
            <!-- river -->
            <path d="M 0 280 Q 200 240 380 290 T 800 250" stroke="#7eb4d1" stroke-width="14" fill="none" opacity="0.5"/>
            <text x="80" y="276" font-size="9" fill="#3a6478" font-family="var(--font-mono)"><app-bi k="kallada_river"></app-bi></text>
            <!-- blocks -->
            @for (b of blocks; track b.label) {
              <g>
                <rect [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h" [attr.fill]="b.col" [attr.stroke]="b.stroke" stroke-width="2"/>
                @if (b.d.includes('Slaughter')) {
                  <rect [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h" fill="url(#hatch)"/>
                }
                <text [attr.x]="b.x+8" [attr.y]="b.y+16" font-size="11" font-weight="700" fill="var(--ink)">{{ b.label }}</text>
                <text [attr.x]="b.x+8" [attr.y]="b.y+30" font-size="9" fill="var(--ink-3)" font-family="var(--font-mono)">{{ b.cycle }} · {{ b.d }}</text>
              </g>
            }
            <circle cx="380" cy="320" r="9" fill="var(--accent)" stroke="var(--surface)" stroke-width="3"/>
            <text x="395" y="324" font-size="10" font-weight="700" fill="var(--ink)"><app-bi k="cc_main_map"></app-bi></text>
          </svg>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl"><app-bi k="live_ops_feed"></app-bi></div><span class="dot leaf" style="margin-left: auto;"></span></div>
        <div class="card-body col" style="gap: 12px; font-size: 12px;">
          @for (f of feed; track f.t) {
            <div class="row gap-8" style="align-items: flex-start;">
              <span class="mono muted" style="min-width: 38px; font-size: 11px;">{{ f.t }}</span>
              <span class="dot" [ngClass]="f.col" style="margin-top: 6px;"></span>
              <span>{{ f.ev }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DashBComponent {
  blocks = [
    {x:60, y:60, w:140, h:90, label:'B7 Kallarkutty', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D1', d:'8.4t'},
    {x:210, y:60, w:120, h:90, label:'B8 Kallarkutty', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D2', d:'6.9t'},
    {x:340, y:60, w:160, h:130, label:'B12 Aryankavu', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D3', d:'11.2t'},
    {x:510, y:60, w:130, h:110, label:'B19 Vilakkupara', col:'var(--amber-soft)', stroke:'var(--amber)', cycle:'—', d:'imm.'},
    {x:650, y:60, w:120, h:80, label:'B23 Edamon', col:'var(--oxide-soft)', stroke:'var(--oxide)', cycle:'—', d:'CUT'},
    {x:60, y:160, w:140, h:90, label:'B27 Tenmala', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D4', d:'9.6t'},
    {x:210, y:160, w:120, h:90, label:'B28 Tenmala', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D4', d:'8.1t'},
    {x:510, y:180, w:130, h:90, label:'B31 Tenmala', col:'#e3dccb', stroke:'var(--ink-3)', cycle:'—', d:'Slaughter'},
    {x:650, y:150, w:120, h:90, label:'B33 Vilakkupara', col:'var(--leaf-soft)', stroke:'var(--leaf)', cycle:'D1', d:'7.4t'},
  ];

  feed = [
    {t:'09:42', ev:'Latex intake · 412 kg from B27', col:'leaf'},
    {t:'09:31', ev:'V. Raj verified 6 DPS entries (B7)', col:'mute'},
    {t:'09:18', ev:'CC weighing complete · D4 batch 03', col:'mute'},
    {t:'08:54', ev:'⚠ Saritha Anand DRC 31.4% (B8)', col:'oxide'},
    {t:'08:40', ev:'Ammonia drum #14 broken seal · noted', col:'amber'},
    {t:'08:22', ev:'Muster opened · 404/412 marked present', col:'leaf'},
    {t:'08:00', ev:'D4 tapping cycle started · Tenmala', col:'mute'},
  ];
}
