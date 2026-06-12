import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SfckMarkComponent } from '../../shared/components/icon/sfck-mark.component';

@Component({
  selector: 'app-phone-frame',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="width: 340px; flex: none;">
      <div style="width: 340px; height: 680px; border-radius: 36px; border: 10px solid #111; background: var(--bg); box-shadow: 0 6px 0 #000; position: relative; overflow: hidden;">
        <div style="height: 28px; background: var(--ink); color: var(--bg); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; font-size: 11px; font-family: var(--font-mono);">
          <span>06:42</span>
          <span>· · ·</span>
          <span>4G  92%</span>
        </div>
        <div style="height: calc(100% - 28px); overflow: hidden; display: flex; flex-direction: column;">
          <ng-content></ng-content>
        </div>
      </div>
      <div style="text-align: center; margin-top: 14px; font-weight: 700; font-size: 13px;">{{ label }}</div>
    </div>
  `
})
export class PhoneFrameComponent {
  @Input() label = '';
}
import { Input } from '@angular/core';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, IconComponent, SfckMarkComponent, PhoneFrameComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Field App"
        ml="ഫീൽഡ് ആപ്പ്"
        sub="Mobile screens for Field Supervisors & Tapping Supervisors · Android / iOS · offline-first"
      ></app-page-head>

      <div class="row" style="gap: 32px; flex-wrap: wrap; justify-content: center;">
        <!-- Phone 1 — Home -->
        <app-phone-frame label="Supervisor home">
          <div style="padding: 14px 16px; border-bottom: var(--bd-soft);">
            <div class="row gap-8">
              <app-sfck-mark [size]="22"></app-sfck-mark>
              <div>
                <div style="font-size: 11px; color: var(--ink-3); font-weight: 700;">SFCK · FIELD</div>
                <div style="font-size: 13px; font-weight: 700;">R. Vijayan · KLP-B07</div>
              </div>
            </div>
          </div>
          <div style="padding: 16px; background: var(--ink); color: var(--bg);">
            <div style="font-size: 10px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">D1 cycle · today</div>
            <div class="mono" style="font-size: 30px; font-weight: 800;">12 tappers</div>
            <div style="font-size: 11px; color: var(--bg-3);">Block KLP-B07 Kallarkutty B7 · 14,250 trees</div>
            <div class="grid g-3 mt-16" style="gap: 8px;">
              <div><div style="font-size: 9px; color: var(--bg-3);">PRESENT</div><b class="mono" style="font-size: 18px;">11</b></div>
              <div><div style="font-size: 9px; color: var(--bg-3);">DPS DONE</div><b class="mono" style="font-size: 18px;">9</b></div>
              <div><div style="font-size: 9px; color: var(--bg-3);">PENDING</div><b class="mono" style="font-size: 18px; color: var(--accent-hi);">3</b></div>
            </div>
          </div>
          <div style="padding: 12px 16px; flex: 1; overflow-y: auto;">
            <div style="font-size: 10px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Quick actions</div>
            <div class="grid g-2" style="gap: 8px;">
              @for (a of quickActions; track a.l) {
                <button class="btn" style="justify-content: center; padding: 14px 8px; flex-direction: column; gap: 8px; font-size: 11px;">
                  <app-icon [name]="a.i" [size]="18"></app-icon>{{ a.l }}
                </button>
              }
            </div>
            <div style="font-size: 10px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; margin-top: 16px; margin-bottom: 8px;">To-do</div>
            @for (r of todos; track r.t; let i = $index) {
              <div class="row gap-8" [style.border-top]="i ? 'var(--bd-soft)' : 'none'" style="padding: 8px 0;">
                <span class="dot" [ngClass]="r.col" style="margin-top: 5px;"></span>
                <div>
                  <div style="font-size: 12px; font-weight: 600;">{{ r.t }}</div>
                  <div class="muted" style="font-size: 10px;">{{ r.s }}</div>
                </div>
              </div>
            }
          </div>
        </app-phone-frame>

        <!-- Phone 2 — Muster mark -->
        <app-phone-frame label="Quick muster">
          <div style="padding: 14px 16px; border-bottom: var(--bd-soft); background: var(--ink); color: var(--bg);">
            <div style="font-size: 10px; color: var(--bg-3); letter-spacing: 0.1em; font-weight: 700;">MUSTER · 25 MAY · D1</div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">KLP-B07 Kallarkutty B7</div>
          </div>
          <div style="padding: 10px 16px; flex: 1; overflow-y: auto;">
            <div class="input-group" style="margin-bottom: 10px;">
              <input class="input mono" placeholder="Scan / type EMP-…" />
              <span class="addon"><app-icon name="Fingerprint" [size]="14"></app-icon></span>
            </div>
            @for (w of musterWorkers; track w.e) {
              <div class="row gap-8" style="padding: 10px 0; border-bottom: var(--bd-soft);">
                <div class="avatar" style="width: 28px; height: 28px; font-size: 11px; background: var(--bg-3); color: var(--ink);">
                  {{ getInitials(w.n) }}
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 600;">{{ w.n }}</div>
                  <div class="muted mono" style="font-size: 10px;">{{ w.e }}</div>
                </div>
                <div class="row gap-8">
                  @for (k of ['P', 'A', 'L']; track k) {
                    <button [style.border]="w.s === k ? ('2px solid var(--' + (w.c === 'mute' ? 'ink-3' : w.c) + ')') : 'var(--bd-soft)'"
                            [style.background]="w.s === k ? ('var(--' + (w.c === 'mute' ? 'bg-3' : w.c + '-soft') + ')') : 'var(--surface)'"
                            [style.color]="w.s === k ? ('var(--' + (w.c === 'mute' ? 'ink' : w.c) + ')') : 'var(--ink)'"
                            style="width: 30px; height: 30px; border-radius: 4px; font-weight: 700; font-size: 13px; display: grid; place-items: center; padding: 0;">
                      {{ k }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </app-phone-frame>

        <!-- Phone 3 — DPS Entry -->
        <app-phone-frame label="DPS Entry">
          <div style="padding: 14px 16px; border-bottom: var(--bd-soft); background: var(--ink); color: var(--bg);">
            <div class="row between">
              <div style="font-size: 10px; color: var(--bg-3); letter-spacing: 0.1em; font-weight: 700;">DPS ENTRY</div>
              <div style="font-size: 10px; color: var(--bg-3); font-weight: 700;">10 of 12</div>
            </div>
            <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">Rajan Pillai</div>
          </div>
          <div style="padding: 16px; flex: 1; overflow-y: auto;">
            <div class="field"><label>Trees tapped</label><input class="input mono" [value]="'380'" style="font-size: 18px;" /></div>
            <div class="field mt-16"><label>Latex wt (kg)</label><input class="input mono" [value]="'32.4'" style="font-size: 18px;" /></div>
            <div class="row gap-8 mt-16">
              <div class="field grow"><label>DRC %</label><input class="input mono" [value]="'33.8'" style="font-size: 18px;" /></div>
              <div class="field grow"><label>Scrap kg</label><input class="input mono" [value]="'3.1'" style="font-size: 18px;" /></div>
            </div>

            <div class="mt-16" style="padding: 12px; background: var(--accent-soft); border-radius: 6px;">
              <div style="font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">Auto-calculated today's earnings</div>
              <div class="mono" style="font-size: 26px; font-weight: 800; color: var(--accent);">₹ 914</div>
              <div class="muted" style="font-size: 11px;">10.95 kg dry · +4.3% above base</div>
            </div>

            <button class="btn primary lg mt-16" style="width: 100%; justify-content: center;">
              <app-icon name="Check" [size]="14"></app-icon> Submit & next tapper
            </button>
            <button class="btn ghost sm mt-8" style="width: 100%; justify-content: center;">
              <app-icon name="Refresh" [size]="12"></app-icon> Save offline · sync later
            </button>
            <div class="muted mt-16" style="font-size: 10px; text-align: center;">2 entries queued · will sync when online</div>
          </div>
        </app-phone-frame>

        <!-- Phone 4 — Worker self-service -->
        <app-phone-frame label="Worker view">
          <div style="padding: 14px 16px; background: var(--accent); color: var(--accent-ink);">
            <div class="row gap-8">
              <div class="avatar" style="background: var(--accent-ink); color: var(--accent); width: 36px; height: 36px; font-size: 13px;">RP</div>
              <div>
                <div class="ml" style="font-weight: 700; font-size: 15px;">രാജൻ പിള്ള</div>
                <div style="font-size: 11px;">EMP-1042 · Tapper</div>
              </div>
            </div>
            <div class="mt-16">
              <div style="font-size: 10px; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">NET PAY · this cycle</div>
              <div class="mono" style="font-size: 30px; font-weight: 800;">₹24,532</div>
              <div style="font-size: 11px;">NEFT · 31 May 2026</div>
            </div>
          </div>
          <div style="padding: 12px 16px;">
            <div style="font-size: 10px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">This cycle so far</div>
            <div class="grid g-3 mt-8" style="gap: 8px;">
              <div><div class="muted" style="font-size: 10px;">Days</div><b class="mono" style="font-size: 16px;">24</b></div>
              <div><div class="muted" style="font-size: 10px;">Dry kg</div><b class="mono" style="font-size: 16px;">284</b></div>
              <div><div class="muted" style="font-size: 10px;">Δ Base</div><b class="mono" style="font-size: 16px; color: var(--leaf);">+6%</b></div>
            </div>
          </div>
          <div style="padding: 4px 16px; flex: 1; overflow-y: auto;">
            <div style="font-size: 10px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Last 6 days</div>
            @for (r of lastDays; track r.d) {
              <div class="row between" style="padding: 8px 0; border-bottom: var(--bd-soft);">
                <div>
                  <div style="font-size: 13px; font-weight: 600;">{{ r.d }}</div>
                  <div class="muted" style="font-size: 10px;">{{ r.st === 'verified' ? 'verified' : 'pending verification' }}</div>
                </div>
                <div class="row gap-8">
                  <b class="mono">{{ r.y }} kg</b>
                  @if (r.st === 'verified') {
                    <app-icon name="Check" [size]="14" stroke="var(--leaf)"></app-icon>
                  } @else {
                    <app-icon name="Clock" [size]="14" stroke="var(--amber)"></app-icon>
                  }
                </div>
              </div>
            }
          </div>
          <div style="padding: 12px 16px; background: var(--bg-2); text-align: center;">
            <button class="btn ghost sm"><app-icon name="Download" [size]="12"></app-icon> Download payslip (PDF)</button>
          </div>
        </app-phone-frame>
      </div>

      <div class="card bold mt-24">
        <div class="card-head"><div class="ttl">Field app highlights</div></div>
        <div class="card-body grid g-4" style="gap: 16px; font-size: 12px;">
          <div><b>Offline-first</b><div class="muted">Queue muster + DPS in local SQLite, auto-sync when 4G returns.</div></div>
          <div><b>Biometric</b><div class="muted">Mantra MFS100 USB or in-built fingerprint for tapper attendance.</div></div>
          <div><b>Low-bandwidth</b><div class="muted">3–6 kB per sync request · works at edge of 2G/3G zones.</div></div>
          <div><b>Bilingual</b><div class="muted">Switch UI to Malayalam from header. Payslip available in either.</div></div>
        </div>
      </div>
    </div>
  `
})
export class FieldComponent {
  quickActions = [
    { l: 'Mark muster', i: 'Clock' },
    { l: 'Add DPS', i: 'Droplet' },
    { l: 'CC intake', i: 'Truck' },
    { l: 'Issue stock', i: 'Boxes' },
  ];

