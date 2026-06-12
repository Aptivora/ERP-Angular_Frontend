import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Settings & Administration"
        ml="ക്രമീകരണങ്ങൾ"
        sub="Roles, permissions, integrations, system health"
      ></app-page-head>

      <div class="tabs mb-16">
        @for (t of tabs; track t.id) {
          <div class="tab" [class.active]="tab === t.id" (click)="tab = t.id">{{ t.l }}</div>
        }
      </div>

      @if (tab === 'roles') {
        <div class="grid mb-16" style="grid-template-columns: 1fr 1.4fr;">
          <div class="card bold">
            <div class="card-head">
              <div class="ttl">Roles · 8 defined</div>
              <button class="btn ghost sm" style="margin-left: auto;"><app-icon name="Plus" [size]="12"></app-icon>New role</button>
            </div>
            <table class="tbl dense">
              <thead><tr><th>Role</th><th class="num">Users</th><th>Scope</th></tr></thead>
              <tbody>
                @for (r of rolesList; track r.r) {
                  <tr>
                    <td><b>{{ r.r }}</b></td>
                    <td class="num">{{ r.u }}</td>
                    <td class="muted">{{ r.s }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Permission matrix · Field Supervisor</div></div>
            <div class="table-responsive">
              <table class="tbl">
                <thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Approve</th><th>Delete</th></tr></thead>
                <tbody>
                  @for (r of perms; track r[0]) {
                    <tr>
                      <td><b>{{ r[0] }}</b></td>
                      @for (v of r.slice(1); track $index) {
                        <td>
                          @if (v) {
                            <app-icon name="Check" [size]="14" stroke="var(--leaf)"></app-icon>
                          } @else {
                            <span class="muted">—</span>
                          }
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      @if (tab === 'org') {
        <div class="grid g-2">
          <div class="card bold">
            <div class="card-head"><div class="ttl">Organisation details</div></div>
            <div class="card-body grid g-2" style="gap: 14px;">
              <div class="field"><label>Legal name</label><input class="input" [value]="'State Farming Corporation of Kerala Ltd.'" /></div>
              <div class="field"><label>CIN</label><input class="input mono" [value]="'U01122KL1972SGC002545'" /></div>
              <div class="field"><label>GSTIN</label><input class="input mono" [value]="'32AAACT5234L1ZS'" /></div>
              <div class="field"><label>PF code</label><input class="input mono" [value]="'KR/KKD/0008412'" /></div>
              <div class="field"><label>ESI code</label><input class="input mono" [value]="'62-37-29-1842-001'" /></div>
              <div class="field"><label>Rubber Board reg.</label><input class="input mono" [value]="'RB/KL/PLN/04-1972'" /></div>
              <div class="field" style="grid-column: span 2;"><label>Registered office</label><textarea class="textarea" rows="2">Kottayam, Kerala 686001</textarea></div>
            </div>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Wage cycle & shift</div></div>
            <div class="card-body grid g-2" style="gap: 14px;">
              <div class="field"><label>Wage cycle</label><select class="select"><option>21st to 20th</option><option>1st to 31st</option></select></div>
              <div class="field"><label>Pay date</label><select class="select"><option>Last working day of cycle</option><option>+5 days</option></select></div>
              <div class="field"><label>Shift start</label><input class="input mono" [value]="'06:00'" /></div>
              <div class="field"><label>Shift end</label><input class="input mono" [value]="'13:30'" /></div>
              <div class="field"><label>Min mandays for incentive</label><input class="input mono" [value]="'22'" /></div>
              <div class="field"><label>Base yield (kg/tapper/day)</label><input class="input mono" [value]="'10.5'" /></div>
            </div>
          </div>
        </div>
      }

      @if (tab === 'payroll') {
        <div class="grid g-2">
          <div class="card bold">
            <div class="card-head"><div class="ttl">Head-load slab</div></div>
            <table class="tbl dense">
              <thead><tr><th>From (m)</th><th>To (m)</th><th class="num">Rate ₹/kg</th><th></th></tr></thead>
              <tbody>
                <tr><td class="mono">0</td><td class="mono">500</td><td class="num mono">0.42</td><td><button class="btn ghost sm" (click)="onAction('Editing slab 0-500m')"><app-icon name="Edit" [size]="12"></app-icon></button></td></tr>
                <tr><td class="mono">501</td><td class="mono">1,000</td><td class="num mono">0.62</td><td><button class="btn ghost sm" (click)="onAction('Editing slab 501-1000m')"><app-icon name="Edit" [size]="12"></app-icon></button></td></tr>
                <tr><td class="mono">1,001</td><td class="mono">1,500</td><td class="num mono">0.84</td><td><button class="btn ghost sm" (click)="onAction('Editing slab 1001-1500m')"><app-icon name="Edit" [size]="12"></app-icon></button></td></tr>
                <tr><td class="mono">1,501</td><td class="mono">2,000</td><td class="num mono">1.06</td><td><button class="btn ghost sm" (click)="onAction('Editing slab 1501-2000m')"><app-icon name="Edit" [size]="12"></app-icon></button></td></tr>
                <tr><td class="mono">2,001</td><td class="mono">+</td><td class="num mono">1.28</td><td><button class="btn ghost sm" (click)="onAction('Editing slab 2000+m')"><app-icon name="Edit" [size]="12"></app-icon></button></td></tr>
              </tbody>
            </table>
            <div class="card-head"><div class="ttl">Bonus & incentives (custom scale)</div></div>
            <div class="card-body"></div>
            <div class="card-foot"><button class="btn ghost sm" (click)="onAction('Opening bonus slab configurator...')">Add slab</button></div>
          </div>

          <div class="card bold">
            <div class="card-head"><div class="ttl">DRC-based incentive</div></div>
            <table class="tbl dense">
              <thead><tr><th>Base yield (kg)</th><th>Bonus per kg</th><th>Applicable</th></tr></thead>
              <tbody>
                <tr><td class="mono">10.5 – 12.0</td><td class="num mono">₹1.40</td><td>Permanent tappers</td></tr>
                <tr><td class="mono">12.1 – 14.0</td><td class="num mono">₹2.80</td><td>Permanent tappers</td></tr>
                <tr><td class="mono">14.1 – 16.0</td><td class="num mono">₹4.20</td><td>All tappers</td></tr>
                <tr><td class="mono">16.1 +</td><td class="num mono">₹6.00</td><td>All tappers</td></tr>
              </tbody>
            </table>
            <div class="card-foot"><span class="muted" style="font-size: 11px;">Penalty 20% if DRC &lt; 32%</span></div>
          </div>

          <div class="card bold" style="grid-column: span 2;">
            <div class="card-head"><div class="ttl">DA · Dearness Allowance history</div></div>
            <table class="tbl dense">
              <thead><tr><th>Effective from</th><th>Rate ₹/day</th><th>GO ref.</th><th>Applied via</th></tr></thead>
              <tbody>
                <tr><td>29-Apr-2026</td><td class="num mono">186</td><td class="mono">GO(Rt) 412/2026/Lab.</td><td><span class="badge clay">Mid-cycle (auto-prorate)</span></td></tr>
                <tr><td>01-Jan-2026</td><td class="num mono">178</td><td class="mono">GO(Rt) 18/2026/Lab.</td><td><span class="badge leaf">Cycle start</span></td></tr>
                <tr><td>01-Sep-2025</td><td class="num mono">172</td><td class="mono">GO(Rt) 612/2025/Lab.</td><td><span class="badge leaf">Cycle start</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (tab === 'integrations') {
        <div class="grid g-3">
          @for (r of ints; track r.n) {
            <div class="card bold">
              <div class="card-body">
                <div class="row between">
                  <b>{{ r.n }}</b>
                  <span class="badge" [ngClass]="r.st === 'on' ? 'leaf' : 'mute'">{{ r.st === 'on' ? 'Connected' : 'Disabled' }}</span>
                </div>
                <div class="muted mt-8" style="font-size: 12px;">{{ r.d }}</div>
                <div><div style="font-weight: 600; font-size: 13px;">Daily automated sync</div><div class="muted mt-8" style="font-size: 12px;">Sync worker master and production yields to central HQ server at 18:00 every day via secure API.</div></div>
                <div>
                  <button class="btn ghost sm" (click)="onAction('Opening sync settings...')">Configure</button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (tab === 'health') {
        <div class="grid g-2">
          <div class="card bold">
            <div class="card-head">
              <div class="ttl">System status</div>
              <span class="badge leaf" style="margin-left: auto;">All operational</span>
            </div>
            <div class="card-body col" style="gap: 10px; font-size: 13px;">
              @for (r of sysHealth; track r.s) {
                <div class="row between" style="padding: 8px 0; border-bottom: var(--bd-soft);">
                  <div class="row gap-8"><span class="dot leaf"></span><b>{{ r.s }}</b></div>
                  <div class="row gap-16"><span class="mono">{{ r.v }}</span><span class="muted" style="font-size: 11px;">{{ r.d }}</span></div>
                </div>
              }
            </div>
          </div>
          <div class="card bold">
            <div class="card-head"><div class="ttl">Backup & DR</div></div>
            <div class="card-body col" style="gap: 14px; font-size: 13px;">
              <div>
                <b>Last full backup</b><div class="muted" style="font-size: 12px;">25 May · 02:00 IST · 28.4 GB</div>
              </div>
              <div>
                <b>Incrementals</b><div class="muted" style="font-size: 12px;">Every 30 min · last 09:30 IST · 142 MB</div>
              </div>
              <div>
                <b>DR replication site</b><div class="muted" style="font-size: 12px;">Kerala SDC-2 Thiruvananthapuram · RPO 5 min / RTO 30 min</div>
              </div>
              <div>
                <b>Last DR drill</b><div class="muted" style="font-size: 12px;">14 Mar 2026 · failover 18 min · pass</div>
              </div>
              <button class="btn ghost" (click)="onAction('Triggering manual snapshot...')">Trigger manual snapshot</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SettingsComponent {
  tab = 'roles';
  activeRole = 'Tapper';

  onAction(msg: string) {
    alert(msg);
  }

  tabs = [
    { id: 'org', l: 'Organisation' },
    { id: 'roles', l: 'Roles & Users' },
    { id: 'payroll', l: 'Payroll Rules' },
    { id: 'integrations', l: 'Integrations' },
    { id: 'health', l: 'System Health' }
  ];

  rolesList = [
    { r: 'Managing Director', u: 1, s: 'All estates · all modules' },
    { r: 'General Manager', u: 2, s: 'All estates · ops + finance' },
    { r: 'Estate Manager', u: 5, s: 'Own estate · all' },
    { r: 'Asst. Estate Mgr', u: 5, s: 'Own estate · ops' },
    { r: 'Field Officer', u: 14, s: 'Division · ops' },
    { r: 'Field Supervisor', u: 42, s: 'Blocks · ops entry' },
    { r: 'Auditor (RW)', u: 3, s: 'Read-only · audit logs' },
    { r: 'IT Admin', u: 2, s: 'Config · users only' },
  ];

  perms = [
    ['Attendance', true, true, true, false, false],
    ['DPS', true, true, true, false, false],
    ['Collection', true, true, false, false, false],
    ['Workers', true, false, false, false, false],
    ['Assets', true, false, false, false, false],
    ['Inventory', true, true, false, false, false],
    ['Mazdoor', true, true, false, false, false],
    ['Payroll', false, false, false, false, false],
    ['Reports', true, false, false, false, false],
  ];

  ints = [
    { n: 'KSB Core Banking', d: 'NEFT batch upload · IFSC validation', st: 'on', last: '15 min ago' },
    { n: 'Rubber Board portal', d: 'Monthly production return', st: 'on', last: '5 d ago' },
    { n: 'GSTN', d: 'GSTR-1 · GSTR-3B filing', st: 'on', last: '24 d ago' },
    { n: 'PF · ESI gateway', d: 'ECR upload', st: 'on', last: '18 d ago' },
    { n: 'Kerala SSO (CDIT)', d: 'Single sign-on via Kerala Identity', st: 'on', last: 'live' },
    { n: 'eOffice', d: 'File / note routing', st: 'off', last: '—' },
    { n: 'SMS gateway', d: 'Worker payslip & alerts · BSNL', st: 'on', last: '2 min ago' },
    { n: 'Biometric (Mantra MFS100)', d: '42 devices across estates', st: 'on', last: 'live' },
    { n: 'Weather API · IMD', d: 'Rain-day auto-holiday', st: 'on', last: 'live' },
  ];

  sysHealth = [
    { s: 'API gateway', v: '99.98%', d: '30-day uptime' },
    { s: 'DB primary', v: '< 8 ms', d: 'avg query latency' },
    { s: 'DB replica · DR', v: 'live', d: 'lag 1.2 s' },
    { s: 'Object storage', v: '4.1 TB', d: 'of 10 TB used' },
    { s: 'Biometric svc', v: '42/42', d: 'devices online' },
    { s: 'Background jobs', v: 'queue 4', d: 'wage compute, sync' },
  ];
}
