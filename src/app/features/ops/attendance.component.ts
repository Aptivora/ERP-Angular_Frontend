import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Worker } from '../../core/services/data.service';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent],
  template: `
    <div class="page">
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .spin-slow {
          animation: spin 2s linear infinite;
        }
      </style>
      <app-page-head
        title="Attendance & Muster"
        ml="ഹാജർ · മസ്റ്റർ ചിറ്റ്"
        sub="Block-wise daily attendance · Muster Sheet No. 9201"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onSyncClick()"><app-icon name="Fingerprint" [size]="13"></app-icon>Biometric sync</button>
          <button class="btn ghost sm" (click)="onExportClick()"><app-icon name="Download" [size]="13"></app-icon>Export PDF</button>
          <button class="btn primary sm" (click)="onCloseClick()"><app-icon name="Check" [size]="13"></app-icon>Close muster</button>
        </ng-container>
      </app-page-head>

      <!-- Toolbar -->
      <div class="row mb-16 gap-16" style="flex-wrap: wrap;">
        <div class="row gap-8">
          <div class="field"><label>Date</label><input class="input mono" [value]="'25-05-2026'" readonly style="width: 130px;"/></div>
          <div class="field"><label>Block</label>
            <select class="select" style="min-width: 180px;" [(ngModel)]="attBlock">
              <option>All blocks · KLP estate</option>
              <option>KLP-B07 · Kallarkutty B7</option>
              <option>KLP-B08 · Kallarkutty B8</option>
              <option>KLP-B12 · Aryankavu A</option>
            </select>
          </div>
          <div class="field"><label>Category</label>
            <select class="select" [(ngModel)]="attCategory">
              <option>All</option>
              <option>Permanent</option>
              <option>Casual</option>
              <option>Dependent</option>
            </select>
          </div>
          <button class="btn ghost sm" style="margin-top: 16px;" (click)="onFilterClick()"><app-icon name="Filter" [size]="13"></app-icon>Filter</button>
        </div>
        <div style="margin-left: auto;" class="row gap-8">
          <span class="badge leaf">Present {{ stats().present }}</span>
          <span class="badge oxide">Absent {{ stats().absent }}</span>
          <span class="badge amber">Leave {{ stats().leave }}</span>
          <span class="badge">Total {{ stats().total }}</span>
        </div>
      </div>

      <div class="grid mb-16" style="grid-template-columns: 1fr 320px;">
        <div class="card bold">
          <div class="card-head">
            <div class="ttl">Muster Roll · Block KLP-B07 Kallarkutty</div>
            <div class="row gap-8" style="margin-left: auto; font-size: 11px;">
              <span class="muted">Field Supervisor: <b>Reena Vijayan</b></span>
              <span class="badge clay">D1 cycle</span>
            </div>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th style="width: 32px;">#</th>
                <th>Worker</th>
                <th>Cat.</th>
                <th>Status</th>
                <th>In</th>
                <th>Out</th>
                <th class="num">Hours</th>
                <th>Task</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              @for (r of filteredWorkers(); track r.emp; let i = $index) {
                <tr>
                  <td class="mono muted">{{ (i + 1).toString().padStart(2, '0') }}</td>
                  <td><b>{{ r.n }}</b><div class="ml muted" style="font-size: 11px;">{{ r.ml }} · {{ r.emp }}</div></td>
                  <td><span class="chip mono">{{ r.cat }}</span></td>
                  <td>
                    @if (r.st === 'present') { <span class="badge leaf">P · Present</span> }
                    @if (r.st === 'absent') { <span class="badge oxide">A · Absent</span> }
                    @if (r.st === 'leave') { <span class="badge amber">L · Leave</span> }
                  </td>
                  <td class="mono">{{ r.in }}</td>
                  <td class="mono">{{ r.out }}</td>
                  <td class="num">{{ r.hr }}</td>
                  <td class="muted">{{ r.task }}</td>
                  <td class="muted" style="font-size: 11px;">{{ r.rem || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
          <div class="card-foot">
            <span><b>Total:</b> {{ workersList().length }} workers · {{ presentCount() }} present · {{ absentCount() }} absent · {{ leaveCount() }} leave · {{ totalMandays().toFixed(1) }} mandays</span>
            <div style="margin-left: auto;" class="row gap-8">
              <button class="btn ghost sm" (click)="onSaveDraftClick()">Save draft</button>
              <button class="btn primary sm" (click)="onSubmitClick()">Submit to Field Officer</button>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card bold">
            <div class="card-head"><div class="ttl">Quick mark</div></div>
            <div class="card-body col" style="gap: 10px;">
              <div class="input-group">
                <input
                  class="input mono"
                  placeholder="Scan ID / type EMP-…"
                  [(ngModel)]="searchId"
                  (keydown.enter)="handleSearch()"
                />
                <button
                  class="addon"
                  (click)="handleSearch()"
                  style="border: var(--bd-soft); border-left: none; background: var(--bg-2); cursor: pointer; display: grid; place-items: center; padding: 0 12px; color: var(--ink-3); font-size: 12px;"
                  title="Search Employee"
                >
                  <app-icon name="Search" [size]="14"></app-icon>
                </button>
              </div>

              @if (selectedWorker()) {
                <div style="padding: 12px; background: var(--bg-2); border: var(--bd); border-radius: var(--r-sm); display: flex; flex-direction: column; gap: 8px;">
                  <div class="row between">
                    <div>
                      <div style="font-weight: 700; font-size: 13px;">{{ selectedWorker()!.n }}</div>
                      <div class="muted" style="font-size: 11px;">{{ selectedWorker()!.emp }} · {{ selectedWorker()!.cat === 'P' ? 'Permanent' : (selectedWorker()!.cat === 'C' ? 'Casual' : 'Dependent') }}</div>
                    </div>
                    <span class="badge" [ngClass]="selectedWorker()!.st === 'present' ? 'leaf' : (selectedWorker()!.st === 'absent' ? 'oxide' : 'amber')">
                      {{ selectedWorker()!.st === 'present' ? 'P · Present' : (selectedWorker()!.st === 'absent' ? 'A · Absent' : 'L · Leave') }}
                    </span>
                  </div>
                  
                  @if (scanStatus() === 'idle') {
                    <div style="padding: 8px 10px; background: var(--amber-soft); color: var(--amber); font-size: 11px; font-weight: 600; border-radius: 4px; display: flex; align-items: center; gap: 6px;">
                      <app-icon name="Fingerprint" [size]="12"></app-icon> Ready for Biometric Verification
                    </div>
                  }

                  @if (scanStatus() === 'scanning') {
                    <div style="padding: 8px 10px; background: var(--accent-soft); color: var(--accent); font-size: 11px; font-weight: 600; border-radius: 4px; display: flex; flex-direction: column; gap: 6px;">
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <app-icon name="Refresh" [size]="12" class="spin-slow"></app-icon> Scanning fingerprint...
                      </div>
                      <div class="bar" style="height: 4px; background: var(--bg-3);">
                        <div style="height: 100%; background: var(--accent); width: 100%; animation: progress-bar 1.5s linear forwards;"></div>
                      </div>
                    </div>
                  }

                  @if (scanStatus() === 'success') {
                    <div style="padding: 8px 10px; background: var(--leaf-soft); color: var(--leaf); font-size: 11px; font-weight: 600; border-radius: 4px; display: flex; align-items: center; gap: 6px;">
                      <app-icon name="Check" [size]="12"></app-icon> Authentication Success!
                    </div>
                  }

                  <div style="display: flex; gap: 6px; margin-top: 4px;">
                    <button
                      class="btn primary sm grow"
                      [disabled]="scanStatus() === 'scanning'"
                      (click)="startFingerprintScan()"
                    >
                      <app-icon name="Fingerprint" [size]="13"></app-icon>
                      {{ scanStatus() === 'scanning' ? 'Scanning...' : 'Scan Fingerprint' }}
                    </button>
                    <button
                      class="btn ghost sm"
                      (click)="clearSelection()"
                      style="padding: 5px 8px;"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              }

              <div class="grid g-3" style="gap: 6px;">
                <button
                  class="btn"
                  [style.border-color]="'var(--leaf)'" [style.color]="'var(--leaf)'" [style.opacity]="selectedWorker() ? 1 : 0.6"
                  [disabled]="!selectedWorker()"
                  (click)="handleManualMark('present')"
                >
                  P · Present
                </button>
                <button
                  class="btn"
                  [style.border-color]="'var(--oxide)'" [style.color]="'var(--oxide)'" [style.opacity]="selectedWorker() ? 1 : 0.6"
                  [disabled]="!selectedWorker()"
                  (click)="handleManualMark('absent')"
                >
                  A · Absent
                </button>
                <button
                  class="btn"
                  [style.border-color]="'var(--amber)'" [style.color]="'var(--amber)'" [style.opacity]="selectedWorker() ? 1 : 0.6"
                  [disabled]="!selectedWorker()"
                  (click)="handleManualMark('leave')"
                >
                  L · Leave
                </button>
              </div>
              <div class="muted" style="font-size: 11px;">Tip: Search worker to mark status or scan fingerprint.</div>
            </div>
          </div>

          <div class="card bold">
            <div class="card-head"><div class="ttl">Today summary</div></div>
            <div class="card-body col" style="gap: 10px;">
              <div class="row between"><span>Mandays</span><b class="mono">{{ totalMandays().toFixed(1) }}</b></div>
              <div class="row between"><span>Wage liability</span><b class="mono">₹{{ totalWageLiability().toLocaleString('en-IN') }}</b></div>
              <div class="row between"><span>OT hours</span><b class="mono">2.4</b></div>
              <div class="row between"><span>Pending verify</span><b class="mono hl-clay">{{ pendingVerifyCount() }}</b></div>
              <div class="bar tall"><i [style.width.%]="(verifiedCount() / 11) * 100"></i></div>
              <div class="muted" style="font-size: 11px;">{{ verifiedCount() }}/11 attendance entries verified</div>
            </div>
          </div>

          <div class="card bold">
            <div class="card-head"><div class="ttl">Pending escalations</div><span class="badge oxide" style="margin-left: auto;">2</span></div>
            <div class="card-body col" style="gap: 10px; font-size: 12px;">
              <div>
                <div><b>Suresh Babu</b> · 3-day absent streak</div>
                <div class="muted" style="font-size: 11px;">Auto-escalated to Field Officer (Asha M.)</div>
                <button class="btn ghost sm mt-8" (click)="onSmsClick()">Send SMS reminder</button>
              </div>
              <div style="border-top: var(--bd-soft); padding-top: 8px;">
                <div><b>Mohanan Nair</b> · No biometric in 8d</div>
                <div class="muted" style="font-size: 11px;">Manual entry by supervisor — flagged for audit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Toast Notification -->
      @if (toastMessage()) {
        <div style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink-1); color: var(--bg-1); padding: 12px 24px; border-radius: var(--r-md); font-size: 13px; font-weight: 500; z-index: 1000; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px;">
          <app-icon name="Check" [size]="16"></app-icon>
          {{ toastMessage() }}
        </div>
      }
    </div>
  `
})
export class AttendanceComponent {
  private dataService = inject(DataService);

