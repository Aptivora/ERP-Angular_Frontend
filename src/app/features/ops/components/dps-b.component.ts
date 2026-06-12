import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-dps-b',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="row mb-16 gap-16">
      <div class="field"><label>Date</label><input class="input mono" [value]="'25-05-2026'" readonly style="width: 130px;"/></div>
      <div class="field">
        <label>Block</label>
        <select class="select" [ngModel]="block()" (ngModelChange)="block.set($event)">
          <option>KLP-B07 · Kallarkutty B7</option>
          <option>KLP-B08 · Kallarkutty B8</option>
          <option>KLP-B12 · Aryankavu A</option>
        </select>
      </div>
      <div class="field">
        <label>View</label>
        <div class="lang-toggle" style="padding: 0;">
          <button [class.on]="view === 'Card'" (click)="view = 'Card'">Card</button>
          <button [class.on]="view === 'Table'" (click)="view = 'Table'">Table</button>
        </div>
      </div>
      <div style="margin-left: auto;" class="row gap-8 mt-16">
        <button class="btn primary sm" (click)="addEntry()"><app-icon name="Plus" [size]="13"></app-icon>Add entry</button>
      </div>
    </div>

    @if (view === 'Card') {
      <div class="grid g-3">
        @for (r of filteredRows(); track r.emp) {
        <div class="card bold">
          <div class="card-head">
            <div class="avatar" style="background: var(--accent);">{{ getInitials(r.name) }}</div>
            <div>
              <div style="font-weight: 700; font-size: 14px;">{{ r.name }}</div>
              <div class="muted" style="font-size: 11px;">{{ r.emp }} · {{ r.block }}</div>
            </div>
            <span class="cycle" [ngClass]="r.cycle.toLowerCase()" style="margin-left: auto;">{{ r.cycle }}</span>
          </div>
          <div class="card-body" style="padding: 12px 16px;">
            <div class="grid g-2" style="gap: 8px; font-size: 12px;">
              <div class="col" style="gap: 2px;"><span class="muted up" style="font-size: 10px;">Trees</span><b class="mono" style="font-size: 18px;">{{ r.trees }}</b></div>
              <div class="col" style="gap: 2px;"><span class="muted up" style="font-size: 10px;">Cups</span><b class="mono" style="font-size: 18px;">{{ r.cups }}</b></div>
              <div class="col" style="gap: 2px;"><span class="muted up" style="font-size: 10px;">Wt (kg)</span><b class="mono" style="font-size: 18px;">{{ r.latex }}</b></div>
              <div class="col" style="gap: 2px;"><span class="muted up" style="font-size: 10px;">DRC %</span><b class="mono" style="font-size: 18px;">{{ r.drc }}</b></div>
            </div>
            <div class="mt-16" style="padding: 10px; background: var(--bg-2); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="muted" style="font-size: 10px;">DRY KG · INCENTIVE</div>
                <div class="mono" style="font-size: 22px; font-weight: 700;">{{ getDry(r) }}</div>
              </div>
              <div style="text-align: right;">
                <div class="muted" style="font-size: 10px;">Δ BASE</div>
                <div class="mono" style="font-size: 18px; font-weight: 700;" [style.color]="getDelta(r) >= 0 ? 'var(--leaf)' : 'var(--oxide)'">
                  {{ getDelta(r) >= 0 ? '+' : '' }}{{ getDelta(r) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="card-foot">
            @if (r.status === 'verified') {
              <span class="badge leaf"><app-icon name="Check" [size]="10"></app-icon> Verified by V. Raj</span>
            } @else {
              <span class="badge amber">Awaiting verification</span>
            }
            <button class="btn ghost sm" style="margin-left: auto;" (click)="onAction('Editing entry for ' + r.name + ' (' + r.emp + ')')"><app-icon name="Edit" [size]="12"></app-icon></button>
          </div>
        </div>
      }
    </div>
    } @else {
      <div class="card bold">
        <table class="tbl">
          <thead>
            <tr>
              <th style="width: 32px;">#</th>
              <th>Tapper</th>
              <th class="num">Trees</th>
              <th class="num">Cups</th>
              <th class="num">Latex (L)</th>
              <th class="num">Wt (kg)</th>
              <th class="num">Scrap</th>
              <th class="num">DRC %</th>
              <th class="num">Dry kg</th>
              <th class="num">Δ Base</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (r of filteredRows(); track r.emp; let i = $index) {
              <tr>
                <td class="mono muted">{{ (i + 1).toString().padStart(2, '0') }}</td>
                <td><b>{{ r.name }}</b><div class="muted" style="font-size: 11px;">{{ r.emp }}</div></td>
                <td class="num"><input class="input mono" [ngModel]="r.trees" (ngModelChange)="updateRow(r.emp, 'trees', $event)" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
                <td class="num"><input class="input mono" [ngModel]="r.cups" (ngModelChange)="updateRow(r.emp, 'cups', $event)" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
                <td class="num mono">{{ (r.latex * 1.08).toFixed(1) }}</td>
                <td class="num"><input class="input mono" [ngModel]="r.latex" (ngModelChange)="updateRow(r.emp, 'latex', $event)" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
                <td class="num"><input class="input mono" [ngModel]="r.scrap" (ngModelChange)="updateRow(r.emp, 'scrap', $event)" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
                <td class="num"><input class="input mono" [ngModel]="r.drc" (ngModelChange)="updateRow(r.emp, 'drc', $event)" style="text-align: right; padding: 4px 6px; width: 60px;"/></td>
                <td class="num mono"><b>{{ getDry(r) }}</b></td>
                <td class="num mono" [style.color]="getDelta(r) >= 0 ? 'var(--leaf)' : 'var(--oxide)'" style="font-weight: 700;">
                  {{ getDelta(r) >= 0 ? '+' : '' }}{{ getDelta(r) }}%
                </td>
                <td>
                  @if (r.status === 'verified') {
                    <span class="badge leaf"><app-icon name="Check" [size]="10"></app-icon> Verified</span>
                  } @else {
                    <span class="badge amber">Pending</span>
                  }
                </td>
              </tr>
            }
            <tr style="background: var(--bg-2); font-weight: 700;">
              <td colspan="2">TOTALS</td>
              <td class="num mono">{{ totals().trees }}</td>
              <td class="num mono">{{ totals().cups }}</td>
              <td class="num mono">{{ (totals().latex * 1.08).toFixed(1) }}</td>
              <td class="num mono">{{ totals().latex.toFixed(1) }}</td>
              <td class="num mono">{{ totals().scrap.toFixed(1) }}</td>
              <td class="num mono">{{ totals().drcAvg.toFixed(1) }}</td>
              <td class="num mono">{{ totals().dry.toFixed(2) }}</td>
              <td class="num mono" [style.color]="totals().delta >= 0 ? 'var(--leaf)' : 'var(--oxide)'">
                {{ totals().delta >= 0 ? '+' : '' }}{{ totals().delta.toFixed(1) }}%
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    }

    <!-- Toast Notification -->
    @if (toastMessage()) {
      <div style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink-1); color: var(--bg-1); padding: 12px 24px; border-radius: var(--r-md); font-size: 13px; font-weight: 500; z-index: 1000; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px;">
        <app-icon name="Check" [size]="16"></app-icon>
        {{ toastMessage() }}
      </div>
    }
  `
})
export class DpsBComponent {
  block = signal('KLP-B07 · Kallarkutty B7');
  view = 'Card';
  dataService = inject(DataService);
  toastMessage = signal<string | null>(null);

  filteredRows = computed(() => {
    const b = this.block().split(' · ')[0];
    return this.dataService.dpsSignal().filter(r => r.block === b);
  });

  totals = computed(() => {
    const rows = this.filteredRows();
    const sum = rows.reduce((acc, r) => ({
      trees: acc.trees + Number(r.trees || 0),
      cups: acc.cups + Number(r.cups || 0),
      latex: acc.latex + Number(r.latex || 0),
      scrap: acc.scrap + Number(r.scrap || 0),
      drcAvg: acc.drcAvg + Number(r.drc || 0),
      dry: acc.dry + Number(this.getDry(r))
    }), { trees: 0, cups: 0, latex: 0, scrap: 0, drcAvg: 0, dry: 0 });

    if (rows.length > 0) {
      sum.drcAvg = sum.drcAvg / rows.length;
    }
    const expected = 10.5 * rows.length;
    const delta = expected ? ((sum.dry - expected) / expected) * 100 : 0;
    
    return { ...sum, delta };
  });

  getInitials(name: string) {
    return name.split(' ').map(x => x[0]).join('');
  }

  addEntry() {
    const blockCode = this.block().split(' · ')[0];
    const newId = 'EMP-' + Math.floor(3000 + Math.random() * 7000);
    
    this.dataService.addDpsRow({
      emp: newId,
      name: 'New Tapper',
      block: blockCode,
      cycle: 'D1',
      trees: 350,
      cups: 340,
      latex: 0,
      scrap: 0,
      drc: 33.0,
      status: 'pending'
    });
    
    this.showToast(`New DPS entry added for ${blockCode}`);
  }

  getDry(r: any) {
    return (r.latex * r.drc / 100).toFixed(2);
  }

  getDelta(r: any) {
    const dry = parseFloat(this.getDry(r));
    return parseFloat((((dry - 10.5) / 10.5) * 100).toFixed(0));
  }

  updateRow(emp: string, field: string, val: string) {
    this.dataService.updateDpsRow(emp, field, val);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }
}
