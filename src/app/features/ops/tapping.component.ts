import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-tapping',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Tapping Schedule"
        ml="ടാപ്പിംഗ് ഷെഡ്യൂൾ"
        sub="D1–D4 rotation cycle · Kulathupuzha Estate · May 2026"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Recalculating D1–D4 rotation schedule for May 2026…')"><app-icon name="Refresh" [size]="13"></app-icon>Recalculate</button>
          <button class="btn ghost sm" (click)="onAction('Printing tapping roster for May 2026…')"><app-icon name="Print" [size]="13"></app-icon>Print roster</button>
          <button class="btn primary sm" (click)="showReassignModal.set(true)"><app-icon name="Plus" [size]="13"></app-icon>Reassign tapper</button>
        </ng-container>
      </app-page-head>

      <!-- Reassign Tapper Modal -->
      @if (showReassignModal()) {
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1100;">
          <div class="card bold" style="width: 400px; background: var(--surface); padding: 0;">
            <div class="card-head" style="justify-content: space-between;">
              <div class="ttl">Reassign Block Cycle</div>
              <button 
                class="icon-btn" 
                (click)="showReassignModal.set(false)" 
                style="border: none; background: transparent; cursor: pointer; display: flex; align-items: center;"
              >
                <app-icon name="X" [size]="16"></app-icon>
              </button>
            </div>
            <div class="card-body col" style="gap: 12px;">
              <div class="field">
                <label>Select Block</label>
                <select class="select" [(ngModel)]="reassignForm.block">
                  @for (b of allBlocks(); track b) {
                    <option>{{ b }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Target Cycle Day</label>
                <select class="select" [(ngModel)]="reassignForm.targetDay">
                  <option>D1</option>
                  <option>D2</option>
                  <option>D3</option>
                  <option>D4</option>
                </select>
              </div>
            </div>
            <div class="card-foot" style="justify-content: flex-end; gap: 8px;">
              <button class="btn ghost sm" (click)="showReassignModal.set(false)">Cancel</button>
              <button class="btn primary sm" (click)="handleReassignSubmit()">Reassign</button>
            </div>
          </div>
        </div>
      }

      <div class="grid g-4 mb-16">
        @for (c of schedule(); track c.day) {
          <div class="card bold" [style.border-top]="'4px solid var(--tap-' + c.day.toLowerCase() + ')'">
            <div class="card-head">
              <span class="cycle" [ngClass]="c.day.toLowerCase()">{{ c.day }}</span>
              <div class="ttl">{{ c.blocks.length }} blocks · {{ c.trees.toLocaleString() }} trees</div>
            </div>
            <div class="card-body col" style="gap: 6px; font-size: 12px;">
              @for (b of c.blocks; track b) {
                <div class="row gap-8"><app-icon name="Layers" [size]="11"></app-icon><span>{{ b }}</span></div>
              }
              <div class="muted mt-8" style="font-size: 11px;">Supervisors: {{ c.supervisors.join(', ') }}</div>
            </div>
          </div>
        }
      </div>

      <div class="card bold mb-16">
        <div class="card-head">
          <div class="ttl">Calendar · D1–D4 rotation for May</div>
          <div class="row gap-8" style="margin-left: auto;">
            <span class="chip"><span class="cycle d1">D1</span></span>
            <span class="chip"><span class="cycle d2">D2</span></span>
            <span class="chip"><span class="cycle d3">D3</span></span>
            <span class="chip"><span class="cycle d4">D4</span></span>
            <span class="chip">Rain holiday</span>
          </div>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
            @for (d of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; track d) {
              <div style="font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 8px;">{{ d }}</div>
            }
            @for (d of days; track d) {
              <div style="padding: 8px; border-radius: 4px; min-height: 72px; position: relative;"
                   [style.border]="d === 25 ? '2px solid var(--ink)' : 'var(--bd-soft)'"
                   [style.background]="d === 25 ? 'var(--accent-soft)' : 'var(--surface)'">
                <div class="row between">
                  <span class="mono" style="font-size: 11px; font-weight: 700;">{{ d.toString().padStart(2, '0') }} May</span>
                  @if (!isRainHoliday(d)) {
                    <span class="cycle" [ngClass]="getCycle(d)">{{ getCycle(d) | uppercase }}</span>
                  }
                </div>
                @if (isRainHoliday(d)) {
                  <div style="font-size: 10px; margin-top: 6px; color: var(--ink-3);">Rain holiday<br/>no tapping</div>
                } @else {
                  <div style="font-size: 10px; margin-top: 4px; color: var(--ink-3); font-family: var(--font-mono);">
                    {{ getCycleData(d)?.blocks?.length || 0 }} blocks<br/>{{ (getCycleData(d)?.trees || 0).toLocaleString() }} trees
                  </div>
                }
                @if (d === 25) {
                  <span class="badge solid" style="position: absolute; bottom: 6px; right: 6px; font-size: 9px; padding: 1px 4px;">TODAY</span>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">D1 assignments · today (active)</div></div>
        <table class="tbl">
          <thead>
            <tr><th>Block</th><th>Division</th><th class="num">Trees</th><th class="num">Tappers</th><th>Tapping Sup.</th><th>Start time</th><th>Expected dry</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td><b>KLP-B07</b> Kallarkutty B7</td><td>North</td><td class="num">14,250</td><td class="num">12</td><td>Vinod Raj</td><td class="mono">06:00</td><td class="mono">126 kg</td><td><span class="badge leaf">In progress</span></td></tr>
            <tr><td><b>KLP-B33</b> Vilakkupara B33</td><td>East</td><td class="num">10,840</td><td class="num">9</td><td>Vinod Raj</td><td class="mono">06:00</td><td class="mono">94 kg</td><td><span class="badge leaf">In progress</span></td></tr>
            <tr><td><b>KLP-B41</b> Aryankavu C</td><td>South</td><td class="num">7,520</td><td class="num">7</td><td>Reena Vijayan</td><td class="mono">06:00</td><td class="mono">68 kg</td><td><span class="badge leaf">In progress</span></td></tr>
            <tr><td><b>KLP-B45</b> Tenmala T3</td><td>Central</td><td class="num">5,810</td><td class="num">5</td><td>Reena Vijayan</td><td class="mono">06:30</td><td class="mono">52 kg</td><td><span class="badge amber">Delayed start</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TappingComponent {
  private dataService = inject(DataService);

  // Instead of direct persistent hook, we use standard signal logic
  // and sync with localStorage manually, similar to DataService.
  private _scheduleSig: any;
  private _setSchedule: any;

  schedule = computed(() => this._scheduleSig());

  days = Array.from({length: 28}, (_, i) => i + 1);

  showReassignModal = signal(false);
  reassignForm = { block: 'Kallarkutty B7', targetDay: 'D2' };

  constructor() {
    const defaultCycle = this.dataService.tappingCycle;
    const [sig, setter] = this.dataService.createPersistentSignal('aptivora.tappingCycle', defaultCycle);
    this._scheduleSig = sig;
    this._setSchedule = setter;
  }

  allBlocks = computed(() => {
    const set = new Set<string>();
    this.schedule().forEach((s: any) => s.blocks.forEach((b: string) => set.add(b)));
    return Array.from(set).sort();
  });

  isRainHoliday(d: number) {
    return d === 18 || d === 12;
  }

  getCycle(d: number) {
    return ['d1','d2','d3','d4'][(d-1) % 4];
  }

  getCycleData(d: number) {
    const idx = (d-1) % 4;
    return this.schedule()[idx];
  }

  handleReassignSubmit() {
    const updated = this.schedule().map((dayObj: any) => {
      let blocks = dayObj.blocks.filter((b: string) => b !== this.reassignForm.block);
      
      if (dayObj.day === this.reassignForm.targetDay) {
        if (!blocks.includes(this.reassignForm.block)) {
          blocks = [...blocks, this.reassignForm.block];
        }
      }
      
      const trees = blocks.length * 9500;
      return { ...dayObj, blocks, trees };
    });

    this._setSchedule(updated);
    this.showReassignModal.set(false);
    alert(`Block "${this.reassignForm.block}" reassigned to ${this.reassignForm.targetDay} cycle successfully!`);
  }

  onAction(msg: string) {
    alert(msg);
  }
}