  attBlock = 'All blocks · KLP estate';
  attCategory = 'All';
  searchId = '';

  appliedBlock = signal('All blocks · KLP estate');
  appliedCategory = signal('All');
  toastMessage = signal<string | null>(null);

  scanStatus = signal<'idle' | 'scanning' | 'success'>('idle');
  selectedWorkerId = signal<string | null>(null);

  // Derive workers list in the format needed for the template
  workersList = computed(() => {
    return this.dataService.workers().map(w => ({
      emp: w.id,
      n: w.name,
      ml: w.ml || '',
      cat: w.cat === 'P' || w.cat === 'C' || w.cat === 'D' ? w.cat : (w.cat === 'Permanent' ? 'P' : (w.cat === 'Casual' ? 'C' : 'D')),
      st: w.st || 'absent',
      in: w.in || '—',
      out: w.out || '—',
      hr: w.hr !== undefined ? w.hr : 0,
      task: w.task || '—',
      rem: w.rem || '',
      verified: w.verified !== undefined ? w.verified : false,
      wage: w.wage || 612
    }));
  });

  selectedWorker = computed(() => {
    const id = this.selectedWorkerId();
    if (!id) return null;
    return this.workersList().find(w => w.emp === id) || null;
  });

  filteredWorkers = computed(() => {
    const blockFilter = this.appliedBlock();
    const categoryFilter = this.appliedCategory();

    return this.workersList().filter(r => {
      // Block filter
      if (blockFilter !== 'All blocks · KLP estate') {
        const blockCode = blockFilter.split(' · ')[0]; // e.g. "KLP-B07"
        const localBlock = r.emp === 'EMP-1042' || r.emp === 'EMP-1158' || r.emp === 'EMP-1721' ? 'KLP-B07' :
                          r.emp === 'EMP-1209' || r.emp === 'EMP-2055' ? 'KLP-B08' :
                          r.emp === 'EMP-1311' || r.emp === 'EMP-1402' ? 'KLP-B12' :
                          r.emp === 'EMP-1505' || r.emp === 'EMP-1617' ? 'KLP-B27' : '—';
        if (localBlock !== blockCode) return false;
      }
      
      // Category filter
      if (categoryFilter !== 'All') {
        const catMap: Record<string, string> = { 'Permanent': 'P', 'Casual': 'C', 'Dependent': 'D' };
        if (r.cat !== catMap[categoryFilter]) return false;
      }
      
      return true;
    });
  });

