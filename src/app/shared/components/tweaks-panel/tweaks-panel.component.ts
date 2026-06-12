import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-tweaks-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (config.tweaksOpen()) {
      <div class="twk-panel" [style.right.px]="offset.x" [style.bottom.px]="offset.y">
        <div class="twk-hd" (mousedown)="onDragStart($event)">
          <b>Tweaks</b>
          <button class="twk-x" aria-label="Close tweaks" (mousedown)="$event.stopPropagation()" (click)="config.toggleTweaks()">✕</button>
        </div>
        <div class="twk-body">
          <div class="twk-sect">Theme Options</div>
          
          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Theme</span></div>
            <select class="twk-field" [ngModel]="config.theme()" (ngModelChange)="config.setTweak('theme', $event)">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Accent</span></div>
            <select class="twk-field" [ngModel]="config.accent()" (ngModelChange)="config.setTweak('accent', $event)">
              <option value="clay">Clay</option>
              <option value="leaf">Leaf</option>
              <option value="amber">Amber</option>
              <option value="ocean">Ocean</option>
            </select>
          </div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Density</span></div>
            <select class="twk-field" [ngModel]="config.density()" (ngModelChange)="config.setTweak('density', $event)">
              <option value="compact">Compact</option>
              <option value="balanced">Balanced</option>
              <option value="comfy">Comfy</option>
            </select>
          </div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Language Mode</span></div>
            <select class="twk-field" [ngModel]="config.lang()" (ngModelChange)="config.setTweak('lang', $event)">
              <option value="en">English Only</option>
              <option value="ml">Malayalam Only</option>
              <option value="both">Bilingual</option>
            </select>
          </div>

          <div class="twk-sect">Variants</div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Dashboard</span></div>
            <select class="twk-field" [ngModel]="config.dashVariant()" (ngModelChange)="config.setTweak('dashVariant', $event)">
              <option value="A">Variant A</option>
              <option value="B">Variant B</option>
              <option value="C">Variant C</option>
            </select>
          </div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>DPS Entry</span></div>
            <select class="twk-field" [ngModel]="config.dpsVariant()" (ngModelChange)="config.setTweak('dpsVariant', $event)">
              <option value="A">Variant A</option>
              <option value="B">Variant B</option>
              <option value="C">Variant C</option>
            </select>
          </div>

          <div class="twk-row twk-row-h">
            <div class="twk-lbl"><span>Payslip</span></div>
            <select class="twk-field" [ngModel]="config.payslipVariant()" (ngModelChange)="config.setTweak('payslipVariant', $event)">
              <option value="A">Variant A</option>
              <option value="B">Variant B</option>
              <option value="C">Variant C</option>
            </select>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .twk-panel { position: fixed; right: 16px; bottom: 16px; z-index: 2147483646; width: 280px; max-height: calc(100vh - 32px); display: flex; flex-direction: column; background: rgba(250, 249, 247, .78); color: #29261b; -webkit-backdrop-filter: blur(24px) saturate(160%); backdrop-filter: blur(24px) saturate(160%); border: .5px solid rgba(255, 255, 255, .6); border-radius: 14px; box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 12px 40px rgba(0, 0, 0, .18); font: 11.5px/1.4 ui-sans-serif, system-ui, -apple-system, sans-serif; overflow: hidden; }
    .twk-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 8px 10px 14px; cursor: move; user-select: none; }
    .twk-hd b { font-size: 12px; font-weight: 600; letter-spacing: .01em; }
    .twk-x { appearance: none; border: 0; background: transparent; color: rgba(41, 38, 27, .55); width: 22px; height: 22px; border-radius: 6px; cursor: default; font-size: 13px; line-height: 1; }
    .twk-x:hover { background: rgba(0, 0, 0, .06); color: #29261b; }
    .twk-body { padding: 2px 14px 14px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; overflow-x: hidden; min-height: 0; scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, .15) transparent; }
    .twk-row { display: flex; flex-direction: column; gap: 5px; }
    .twk-row-h { flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; }
    .twk-lbl { display: flex; justify-content: space-between; align-items: baseline; color: rgba(41, 38, 27, .72); }
    .twk-lbl>span:first-child { font-weight: 500; }
    .twk-sect { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: rgba(41, 38, 27, .45); padding: 10px 0 0; }
    .twk-field { appearance: none; box-sizing: border-box; width: 100px; height: 26px; padding: 0 8px; border: .5px solid rgba(0, 0, 0, .1); border-radius: 7px; background: rgba(255, 255, 255, .6); color: inherit; font: inherit; outline: none; }
  `]
})
export class TweaksPanelComponent {
  offset = { x: 16, y: 16 };
  config = inject(AppConfigService);

  onDragStart(e: MouseEvent) {
    const sx = e.clientX;
    const sy = e.clientY;
    const startX = this.offset.x;
    const startY = this.offset.y;

    const move = (ev: MouseEvent) => {
      this.offset.x = Math.max(16, startX - (ev.clientX - sx));
      this.offset.y = Math.max(16, startY - (ev.clientY - sy));
    };

    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }
}
