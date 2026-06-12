import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RolesService } from '../../../core/services/roles.service';
import { SfckMarkComponent } from '../../../shared/components/icon/sfck-mark.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, SfckMarkComponent, IconComponent],
  template: `
    <div class="login-layout">
      <!-- Left: hero -->
      <div class="login-hero">
        <div class="row gap-16">
          <app-sfck-mark [size]="40"></app-sfck-mark>
          <div>
            <div style="font-weight: 800; font-size: 22px; letter-spacing: -0.02em;">SFCK</div>
            <div style="font-size: 11px; color: var(--bg-3); letter-spacing: 0.16em; text-transform: uppercase;">Estate Operations</div>
          </div>
        </div>

        <div class="hero-content">
          <div class="hero-title">
            From the tap-cut<br/>to the wage slip,<br/><span style="color: var(--accent-hi);">in one system.</span>
          </div>
          <div style="font-size: 14px; color: var(--bg-3); max-width: 480px; margin-top: 16px; line-height: 1.5;">
            Attendance, daily production, complex pay-roll automation, asset & inventory management — built for the field divisions of SFCK estates.
          </div>
          <div class="row gap-24 mt-24" style="flex-wrap: wrap;">
            @for (k of highlights; track k.l) {
              <div>
                <div class="mono" style="font-size: 28px; font-weight: 800;">{{ k.v }}</div>
                <div style="font-size: 11px; color: var(--bg-3); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">{{ k.l }}</div>
                <div style="font-size: 11px; color: var(--ink-mute); margin-top: 2px;">{{ k.s }}</div>
              </div>
            }
          </div>
        </div>

        <div class="hero-footer row gap-16">
          <span>v2.4.1 · MAY 2026</span>
          <span class="dot-sep">·</span>
          <span>STQC certified</span>
          <span class="dot-sep">·</span>
          <span>Hosted on Kerala State Data Centre</span>
          <span style="margin-left: auto;">support&#64;sfck.in</span>
        </div>

        <!-- decorative spiral -->
        <svg class="hero-spiral" width="420" height="420" viewBox="0 0 200 200" fill="none">
          <path d="M 100 30 Q 100 110 50 110 Q 10 110 10 80 Q 10 60 30 60 Q 50 60 50 80" stroke="white" stroke-width="6" fill="none"/>
          <circle cx="50" cy="80" r="6" fill="white"/>
        </svg>
      </div>

      <!-- Right: form -->
      <div class="login-form">
        <div style="max-width: 520px; width: 100%; margin: 0 auto;">
          <div class="muted up" style="font-size: 11px; letter-spacing: 0.16em; font-weight: 700;">Sign in to SFCK</div>
          <div style="font-size: 32px; font-weight: 800; margin-top: 6px; letter-spacing: -0.02em;">Welcome back</div>
          <div class="ml muted" style="font-size: 14px; margin-top: 2px;">തിരികെ സ്വാഗതം</div>

          <!-- Role chooser -->
          <div class="field mt-24">
            <label>I am signing in as</label>

            <div style="font-size: 10px; font-weight: 700; color: var(--ink-3); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 8px; margin-bottom: 6px;">Estate Operations · field & office hierarchy</div>
            <div class="grid g-3" style="gap: 6px; grid-template-columns: repeat(3, 1fr);">
              @for (r of opsRoles; track r.id) {
                <button (click)="role = r.id"
                  [style.border]="role === r.id ? '2px solid var(--ink)' : 'var(--bd-soft)'"
                  [style.background]="role === r.id ? 'var(--accent-soft)' : 'var(--surface)'"
                  style="padding: 10px 6px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; display: flex; flex-direction: column; gap: 6px; align-items: center; text-align: center; line-height: 1.15; min-height: 62px;">
                  <app-icon [name]="r.i" [size]="16"></app-icon>
                  {{ r.t }}
                </button>
              }
            </div>

            <div style="font-size: 10px; font-weight: 700; color: var(--ink-3); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 12px; margin-bottom: 6px;">Admin & Compliance</div>
            <div class="grid" style="gap: 6px; grid-template-columns: repeat(2, 1fr);">
              @for (r of adminRoles; track r.id) {
                <button (click)="role = r.id"
                  [style.border]="role === r.id ? '2px solid var(--ink)' : 'var(--bd-soft)'"
                  [style.background]="role === r.id ? 'var(--accent-soft)' : 'var(--surface)'"
                  style="padding: 10px 6px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; display: flex; flex-direction: column; gap: 6px; align-items: center; min-height: 62px;">
                  <app-icon [name]="r.i" [size]="16"></app-icon>
                  {{ r.t }}
                </button>
              }
            </div>

            <div style="padding: 10px 12px; background: var(--bg-2); border-radius: 4px; margin-top: 10px; font-size: 12px; display: flex; gap: 10px; align-items: center;">
              <app-icon name="Lock" [size]="13"></app-icon>
              <div style="flex: 1;">
                <b>{{ getRoleObj(role).name }}</b> · {{ getRoleObj(role).title }}<br/>
                <span class="muted" style="font-size: 11px;">Access scope: {{ getRoleObj(role).scope }}</span>
              </div>
            </div>
          </div>

          @if (step === 'credentials') {
            <div class="field mt-16">
              <label>Employee ID</label>
              <div class="input-group">
                <input class="input mono" [value]="getRoleObj(role).empId" readonly />
                <span class="addon">&#64;sfck.in</span>
              </div>
            </div>
            <div class="field mt-16">
              <label>Password</label>
              <div class="input-group">
                <input class="input" type="password" value="••••••••••" readonly />
                <span class="addon"><app-icon name="Eye" [size]="14"></app-icon></span>
              </div>
              <div class="row between mt-8">
                <label style="font-size: 11px; text-transform: none; letter-spacing: 0; color: var(--ink-3); font-weight: 500;">
                  <input type="checkbox" checked /> Keep me signed in (this device)
                </label>
                <a style="font-size: 11px; color: var(--accent); font-weight: 600; cursor: pointer;">Forgot password?</a>
              </div>
            </div>
            <button class="btn primary lg mt-24" style="width: 100%; justify-content: center;" (click)="step = 'otp'">
              Continue <app-icon name="ArrowR" [size]="14"></app-icon>
            </button>
            <div class="row gap-16 mt-16" style="align-items: center;">
              <div style="flex: 1; height: 1px; background: var(--rule-soft);"></div>
              <span class="muted" style="font-size: 11px; font-weight: 600;">OR</span>
              <div style="flex: 1; height: 1px; background: var(--rule-soft);"></div>
            </div>
            <button class="btn lg mt-16" style="width: 100%; justify-content: center;"><app-icon name="Fingerprint" [size]="14"></app-icon> Biometric sign-in</button>
            <button class="btn ghost lg mt-8" style="width: 100%; justify-content: center;"><app-icon name="Lock" [size]="14"></app-icon> Use Kerala SSO (CDIT)</button>
          } @else {
            <div style="padding: 14px; background: var(--bg-2); border-radius: 6px; margin-top: 24px; font-size: 13px;">
              Signing in as <b>{{ getRoleObj(role).name }}</b> · {{ getRoleObj(role).title }}.<br/>
              We've sent a 6-digit code to <b>+91 98••• {{ getPhoneTail(getRoleObj(role).avatar) }}</b> and your registered email.
            </div>
            <div class="field mt-16">
              <label>OTP code</label>
              <div class="row gap-8">
                @for (d of ['7','3','9','0','0','0']; track $index) {
                  <input class="input mono" [value]="d" style="text-align: center; font-size: 22px; font-weight: 700; width: 50px; height: 54px;" readonly />
                }
              </div>
              <div class="muted mt-8" style="font-size: 11px;">
                Resend in 0:42 · <a style="color: var(--accent); font-weight: 600; cursor: pointer;">Use authenticator app</a>
              </div>
            </div>
            <button class="btn primary lg mt-24" style="width: 100%; justify-content: center;" (click)="onLogin()">
              Verify & enter SFCK <app-icon name="ArrowR" [size]="14"></app-icon>
            </button>
            <button class="btn ghost sm mt-8" style="width: 100%; justify-content: center;" (click)="step = 'credentials'">← Back</button>
          }

          <div class="mt-24" style="padding: 12px; border: 1.5px solid var(--rule-soft); border-radius: 6px; font-size: 11px; color: var(--ink-3);">
            <b class="hl-clay">⚠ Notice</b> · This is a secured Government of Kerala system. Unauthorised access is punishable under the Information Technology Act, 2000.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-layout {
      display: grid;
      grid-template-columns: 1fr 1.05fr;
      height: 100vh;
    }
    .login-hero {
      background: var(--ink);
      color: var(--bg);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .hero-content {
      position: relative;
      z-index: 1;
    }
    .hero-title {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
    }
    .hero-footer {
      font-size: 11px;
      color: var(--bg-3);
    }
    .hero-spiral {
      position: absolute;
      right: -120px;
      bottom: -80px;
      opacity: 0.08;
    }
    .login-form {
      background: var(--bg);
      padding: 48px 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: auto;
    }

    @media (max-width: 992px) {
      .login-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        height: auto;
        min-height: 100vh;
      }
      .login-hero {
        padding: 32px 24px;
        min-height: 380px;
      }
      .hero-title {
        font-size: 36px;
      }
      .hero-footer {
        flex-wrap: wrap;
        gap: 8px !important;
      }
      .hero-footer .dot-sep {
        display: none;
      }
      .hero-footer > span {
        display: block;
        width: 100%;
      }
      .hero-spiral {
        right: -80px;
        bottom: -40px;
        width: 240px;
        height: 240px;
      }
      .login-form {
        padding: 32px 24px;
      }
    }
  `]
})
export class LoginComponent {
  role = 'estate-mgr';
  step = 'credentials';

