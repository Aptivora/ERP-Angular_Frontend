import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Role } from '../../../../core/services/roles.service';

@Component({
  selector: 'app-dash-cc-worker',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="card bold mb-16" style="background: var(--leaf); color: white; border: none;">
      <div class="card-body row" style="padding: 24px; gap: 24px; align-items: center;">
        <div class="avatar" style="width: 48px; height: 48px; font-size: 16px; background: white; color: var(--leaf);">{{ role?.avatar }}</div>
        <div style="flex: 1;">
          <div style="font-size: 11px; color: rgba(255,255,255,0.7); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700;">Good morning</div>
          <div style="font-size: 22px; font-weight: 800; margin-top: 2px;">{{ role?.name }}</div>
          <div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 2px;">{{ role?.scope }}</div>
        </div>
        <div class="grid g-3" style="gap: 24px;">
          <div><div style="font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Today intake</div><div class="mono" style="font-size: 26px; font-weight: 800;">2,584<span style="font-size: 13px; opacity: 0.8;"> kg</span></div></div>
          <div><div style="font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Batches done</div><div class="mono" style="font-size: 26px; font-weight: 800;">36<span style="font-size: 13px; opacity: 0.8;">/42</span></div></div>
          <div><div style="font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Retests due</div><div class="mono" style="font-size: 26px; font-weight: 800;">5</div></div>
        </div>
      </div>
    </div>

    <div class="grid g-4 mb-16">
      @for (a of quickActions; track a.l) {
        <a [href]="'#' + a.r" class="card bold" style="padding: 18px; text-decoration: none; cursor: pointer;">
          <div class="row gap-16" style="align-items: center;">
            <div [style.background]="'var(--' + a.color + '-soft)'" [style.color]="'var(--' + (a.color === 'clay' ? 'accent' : a.color) + ')'" style="width: 44px; height: 44px; border-radius: 8px; display: grid; place-items: center;">
              <app-icon [name]="a.i" [size]="22"></app-icon>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px;">{{ a.l }}</div>
              <div class="muted" style="font-size: 11px;">{{ a.s }}</div>
            </div>
            <app-icon name="ChevronR" [size]="16" style="margin-left: auto; color: var(--ink-3);"></app-icon>
          </div>
        </a>
      }
    </div>

    <div class="grid mb-16" style="grid-template-columns: 1.4fr 1fr; gap: 16px;">
      <div class="card bold">
        <div class="card-head"><div class="ttl">Last 8 intakes · awaiting tag</div></div>
        <table class="tbl dense">
          <thead>
            <tr><th>Time</th><th>Batch</th><th>Block</th><th>Tapper</th><th class="num">Net kg</th><th class="num">DRC %</th><th>Status</th></tr>
          </thead>
          <tbody>
            @for (r of recentIntakes; track r.b) {
              <tr>
                <td class="mono">{{ r.t }}</td>
                <td class="mono"><b>{{ r.b }}</b></td>
                <td>{{ r.blk }}</td>
                <td>{{ r.tap }}</td>
                <td class="num">{{ r.kg }}</td>
                <td class="num">{{ r.drc }}</td>
                <td><span class="badge" [ngClass]="r.c">{{ r.s }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">CC stock at hand</div></div>
        <div class="card-body col" style="gap: 10px; font-size: 12px;">
          @for (r of stock; track r.l) {
            <div>
              <div class="row between"><span>{{ r.l }}</span><b class="mono">{{ r.v }}</b></div>
              <div class="bar"><i [style.width.%]="r.p" [style.background]="'var(--' + r.c + ')'"></i></div>
            </div>
          }
          <a href="#inventory" class="btn ghost sm mt-8" style="justify-content: center;">Full inventory →</a>
        </div>
      </div>
    </div>
  `
})
export class DashCcWorkerComponent {
  @Input({ required: true }) role!: Role | undefined;

  quickActions = [
    {l:'New intake', s:'Weigh + DRC sample', i:'Plus',   r:'collection', color:'leaf'},
    {l:'Open intake queue', s:'6 batches awaiting', i:'Truck', r:'collection', color:'clay'},
    {l:'Issue ammonia', s:'2 blocks requested',    i:'Boxes', r:'inventory', color:'amber'},
    {l:'My muster', s:'Mark present 07:00',         i:'Clock', r:'attendance', color:'leaf'},
  ];

  recentIntakes = [
    {t:'06:42', b:'B-001', blk:'KLP-B07', tap:'Rajan Pillai', kg:'32.4', drc:'33.8', c:'leaf', s:'OK'},
    {t:'06:48', b:'B-002', blk:'KLP-B07', tap:'Lekha Devi', kg:'34.1', drc:'34.2', c:'leaf', s:'OK'},
    {t:'07:02', b:'B-003', blk:'KLP-B08', tap:'Sasi Kumar', kg:'29.6', drc:'32.9', c:'leaf', s:'OK'},
    {t:'07:14', b:'B-004', blk:'KLP-B08', tap:'Saritha Anand', kg:'26.8', drc:'31.4', c:'amber', s:'Retest'},
    {t:'07:31', b:'B-005', blk:'KLP-B12', tap:'Mini Joseph', kg:'36.8', drc:'33.5', c:'leaf', s:'OK'},
    {t:'07:46', b:'B-006', blk:'KLP-B27', tap:'Anil Kumar', kg:'35.2', drc:'34.0', c:'clay', s:'DPS hold'},
    {t:'08:02', b:'B-007', blk:'KLP-B27', tap:'Geetha Mohan', kg:'38.6', drc:'34.6', c:'leaf', s:'OK'},
  ];

  stock = [
    {l:'Ammonia 25% bulk',  v:'2,840 L',  p:57, c:'leaf'},
    {l:'Drum 200L · 14',    v:'14 drums', p:46, c:'leaf'},
    {l:'Latex cups (HDPE)', v:'1,840 pcs',p:30, c:'oxide'},
    {l:'Rainguard polythene',v:'28 rolls',p:46, c:'leaf'},
  ];
}