  todos = [
    { t: 'Verify 3 DPS entries · B07', s: 'V. Raj submitted 09:32', col: 'amber' },
    { t: 'Approve EST-1042 mandays', s: '+12 mandays requested', col: 'clay' },
    { t: 'Latex sample · CC-Main', s: 'Saritha B-004 retest', col: 'oxide' },
  ];

  musterWorkers = [
    { n: 'Rajan Pillai', e: 'EMP-1042', s: 'P', c: 'leaf' },
    { n: 'Lekha Devi', e: 'EMP-1158', s: 'P', c: 'leaf' },
    { n: 'Sasi Kumar', e: 'EMP-1209', s: 'P', c: 'leaf' },
    { n: 'Suresh Babu', e: 'EMP-1311', s: 'A', c: 'oxide' },
    { n: 'Mini Joseph', e: 'EMP-1402', s: 'P', c: 'leaf' },
    { n: 'Anil Kumar', e: 'EMP-1505', s: 'L', c: 'amber' },
    { n: 'Geetha Mohan', e: 'EMP-1617', s: 'P', c: 'leaf' },
    { n: 'Saritha Anand', e: 'EMP-2055', s: '?', c: 'mute' },
  ];

  lastDays = [
    { d: '25 May', y: 10.95, st: 'pending' },
    { d: '24 May', y: 11.30, st: 'verified' },
    { d: '23 May', y: 12.40, st: 'verified' },
    { d: '22 May', y: 11.80, st: 'verified' },
    { d: '21 May', y: 10.60, st: 'verified' },
    { d: '20 May', y: 11.30, st: 'verified' },
  ];

  getInitials(n: string) {
    return n.split(' ').map(x => x[0]).join('');
  }
}