  private rolesService = inject(RolesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  highlights = [
    { l: 'Estates', v: '5', s: 'on the system' },
    { l: 'Workers', v: '1,623', s: 'across 144 blocks' },
    { l: 'Tap cycles', v: 'D1–D4', s: 'auto-rotated daily' },
    { l: 'Languages', v: 'EN · ML', s: 'bilingual UI' },
  ];

  opsRoles = [
    { id: 'md', t: 'Managing Director', i: 'Shield' },
    { id: 'gm', t: 'General Manager', i: 'Shield' },
    { id: 'estate-mgr', t: 'Estate Manager', i: 'Building' },
    { id: 'asst-estate-mgr', t: 'Asst. Estate Mgr.', i: 'Building' },
    { id: 'field-off', t: 'Field Officer', i: 'Pin' },
    { id: 'supervisor', t: 'Field Supervisor', i: 'Map' },
    { id: 'tapping-sup', t: 'Tapping Supervisor', i: 'Cycle' },
    { id: 'cc-worker', t: 'Collection Centre', i: 'Truck' },
    { id: 'worker', t: 'Worker (Tap/Gen)', i: 'Droplet' },
  ];

  adminRoles = [
    { id: 'admin', t: 'IT Administrator', i: 'Settings' },
    { id: 'auditor', t: 'External Auditor', i: 'Eye' },
  ];

  isSubmitting = false;

  getRoleObj(id: string): any {
    return this.rolesService.getRole(id as any);
  }

  handleRoleClick(id: string) {
    if (this.isSubmitting) return;
    this.role = id;
  }

  onLogin() {
    this.isSubmitting = true;
    this.authService.login(this.role as any);
    
    // Simulate slight delay to match React app
    setTimeout(() => {
      const home = this.getRoleObj(this.role).defaultRoute;
      this.router.navigate([`/${home}`]);
    }, 400);
  }

  getPhoneTail(avatar: string) {
    return ('' + avatar.charCodeAt(0)).slice(-3) + '12';
  }
}
