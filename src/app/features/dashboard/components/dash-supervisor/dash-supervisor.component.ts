import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Role } from '../../../../core/services/roles.service';

@Component({
  selector: 'app-dash-supervisor',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="card bold mb-16" style="background: var(--ink); color: var(--bg); border: none;">
      <div class="card-body row" style="padding: 24px; gap: 24px; align-items: center;">
        <div class="avatar" style="width: 56px; height: 56px; font-size: 18px; background: var(--accent);">{{ role?.avatar }}</div>
        <div style="flex: 1;">
          <div style="font-size: 11px; color: var(--bg-3); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700;">Good morning · ശുഭദിനം</div>
          <div style="font-size: 24px; font-weight: 800; margin-top: 2px;">{{ role?.name }} · {{ role?.title }}</div>
          <div style="font-size: 13px; color: var(--bg-3); margin-top: 2px;">
            {{ isTapping ? '18 blocks · D1 cycle today · 412 tappers in rotation' : '3 blocks · D1 cycle today · 38 tappers under you' }}
          </div>
        </div>
        <div class="grid g-3" style="gap: 24px;">
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Tappers · today</div>
            <div class="mono" style="font-size: 26px; font-weight: 800;">{{ isTapping ? '404/412' : '36/38' }}</div>
          </div>
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Latex collected</div>
            <div class="mono" style="font-size: 26px; font-weight: 800;">{{ isTapping ? '9,420' : '284' }}<span style="font-size: 14px; color: var(--bg-3);"> kg</span></div>
          </div>
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Pending verify</div>
            <div class="mono" style="font-size: 26px; font-weight: 800; color: var(--accent-hi);">{{ isTapping ? '24' : '9' }}</div>
          </div>
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

    <div class="grid mb-16" style="grid-template-columns: 1.4fr 1fr;">
      <div class="card bold">
        <div class="card-head"><div class="ttl">My blocks · today (D1 cycle)</div></div>
        <table class="tbl">
          <thead>
            <tr>
              <th>Block</th><th class="num">Tappers</th><th class="num">Present</th>
              <th class="num">Latex kg</th><th class="num">Avg DRC</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            @for (r of myBlocks; track r.b) {
              <tr>
                <td><b>{{ r.b }}</b></td>
                <td class="num">{{ r.tp }}</td>
                <td class="num"><b>{{ r.pr }}/{{ r.tp }}</b></td>
                <td class="num mono">{{ r.kg }}</td>
                <td class="num">{{ r.drc }}%</td>
                <td><span class="badge" [ngClass]="r.st">{{ r.sl }}</span></td>
                <td><a href="#dps" class="btn ghost sm">Open DPS</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">To-do · 4 items</div></div>
        <div class="card-body col" style="gap: 14px;">
          @for (r of todoList; track r.t) {
            <div class="row gap-8" style="align-items: flex-start;">
              <span class="dot" [ngClass]="r.col" style="margin-top: 6px;"></span>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 13px;">{{ r.t }}</div>
                <div class="muted" style="font-size: 11px;">{{ r.s }}</div>
              </div>
              <a [href]="'#' + r.route" class="btn ghost sm">Open</a>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DashSupervisorComponent {
  @Input({ required: true }) role!: Role | undefined;

  get isTapping() {
    return this.role?.id === 'tapping-sup';
  }

  quickActions = [
    {l:'Open muster', s:'KLP-B07 · D1', i:'Clock',     r:'attendance', color:'leaf'},
    {l:'Add DPS entry', s:'9 pending verification', i:'Droplet', r:'dps', color:'clay'},
    {l:'Record intake', s:'CC-Main · 6 batches due', i:'Truck', r:'collection', color:'leaf'},
    {l:'Issue ammonia', s:'2 blocks awaiting', i:'Boxes', r:'inventory', color:'amber'},
  ];

  myBlocks = [
    {b:'KLP-B07 Kallarkutty B7',  tp:12, pr:11, kg:126, drc:33.8, st:'leaf', sl:'On track'},
    {b:'KLP-B08 Kallarkutty B8',  tp:10, pr: 9, kg: 86, drc:32.4, st:'amber', sl:'DRC low'},
    {b:'KLP-B12 Aryankavu A',     tp:16, pr:16, kg:108, drc:33.5, st:'leaf', sl:'On track'},
  ];

  todoList = [
    {t:'Verify 9 DPS entries', s:'Submitted by V. Raj · 09:32', col:'amber', route:'dps'},
    {t:'Mark Suresh Babu absent (3rd day)', s:'Auto-escalate to Field Officer', col:'oxide', route:'attendance'},
    {t:'Sample retest · Saritha Anand', s:'DRC 31.4% flagged at CC', col:'oxide', route:'collection'},
    {t:'Submit Estimate EST-1042', s:'+12 mandays · clearing B19', col:'clay', route:'mazdoor'},
  ];
}
