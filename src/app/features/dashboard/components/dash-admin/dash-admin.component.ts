import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SparklineComponent } from '../../../../shared/components/charts/sparkline.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dash-admin',
  standalone: true,
  imports: [CommonModule, SparklineComponent, IconComponent],
  template: `
    <div class="grid g-4 mb-16">
      <div class="kpi accent"><div class="label">System uptime · 30d</div><div class="value">99.98<span class="unit">%</span></div><div class="delta">SLA 99.9% · target met</div></div>
      <div class="kpi"><div class="label">Active users · now</div><div class="value">412</div><div class="delta">peak 612 · avg 380</div></div>
      <div class="kpi"><div class="label">API requests · today</div><div class="value">1.24<span class="unit">M</span></div><div class="delta">p95 latency 142ms</div></div>
      <div class="kpi"><div class="label">DB size</div><div class="value">4.1<span class="unit">TB / 10 TB</span></div><div class="delta">grow rate 84GB/month</div></div>
    </div>

    <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
      <div class="card bold">
        <div class="card-head"><div class="ttl">Service health · live</div><span class="badge leaf" style="margin-left: auto;">All green</span></div>
        <table class="tbl">
          <thead>
            <tr><th>Service</th><th class="num">Uptime 30d</th><th class="num">p95 ms</th><th class="num">Errors 1h</th><th>Trend</th><th>Status</th></tr>
          </thead>
          <tbody>
            @for (r of services; track r.s) {
              <tr>
                <td><b>{{ r.s }}</b></td>
                <td class="num">{{ r.u }}</td>
                <td class="num">{{ r.p }}</td>
                <td class="num">
                  @if (r.e) {
                    <span class="hl-oxide">{{ r.e }}</span>
                  } @else {
                    <span class="muted">0</span>
                  }
                </td>
                <td><app-sparkline [data]="r.t" [w]="90" [h]="26" [stroke]="'var(--' + r.st + ')'" [fill]="'var(--' + r.st + '-soft)'"></app-sparkline></td>
                <td>
                  @if (r.st === 'leaf') {
                    <span class="badge leaf">Operational</span>
                  } @else if (r.st === 'amber') {
                    <span class="badge amber">Degraded</span>
                  } @else {
                    <span class="badge oxide">Investigating</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">Recent admin events</div></div>
        <div class="card-body col" style="gap: 12px; font-size: 12px;">
          @for (f of events; track f.ev) {
            <div class="row gap-8" style="align-items: flex-start;">
              <span class="mono muted" style="min-width: 54px; font-size: 11px;">{{ f.t }}</span>
              <span class="dot" [ngClass]="f.col" style="margin-top: 6px;"></span>
              <span style="flex: 1;">{{ f.ev }}</span>
            </div>
          }
        </div>
      </div>
    </div>

    <div class="grid g-3">
      <a href="#settings" class="card bold" style="padding: 18px; text-decoration: none;">
        <div class="row gap-16">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: var(--bg-3); display: grid; place-items: center;"><app-icon name="Users" [size]="22"></app-icon></div>
          <div><b>Users & Roles</b><div class="muted" style="font-size: 11px;">74 users · 8 roles · 2 pending invites</div></div>
        </div>
      </a>
      <a href="#settings" class="card bold" style="padding: 18px; text-decoration: none;">
        <div class="row gap-16">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: var(--bg-3); display: grid; place-items: center;"><app-icon name="Activity" [size]="22"></app-icon></div>
          <div><b>Integrations</b><div class="muted" style="font-size: 11px;">9 connected · 1 disabled (eOffice)</div></div>
        </div>
      </a>
      <a href="#settings" class="card bold" style="padding: 18px; text-decoration: none;">
        <div class="row gap-16">
          <div style="width: 42px; height: 42px; border-radius: 8px; background: var(--bg-3); display: grid; place-items: center;"><app-icon name="Shield" [size]="22"></app-icon></div>
          <div><b>Security audit</b><div class="muted" style="font-size: 11px;">VAPT due 14 Jun · CERT-In quarterly</div></div>
        </div>
      </a>
    </div>
  `
})
export class DashAdminComponent {
  services = [
    {s:'API gateway',         u:'99.98%', p:142, e:0,  t:[120,124,128,131,135,142], st:'leaf'},
    {s:'Auth service',        u:'100.0%', p: 38, e:0,  t:[34,36,38,37,38,38], st:'leaf'},
    {s:'Payroll engine',      u:'99.94%', p:680, e:2,  t:[640,720,680,700,690,680], st:'leaf'},
    {s:'Biometric svc',       u:'99.78%', p: 84, e:1,  t:[78,82,88,80,84,84], st:'leaf'},
    {s:'NEFT bridge · KSB',   u:'99.91%', p:1240,e:0,  t:[1180,1200,1240,1220,1230,1240], st:'leaf'},
    {s:'SMS gateway · BSNL',  u:'98.42%', p:340, e:8,  t:[280,320,400,460,360,340], st:'amber'},
    {s:'Rubber Board sync',   u:'92.18%', p:2400,e:14, t:[1800,2100,2800,2600,2400,2400], st:'oxide'},
  ];

  events = [
    {t:'09:42', ev:'User created · auditor (Suja Krishnan)', col:'leaf'},
    {t:'09:18', ev:'Role permissions edited · Field Supervisor', col:'mute'},
    {t:'08:54', ev:'⚠ SMS gateway latency spike · 460ms', col:'amber'},
    {t:'08:30', ev:'Backup completed · 28.4 GB · S3 verified', col:'leaf'},
    {t:'07:12', ev:'Failed login · 4 attempts on EMP-1944', col:'oxide'},
    {t:'06:00', ev:'Wage cron started · 1,623 workers', col:'mute'},
    {t:'25/05 02:00', ev:'DR replica caught up · lag 0s', col:'leaf'},
  ];
}
