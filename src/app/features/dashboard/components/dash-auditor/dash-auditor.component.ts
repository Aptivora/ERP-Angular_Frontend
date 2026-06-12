import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dash-auditor',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="card bold mb-16" style="border-left: 4px solid var(--amber); background: var(--amber-soft);">
      <div class="card-body row" style="padding: 14px 18px; gap: 14px;">
        <app-icon name="Eye" [size]="20"></app-icon>
        <div>
          <b>Read-only audit session · CA Suja Krishnan</b>
          <div class="muted" style="font-size: 12px;">All your activity is logged. Period under review: 01-Apr-2026 to 25-May-2026. Engagement ref: SFCK/AUD/26-27/04</div>
        </div>
        <div style="margin-left: auto;" class="row gap-8">
          <span class="badge amber">42 days remaining</span>
        </div>
      </div>
    </div>

    <div class="grid g-4 mb-16">
      <div class="kpi"><div class="label">Records under review</div><div class="value">38,412</div><div class="delta">attendance + DPS + payroll</div></div>
      <div class="kpi"><div class="label">Findings raised</div><div class="value">14</div><div class="delta">9 minor · 4 moderate · 1 major</div></div>
      <div class="kpi"><div class="label">Open queries</div><div class="value">8</div><div class="delta">awaiting EM response</div></div>
      <div class="kpi"><div class="label">Compliance score</div><div class="value">94<span class="unit">/100</span></div><div class="delta up">▲ from 88 last audit</div></div>
    </div>

    <div class="grid mb-16" style="grid-template-columns: 1.2fr 1fr;">
      <div class="card bold">
        <div class="card-head"><div class="ttl">Compliance checklist · FY26 Q1</div></div>
        <table class="tbl">
          <thead>
            <tr><th>Area</th><th>Statute</th><th>Status</th><th>Evidence</th><th>Last verified</th></tr>
          </thead>
          <tbody>
            @for (r of checklist; track r.a) {
              <tr>
                <td><b>{{ r.a }}</b></td>
                <td class="muted" style="font-size: 12px;">{{ r.s }}</td>
                <td><span class="badge" [ngClass]="r.st">{{ r.sl }}</span></td>
                <td class="muted" style="font-size: 12px;">{{ r.e }}</td>
                <td class="mono" style="font-size: 12px;">{{ r.d }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">Findings raised</div></div>
        <div class="card-body col" style="gap: 12px; font-size: 12px;">
          @for (f of findings; track f.t; let i = $index) {
            <div class="row gap-8" style="align-items: flex-start; padding-bottom: 8px;" [style.border-bottom]="i < 5 ? 'var(--bd-soft)' : 'none'">
              <span class="badge" [ngClass]="getBadgeColor(f.sev)">{{ f.sev | uppercase }}</span>
              <div style="flex: 1;">
                <div style="font-weight: 700;">{{ f.t }}</div>
                <div class="muted">{{ f.s }}</div>
                <div class="muted" style="font-size: 11px; margin-top: 2px;">Owner: {{ f.who }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <div class="card bold">
      <div class="card-head"><div class="ttl">Recent audit log (read-only)</div><span class="muted" style="margin-left: auto; font-size: 11px;">Last 24 hours · 384 events</span></div>
      <table class="tbl">
        <thead>
          <tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Module</th><th>Reference</th><th>Result</th></tr>
        </thead>
        <tbody>
          @for (l of auditLog; track l.ts) {
            <tr>
              <td class="mono" style="font-size: 11px;">{{ l.ts }}</td>
              <td>{{ l.u }}</td>
              <td>{{ l.a }}</td>
              <td><span class="chip">{{ l.m }}</span></td>
              <td class="mono" style="font-size: 12px;">{{ l.r }}</td>
              <td><span class="badge" [ngClass]="l.s">{{ l.sl }}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class DashAuditorComponent {
  checklist = [
    {a:'PF · ESI remittance',          s:'EPF & MP Act 1952',           st:'leaf',  sl:'Compliant',  e:'18 challans', d:'18-May-26'},
    {a:'Minimum wages · DA',           s:'Min. Wages Act 1948',         st:'leaf',  sl:'Compliant',  e:'GO 412 applied', d:'29-Apr-26'},
    {a:'Plantation labour registers',  s:'Plantation Labour Act 1951',  st:'leaf',  sl:'Compliant',  e:'Forms A, B, C', d:'20-May-26'},
    {a:'Welfare fund',                 s:'KMW Fund Act',                st:'leaf',  sl:'Compliant',  e:'₹80 × 1623',   d:'18-May-26'},
    {a:'GST returns',                  s:'CGST Act 2017',               st:'amber', sl:'Due 24-May', e:'GSTR-3B draft', d:'pending'},
    {a:'Rubber Board production rtn.', s:'Rubber Act 1947',             st:'oxide', sl:'Overdue',    e:'Apr pending',  d:'30-Apr-26'},
    {a:'Income Tax · TDS quarterly',   s:'IT Act 1961',                 st:'leaf',  sl:'Compliant',  e:'24Q filed',     d:'15-Apr-26'},
    {a:'Annual return · ROC',          s:'Companies Act 2013',          st:'leaf',  sl:'Compliant',  e:'MGT-7',         d:'30-Sep-25'},
  ];

  findings = [
    {sev:'major', t:'Rubber Board April return overdue', s:'Production return not filed for April 2026', who:'Estate Manager'},
    {sev:'mod',   t:'GSTR-3B draft has discrepancy',     s:'ITC mismatch of ₹14,820 vs 2A',          who:'Finance'},
    {sev:'mod',   t:'5 muster sheets unsigned',          s:'KLP-B19 · 18, 19, 22, 23, 24 May',       who:'Field Officer'},
    {sev:'mod',   t:'DA hike not applied to 4 workers',  s:'EMP-1311, 1721, 2055, 1944',             who:'Payroll'},
    {sev:'minor', t:'Audit log gap',                     s:'08-Apr 14:20–14:42 (planned maintenance)',who:'System'},
    {sev:'minor', t:'Late biometric sync · 12 instances',s:'Mostly Mar-Apr · field connectivity',   who:'Field Officer'},
  ];

  auditLog = [
    {ts:'25 May · 09:41:12', u:'P. Suresh Kumar', a:'Approved DPS batch (9)', m:'DPS', r:'DPS-9201/D1', s:'leaf', sl:'OK'},
    {ts:'25 May · 09:32:48', u:'V. Raj',          a:'Verified entry',         m:'DPS', r:'EMP-1042/25-May', s:'leaf', sl:'OK'},
    {ts:'25 May · 09:18:01', u:'Reena Vijayan',   a:'Marked absent',          m:'Attendance', r:'EMP-1311', s:'leaf', sl:'OK'},
    {ts:'25 May · 08:42:08', u:'admin',           a:'Updated DA rate',        m:'Payroll Cfg', r:'GO 412/2026', s:'amber', sl:'Privileged'},
    {ts:'25 May · 07:18:12', u:'unknown',         a:'Failed login (4×)',      m:'Auth', r:'EMP-1944', s:'oxide', sl:'Locked 5 min'},
    {ts:'25 May · 02:00:00', u:'system (cron)',   a:'Auto wage computation',  m:'Payroll', r:'CYC-202605', s:'leaf', sl:'OK'},
  ];

  getBadgeColor(sev: string) {
    return sev === 'major' ? 'oxide' : (sev === 'mod' ? 'amber' : 'mute');
  }
}