  presentCount = computed(() => this.workersList().filter(w => w.st === 'present').length);
  absentCount = computed(() => this.workersList().filter(w => w.st === 'absent').length);
  leaveCount = computed(() => this.workersList().filter(w => w.st === 'leave').length);

  stats = computed(() => {
    const basePresent = 404;
    const baseAbsent = 6;
    const baseLeave = 2;
    
    const diffPresent = this.presentCount() - 9;
    const diffAbsent = this.absentCount() - 1;
    const diffLeave = this.leaveCount() - 1;
    
    return {
      present: basePresent + diffPresent,
      absent: baseAbsent + diffAbsent,
      leave: baseLeave + diffLeave,
      total: basePresent + baseAbsent + baseLeave
    };
  });

  totalMandays = computed(() => {
    return this.workersList().reduce((sum, w) => {
      const val = typeof w.hr === 'string' ? parseFloat(w.hr) : w.hr;
      return sum + (isNaN(val) ? (w.emp === 'EMP-1830' ? 10.0 : 0) : val);
    }, 0);
  });

  totalWageLiability = computed(() => {
    const currentWages = this.workersList().reduce((sum, w) => w.st === 'present' ? sum + w.wage : sum, 0);
    return 51142 + (currentWages - 6500);
  });

  verifiedCount = computed(() => this.workersList().filter(w => w.verified).length);
  pendingVerifyCount = computed(() => 3 - (this.verifiedCount() - 9));

