import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-tapping',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, BiComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Tapping Schedule"
        ml="ടാപ്പിംഗ് ഷെഡ്യൂൾ"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="tap_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Recalculating D1—D4 rotation schedule for May 2026…')"><app-icon name="Refresh" [size]="13"></app-icon><app-bi k="recalculate"></app-bi></button>
          <button class="btn ghost sm" (click)="printPage()"><app-icon name="Print" [size]="13"></app-icon><app-bi k="print_roster"></app-bi></button>
          <button class="btn primary sm" (click)="showReassignModal.set(true)"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="reassign_tapper"></app-bi></button>
        </ng-container>
      </app-page-head>

      <!-- Reassign Tapper Modal -->
      @if (showReassignModal()) {
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1100;">
          <div class="card bold" style="width: 400px; background: var(--surface); padding: 0;">
            <div class="card-head" style="justify-content: space-between;">
              <div class="ttl"><app-bi k="reassign_modal"></app-bi></div>
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
                <label><app-bi k="select_block"></app-bi></label>
                <select class="select" [(ngModel)]="reassignForm.block">
                  @for (b of allBlocks(); track b) {
                    <option>{{ b }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label><app-bi k="target_cycle"></app-bi></label>
                <select class="select" [(ngModel)]="reassignForm.targetDay">
                  <option>D1</option>
                  <option>D2</option>
                  <option>D3</option>
                  <option>D4</option>
                </select>
              </div>
            </div>
            <div class="card-foot" style="justify-content: flex-end; gap: 8px;">
              <button class="btn ghost sm" (click)="showReassignModal.set(false)"><app-bi k="cancel"></app-bi></button>
              <button class="btn primary sm" (click)="handleReassignSubmit()"><app-bi k="reassign"></app-bi></button>
            </div>
          </div>
        </div>
      }

      <div class="grid g-4 mb-16">
        @for (c of schedule(); track c.day) {
          <div class="card bold" [style.border-top]="'4px solid var(--tap-' + c.day.toLowerCase() + ')'">
            <div class="card-head">
              <span class="cycle" [ngClass]="c.day.toLowerCase()">{{ c.day }}</span>
              <div class="ttl">{{ c.blocks.length }} <app-bi k="blocks_sm"></app-bi> · {{ c.trees.toLocaleString() }} <app-bi k="trees_sm"></app-bi></div>
            </div>
            <div class="card-body col" style="gap: 6px; font-size: 12px;">
              @for (b of c.blocks; track b) {
                <div class="row gap-8"><app-icon name="Layers" [size]="11"></app-icon><span>{{ b }}</span></div>
              }
              <div class="muted mt-8" style="font-size: 11px;"><app-bi k="supervisors"></app-bi> {{ c.supervisors.join(', ') }}</div>
            </div>
          </div>
        }
      </div>

      <div class="card bold mb-16">
        <div class="card-head">
          <div class="ttl" style="display: flex; align-items: center; gap: 12px;">
            <app-bi k="calendar_rot"></app-bi>
            <div style="display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--bd-soft); border-radius: 6px; padding: 2px;">
              <button class="icon-btn" (click)="prevMonth()" style="padding: 4px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center;"><app-icon name="ChevronLeft" [size]="16"></app-icon></button>
              <span style="font-size: 13px; min-width: 100px; text-align: center;">{{ currentMonthName() }} {{ currentYear() }}</span>
              <button class="icon-btn" (click)="nextMonth()" style="padding: 4px; border: none; background: transparent; cursor: pointer; display: flex; align-items: center;"><app-icon name="ChevronRight" [size]="16"></app-icon></button>
            </div>
          </div>
          <div class="row gap-8" style="margin-left: auto;">
            <span class="chip"><span class="cycle d1">D1</span></span>
            <span class="chip"><span class="cycle d2">D2</span></span>
            <span class="chip"><span class="cycle d3">D3</span></span>
            <span class="chip"><span class="cycle d4">D4</span></span>
            <span class="chip"><app-bi k="rain_holiday"></app-bi></span>
          </div>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
            @for (d of ['mon','tue','wed','thu','fri','sat','sun']; track d) {
              <div style="font-size: 11px; font-weight: 700; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 8px;"><app-bi [k]="d"></app-bi></div>
            }
            @for (e of emptyDays(); track e) {
              <div style="background: transparent; border: none;"></div>
            }
            @for (d of days(); track d) {
              <div style="padding: 8px; border-radius: 4px; min-height: 72px; position: relative; cursor: pointer; transition: all 0.2s;"
                   [style.border]="isSelected(d) ? '2px solid var(--primary)' : isToday(d) ? '2px solid var(--ink)' : '1px solid var(--bd-soft)'"
                   [style.background]="isSelected(d) ? 'var(--primary-soft)' : isToday(d) ? 'var(--accent-soft)' : 'var(--surface)'"
                   (click)="selectDate(d)">
                <div class="row between">
                  <span class="mono" style="font-size: 11px; font-weight: 700;">{{ d.toString().padStart(2, '0') }} {{ currentMonthShort() }}</span>
                  @if (!isRainHoliday(d)) {
                    <span class="cycle" [ngClass]="getCycle(d)">{{ getCycle(d) | uppercase }}</span>
                  }
                </div>
                @if (isRainHoliday(d)) {
                  <div style="font-size: 10px; margin-top: 6px; color: var(--ink-3);"><app-bi k="rain_holiday"></app-bi><br/><app-bi k="no_tapping"></app-bi></div>
                } @else {
                  <div style="font-size: 10px; margin-top: 4px; color: var(--ink-3); font-family: var(--font-mono);">
                    {{ getCycleData(d)?.blocks?.length || 0 }} <app-bi k="blocks_sm"></app-bi><br/>{{ (getCycleData(d)?.trees || 0).toLocaleString() }} <app-bi k="trees_sm"></app-bi>
                  </div>
                }
                @if (isToday(d)) {
                  <span class="badge solid" style="position: absolute; bottom: 6px; right: 6px; font-size: 9px; padding: 1px 4px;"><app-bi k="today_upper"></app-bi></span>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <div class="card bold">
        <div class="card-head"><div class="ttl">{{ getCycleForSelected() | uppercase }} Assignments · {{ selectedDate() | date:'dd MMM yyyy' }}</div></div>
        <table class="tbl">
          <thead>
            <tr><th><app-bi k="block"></app-bi></th><th><app-bi k="division"></app-bi></th><th class="num"><app-bi k="tree_census"></app-bi></th><th class="num"><app-bi k="tappers"></app-bi></th><th><app-bi k="tapping_sup"></app-bi></th><th><app-bi k="start_time"></app-bi></th><th><app-bi k="exp_dry"></app-bi></th><th><app-bi k="status"></app-bi></th></tr>
          </thead>
          <tbody>
            @if (isRainHolidayForDate(selectedDate())) {
              <tr><td colspan="8" style="text-align: center; color: var(--ink-3); padding: 24px;"><app-bi k="rain_holiday"></app-bi> - <app-bi k="no_tapping"></app-bi></td></tr>
            } @else {
              @for (b of getCycleDataForSelected()?.blocks; track b; let i = $index) {
                <tr>
                  <td><b>{{ b }}</b></td>
                  <td>{{ b.includes('3') ? 'East' : b.includes('4') ? 'South' : 'North' }}</td>
                  <td class="num">{{ (9500 + (i * 1230)) | number }}</td>
                  <td class="num">{{ 8 + (i % 4) }}</td>
                  <td>{{ getCycleDataForSelected()?.supervisors[i % (getCycleDataForSelected()?.supervisors?.length || 1)] || 'Vinod Raj' }}</td>
                  <td class="mono">06:00</td>
                  <td class="mono">{{ 84 + (i * 12) }} kg</td>
                  <td><span class="badge" [ngClass]="i % 3 === 0 ? 'leaf' : 'amber'">{{ i % 3 === 0 ? 'In progress' : 'Delayed start' }}</span></td>
                </tr>
              }
              @if (!getCycleDataForSelected()?.blocks?.length) {
                <tr><td colspan="8" style="text-align: center; color: var(--ink-3); padding: 24px;">No assignments</td></tr>
              }
            }
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

  viewDate = signal(new Date(2026, 4, 1)); // Start at May 2026 for mock data alignment
  todayDate = new Date(2026, 4, 25); // "Today" in the context of the mock
  selectedDate = signal(new Date(2026, 4, 25)); // initialize to today date

  currentYear = computed(() => this.viewDate().getFullYear());
  currentMonth = computed(() => this.viewDate().getMonth());
  currentMonthName = computed(() => this.viewDate().toLocaleString('default', { month: 'long' }));
  currentMonthShort = computed(() => this.viewDate().toLocaleString('default', { month: 'short' }));

  daysInMonth = computed(() => new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate());

  startDayOffset = computed(() => {
    let day = new Date(this.currentYear(), this.currentMonth(), 1).getDay();
    return (day + 6) % 7; // Convert to Mon=0, Sun=6
  });

  emptyDays = computed(() => Array.from({length: this.startDayOffset()}, (_, i) => i));
  days = computed(() => Array.from({length: this.daysInMonth()}, (_, i) => i + 1));

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

  prevMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  isToday(d: number) {
    return this.currentYear() === this.todayDate.getFullYear() && 
           this.currentMonth() === this.todayDate.getMonth() && 
           d === this.todayDate.getDate();
  }

  selectDate(d: number) {
    this.selectedDate.set(new Date(this.currentYear(), this.currentMonth(), d));
  }

  isSelected(d: number) {
    const sel = this.selectedDate();
    return this.currentYear() === sel.getFullYear() && 
           this.currentMonth() === sel.getMonth() && 
           d === sel.getDate();
  }

  isRainHolidayForDate(date: Date) {
    return date.getFullYear() === 2026 && date.getMonth() === 4 && (date.getDate() === 18 || date.getDate() === 12);
  }

  isRainHoliday(d: number) {
    if (this.currentYear() === 2026 && this.currentMonth() === 4) {
      return d === 18 || d === 12;
    }
    return false;
  }

  getCycle(d: number) {
    const date = new Date(this.currentYear(), this.currentMonth(), d);
    const epoch = new Date(2026, 4, 1); // Epoch is May 1, 2026
    let daysSince = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    let cycleIdx = daysSince % 4;
    if (cycleIdx < 0) cycleIdx += 4;
    return ['d1','d2','d3','d4'][cycleIdx];
  }

  getCycleData(d: number) {
    const date = new Date(this.currentYear(), this.currentMonth(), d);
    const epoch = new Date(2026, 4, 1);
    let daysSince = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    let cycleIdx = daysSince % 4;
    if (cycleIdx < 0) cycleIdx += 4;
    return this.schedule()[cycleIdx];
  }

  getCycleForSelected() {
    const date = this.selectedDate();
    const epoch = new Date(2026, 4, 1);
    let daysSince = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    let cycleIdx = daysSince % 4;
    if (cycleIdx < 0) cycleIdx += 4;
    return ['d1','d2','d3','d4'][cycleIdx];
  }

  getCycleDataForSelected() {
    const date = this.selectedDate();
    const epoch = new Date(2026, 4, 1);
    let daysSince = Math.floor((date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    let cycleIdx = daysSince % 4;
    if (cycleIdx < 0) cycleIdx += 4;
    return this.schedule()[cycleIdx];
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

  printPage() {
    window.print();
  }
}
