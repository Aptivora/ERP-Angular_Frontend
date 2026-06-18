import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Role } from '../../../../core/services/roles.service';
import { BiComponent } from '../../../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dash-supervisor',
  standalone: true,
  imports: [CommonModule, IconComponent, BiComponent],
  template: `
    <div class="card bold mb-16" style="background: var(--ink); color: var(--bg); border: none;">
      <div class="card-body row" style="padding: 24px; gap: 24px; align-items: center;">
        <div class="avatar" style="width: 56px; height: 56px; font-size: 18px; background: var(--accent);">{{ role?.avatar }}</div>
        <div style="flex: 1;">
          <div style="font-size: 11px; color: var(--bg-3); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700;"><app-bi k="good_morning"></app-bi></div>
          <div style="font-size: 24px; font-weight: 800; margin-top: 2px;">{{ role?.name }} · {{ role?.title }}</div>
          <div style="font-size: 13px; color: var(--bg-3); margin-top: 2px;">
            <app-bi [k]="isTapping ? 'blocks_18_msg' : 'blocks_3_msg'"></app-bi>
          </div>
        </div>
        <div class="grid g-3" style="gap: 24px;">
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;"><app-bi k="tappers_today"></app-bi></div>
            <div class="mono" style="font-size: 26px; font-weight: 800;">{{ isTapping ? '404/412' : '36/38' }}</div>
          </div>
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;"><app-bi k="latex_collected"></app-bi></div>
            <div class="mono" style="font-size: 26px; font-weight: 800;">{{ isTapping ? '9,420' : '284' }}<span style="font-size: 14px; color: var(--bg-3);"> <app-bi k="kg"></app-bi></span></div>
          </div>
          <div>
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;"><app-bi k="pending_verify"></app-bi></div>
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
              <div style="font-weight: 700; font-size: 14px;"><app-bi [k]="a.l"></app-bi></div>
              <div class="muted" style="font-size: 11px;"><app-bi [k]="a.s"></app-bi></div>
            </div>
            <app-icon name="ChevronR" [size]="16" style="margin-left: auto; color: var(--ink-3);"></app-icon>
          </div>
        </a>
      }
    </div>

    <div class="grid mb-16" style="grid-template-columns: 1.4fr 1fr;">
      <div class="card bold">
        <div class="card-head"><div class="ttl"><app-bi k="my_blocks_today_d1"></app-bi></div></div>
        <table class="tbl">
          <thead>
            <tr>
              <th><app-bi k="block"></app-bi></th><th class="num"><app-bi k="tappers"></app-bi></th><th class="num"><app-bi k="present"></app-bi></th>
              <th class="num"><app-bi k="latex_wt_lbl"></app-bi></th><th class="num"><app-bi k="avg_drc"></app-bi></th><th><app-bi k="status"></app-bi></th><th></th>
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
                <td><span class="badge" [ngClass]="r.st"><app-bi [k]="r.sl"></app-bi></span></td>
                <td><a href="#dps" class="btn ghost sm"><app-bi k="open_dps"></app-bi></a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl"><app-bi k="todo_4_items"></app-bi></div></div>
        <div class="card-body col" style="gap: 14px;">
          @for (r of todoList; track r.t) {
            <div class="row gap-8" style="align-items: flex-start;">
              <span class="dot" [ngClass]="r.col" style="margin-top: 6px;"></span>
              <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 13px;"><app-bi [k]="r.t"></app-bi></div>
                <div class="muted" style="font-size: 11px;"><app-bi [k]="r.s"></app-bi></div>
              </div>
              <a [href]="'#' + r.route" class="btn ghost sm"><app-bi k="open"></app-bi></a>
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
    {l:'open_muster', s:'klp_b07_d1', i:'Clock',     r:'attendance', color:'leaf'},
    {l:'add_dps_entry', s:'pending_verification_9', i:'Droplet', r:'dps', color:'clay'},
    {l:'record_intake', s:'cc_main_6_batches', i:'Truck', r:'collection', color:'leaf'},
    {l:'issue_ammonia', s:'blocks_awaiting_2', i:'Boxes', r:'inventory', color:'amber'},
  ];

  myBlocks = [
    {b:'KLP-B07 Kallarkutty B7',  tp:12, pr:11, kg:126, drc:33.8, st:'leaf', sl:'on_track'},
    {b:'KLP-B08 Kallarkutty B8',  tp:10, pr: 9, kg: 86, drc:32.4, st:'amber', sl:'drc_low'},
    {b:'KLP-B12 Aryankavu A',     tp:16, pr:16, kg:108, drc:33.5, st:'leaf', sl:'on_track'},
  ];

  todoList = [
    {t:'verify_9_dps', s:'submitted_by_v_raj', col:'amber', route:'dps'},
    {t:'mark_suresh_absent', s:'auto_escalate_field_officer', col:'oxide', route:'attendance'},
    {t:'sample_retest_saritha', s:'drc_flagged_cc', col:'oxide', route:'collection'},
    {t:'submit_estimate_est', s:'plus_12_mandays', col:'clay', route:'mazdoor'},
  ];
}