  private workerAliases: Record<string, string> = {
    'EMP001': 'EMP-1042',
    'EMP002': 'EMP-1311',
    'EMP003': 'EMP-1158',
    'EMP004': 'EMP-1209',
    'EMP005': 'EMP-1276',
    'EMP006': 'EMP-1402',
    'EMP007': 'EMP-1505',
    'EMP008': 'EMP-1617',
    'EMP009': 'EMP-1721',
    'EMP010': 'EMP-1830',
    'EMP011': 'EMP-2055'
  };

  handleSearch() {
    const query = this.searchId.trim().toUpperCase();
    if (!query) {
      alert('Please enter an Employee ID to search.');
      return;
    }
    
    const normalizedQuery = query.replace(/[-_]/g, '');
    let targetId = normalizedQuery;

    if (this.workerAliases[query]) {
      targetId = this.workerAliases[query];
    } else if (this.workerAliases[normalizedQuery]) {
      targetId = this.workerAliases[normalizedQuery];
    } else {
      const numericPart = query.match(/\d+/);
      if (numericPart) {
        const numStr = numericPart[0];
        const paddedAlias = `EMP${numStr.padStart(3, '0')}`;
        if (this.workerAliases[paddedAlias]) {
          targetId = this.workerAliases[paddedAlias];
        } else {
          const foundByEnd = this.workersList().find(w => w.emp.endsWith(numStr));
          if (foundByEnd) {
            targetId = foundByEnd.emp;
          }
        }
      }
    }

    const foundWorker = this.workersList().find(w => w.emp === targetId || w.emp.replace(/[-_]/g, '') === targetId);
    
    if (foundWorker) {
      this.selectedWorkerId.set(foundWorker.emp);
      this.scanStatus.set('idle');
    } else {
      this.showToast(`Employee with ID "${this.searchId}" not found.`);
      this.selectedWorkerId.set(null);
    }
  }

  startFingerprintScan() {
    const workerId = this.selectedWorkerId();
    if (!workerId) return;
    this.scanStatus.set('scanning');
    
    setTimeout(() => {
      this.scanStatus.set('success');
      
      const nowStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      this.dataService.updateWorkers(prev => prev.map(w => {
        if (w.id === workerId) {
          return {
            ...w,
            st: 'present',
            in: w.in === '—' ? nowStr : w.in,
            hr: w.hr === 0 || w.hr === '—' ? 8.0 : w.hr,
            verified: true
          };
        }
        return w;
      }));
    }, 1500);
  }

  handleManualMark(status: string) {
    const workerId = this.selectedWorkerId();
    if (!workerId) return;
    
    const nowStr = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    this.dataService.updateWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          st: status,
          in: status === 'present' ? (w.in === '—' ? nowStr : w.in) : '—',
          out: status === 'present' ? w.out : '—',
          hr: status === 'present' ? (w.hr === 0 || w.hr === '—' ? 8.0 : w.hr) : 0,
          verified: true
        };
      }
      return w;
    }));
  }

  clearSelection() {
    this.selectedWorkerId.set(null);
    this.scanStatus.set('idle');
    this.searchId = '';
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onSyncClick() { this.showToast('Biometric sync initiated. Fetching data from fingerprint server…'); }
  onExportClick() { this.showToast('Exporting Attendance PDF for 25-May-2026…'); }
  onCloseClick() { this.showToast('Muster closed for 25-May-2026. Submitted to Field Officer.'); }
  onFilterClick() { 
    this.appliedBlock.set(this.attBlock);
    this.appliedCategory.set(this.attCategory);
    this.showToast(`Filter applied`);
  }
  onSaveDraftClick() { this.showToast('Muster draft saved successfully.'); }
  onSubmitClick() { this.showToast('Muster submitted to Field Officer (Asha M.) for review.'); }
  onSmsClick() { this.showToast('SMS reminder sent to Suresh Babu (+91 98xxx 4521)'); }
}
