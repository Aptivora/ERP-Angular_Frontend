import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService, Worker } from '../../core/services/data.service';

@Component({
  selector: 'app-hierarchy-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [style.padding]="small ? '6px 12px' : '8px 14px'"
         [style.border]="highlight ? '2px solid var(--ink)' : 'var(--bd-soft)'"
         [style.border-radius.px]="4"
         [style.background]="highlight ? 'var(--accent-soft)' : 'var(--surface)'"
         style="text-align: center;" [style.min-width.px]="small ? 140 : 200">
      <div style="font-size: 10px; color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">{{ title }}</div>
      <div style="font-weight: 700; margin-top: 2px;" [style.font-size.px]="small ? 12 : 13">{{ name }}</div>
      @if (sub) {
        <div class="muted" style="font-size: 11px; font-family: var(--font-mono);">{{ sub }}</div>
      }
    </div>
  `
})
export class HierarchyNodeComponent {
  @Input() title!: string;
  @Input() name!: string;
  @Input() sub?: string;
  @Input() highlight = false;
  @Input() small = false;
}
import { Input } from '@angular/core';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, HierarchyNodeComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Worker Master"
        ml="തൊഴിലാളി മാസ്റ്റർ"
        sub="Permanent · Casual · Dependent · Kulathupuzha Estate"
      >
        <ng-container actions>
          <button class="btn ghost sm" (click)="onAction('Import CSV: Select a CSV file with columns EMP ID, Name, Category, Role, Block, Joined, Bank, Aadhaar, Wage.')"><app-icon name="Upload" [size]="13"></app-icon>Import CSV</button>
          <button class="btn ghost sm" (click)="onAction('Exporting worker register (' + cats().Total + ' records) as XLSX…')"><app-icon name="Download" [size]="13"></app-icon>Export</button>
          <button class="btn primary sm" (click)="showAddModal = true"><app-icon name="Plus" [size]="13"></app-icon>New worker</button>
        </ng-container>
      </app-page-head>

      <!-- Add Worker Modal -->
      @if (showAddModal) {
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1100;">
          <div class="card bold" style="width: 500px; background: var(--surface); padding: 0;">
            <div class="card-head" style="justify-content: space-between;">
              <div class="ttl">Add New Worker</div>
              <button class="icon-btn" (click)="showAddModal = false" style="border: none; background: transparent; cursor: pointer; display: flex; align-items: center;"><app-icon name="X" [size]="16"></app-icon></button>
            </div>
            <div class="card-body col" style="gap: 12px; max-height: 70vh; overflow-y: auto;">
              <div class="grid g-2" style="gap: 10px;">
                <div class="field"><label>Employee ID</label><input class="input mono" placeholder="e.g. EMP-2100" [(ngModel)]="newWorker.id" /></div>
                <div class="field"><label>Joined Date</label><input class="input mono" type="date" [(ngModel)]="newWorker.join" /></div>
              </div>
              <div class="field"><label>Worker Name (English)</label><input class="input" placeholder="e.g. Saritha Nair" [(ngModel)]="newWorker.name" /></div>
              <div class="field"><label>Worker Name (Malayalam)</label><input class="input" placeholder="e.g. സരിത നായർ" [(ngModel)]="newWorker.ml" /></div>
              <div class="grid g-3" style="gap: 10px;">
                <div class="field"><label>Category</label><select class="select" [(ngModel)]="newWorker.cat"><option>Permanent</option><option>Casual</option><option>Dependent</option></select></div>
                <div class="field"><label>Role</label><select class="select" [(ngModel)]="newWorker.role"><option>Tapper</option><option>Coll. Centre Wk.</option><option>General Worker</option><option>Field Supervisor</option><option>Tapping Sup.</option></select></div>
                <div class="field"><label>Block</label><select class="select" [(ngModel)]="newWorker.block"><option>KLP-B07</option><option>KLP-B08</option><option>KLP-B12</option><option>—</option></select></div>
              </div>
              <div class="grid g-2" style="gap: 10px;">
                <div class="field"><label>Bank Account</label><input class="input mono" placeholder="KSB·00XXXXX" [(ngModel)]="newWorker.acct" /></div>
                <div class="field"><label>Aadhaar Number</label><input class="input mono" placeholder="XXXX-XXXX-XXXX" [(ngModel)]="newWorker.aadhar" /></div>
              </div>
              <div class="field"><label>Day Rate (₹)</label><input class="input mono" type="number" [(ngModel)]="newWorker.wage" /></div>
            </div>
            <div class="card-foot" style="justify-content: flex-end; gap: 8px;">
              <button class="btn ghost sm" (click)="showAddModal = false">Cancel</button>
              <button class="btn primary sm" (click)="handleAddWorkerSubmit()">Add Worker</button>
            </div>
          </div>
        </div>
      }

      <!-- Edit Worker Modal -->
      @if (showEditModal && editingWorker) {
        <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1100;">
          <div class="card bold" style="width: 500px; background: var(--surface); padding: 0;">
            <div class="card-head" style="justify-content: space-between;">
              <div class="ttl">Edit Worker</div>
              <button class="icon-btn" (click)="showEditModal = false; editingWorker = null;" style="border: none; background: transparent; cursor: pointer; display: flex; align-items: center;"><app-icon name="X" [size]="16"></app-icon></button>
            </div>
            <div class="card-body col" style="gap: 12px; max-height: 70vh; overflow-y: auto;">
              <div class="grid g-2" style="gap: 10px;">
                <div class="field"><label>Employee ID</label><input class="input mono" [value]="editingWorker.id" disabled /></div>
                <div class="field"><label>Joined Date</label><input class="input mono" type="date" [(ngModel)]="editingWorker.join" /></div>
              </div>
              <div class="field"><label>Worker Name (English)</label><input class="input" [(ngModel)]="editingWorker.name" /></div>
              <div class="field"><label>Worker Name (Malayalam)</label><input class="input" [(ngModel)]="editingWorker.ml" /></div>
              <div class="grid g-3" style="gap: 10px;">
                <div class="field"><label>Category</label><select class="select" [(ngModel)]="editingWorker.cat"><option>Permanent</option><option>Casual</option><option>Dependent</option></select></div>
                <div class="field"><label>Role</label><select class="select" [(ngModel)]="editingWorker.role"><option>Tapper</option><option>Coll. Centre Wk.</option><option>General Worker</option><option>Field Supervisor</option><option>Tapping Sup.</option></select></div>
                <div class="field"><label>Block</label><select class="select" [(ngModel)]="editingWorker.block"><option>KLP-B07</option><option>KLP-B08</option><option>KLP-B12</option><option>—</option></select></div>
              </div>
              <div class="grid g-2" style="gap: 10px;">
                <div class="field"><label>Bank Account</label><input class="input mono" [(ngModel)]="editingWorker.acct" /></div>
                <div class="field"><label>Aadhaar Number</label><input class="input mono" [(ngModel)]="editingWorker.aadhar" /></div>
              </div>
              <div class="field"><label>Day Rate (₹)</label><input class="input mono" type="number" [(ngModel)]="editingWorker.wage" /></div>
            </div>
            <div class="card-foot" style="justify-content: flex-end; gap: 8px;">
              <button class="btn ghost sm" (click)="showEditModal = false; editingWorker = null;">Cancel</button>
              <button class="btn primary sm" (click)="handleEditWorkerSubmit()">Save Changes</button>
            </div>
          </div>
        </div>
      }

      <div class="card bold mb-16">
        <div class="card-head"><div class="ttl">Quick mark</div></div>
        <div class="card-body">
           <div class="row gap-8">
             <input 
               class="input mono" 
               placeholder="Scan ID / type EMP-..."
               [(ngModel)]="scanId"
               (keydown.enter)="handleScan()"
               style="max-width: 300px;"
             />
             <button 
               class="icon-btn"
               [ngClass]="{ 'scanning': isScanning }"
               (click)="handleScan()"
               [disabled]="isScanning"
             >
               @if (isScanning) { <span>...</span> } @else { <app-icon name="Fingerprint"></app-icon> }
             </button>
           </div>
        </div>
      </div>

      <div class="grid g-4 mb-16">
        <div class="kpi">
          <div class="label">Permanent · സ്ഥിരം</div>
          <div class="value">{{ cats().Permanent }}<span class="unit">workers</span></div>
          <div class="delta">8 retiring this quarter</div>
        </div>
        <div class="kpi">
          <div class="label">Casual</div>
          <div class="value">{{ cats().Casual }}<span class="unit">workers</span></div>
          <div class="delta">12 added this month</div>
        </div>
        <div class="kpi">
          <div class="label">Dependent</div>
          <div class="value">{{ cats().Dependent }}<span class="unit">workers</span></div>
          <div class="delta">2 awaiting documents</div>
        </div>
        <div class="kpi">
          <div class="label">Total</div>
          <div class="value">{{ cats().Total }}<span class="unit">workers</span></div>
          <div class="delta">96.7% utilisation today</div>
        </div>
      </div>

      <div class="row mb-16 gap-8" style="flex-wrap: wrap;">
        <div class="topbar-search" style="flex: 0 1 320px;">
          <app-icon name="Search" [size]="14"></app-icon>
          <input placeholder="Search by name, EMP, Aadhaar, account…" [ngModel]="wkSearch()" (ngModelChange)="wkSearch.set($event)" />
        </div>
        <select class="select" style="width: 160px;" [ngModel]="wkCategory()" (ngModelChange)="wkCategory.set($event)">
          <option>All categories</option><option>Permanent</option><option>Casual</option><option>Dependent</option>
        </select>
        <select class="select" style="width: 160px;" [ngModel]="wkRole()" (ngModelChange)="wkRole.set($event)">
          <option>All roles</option><option>Tapper</option><option>Coll. Centre</option><option>General Worker</option><option>Supervisor</option>
        </select>
        <select class="select" style="width: 180px;" [ngModel]="wkBlock()" (ngModelChange)="wkBlock.set($event)">
          <option>All blocks</option><option>KLP-B07</option><option>KLP-B08</option><option>KLP-B12</option>
        </select>
        <div style="margin-left: auto;" class="row gap-8">
          <span class="muted" style="font-size: 12px;">Showing {{ filteredWorkers().length }} of {{ cats().Total }}</span>
          <button class="btn ghost sm" (click)="onAction('Filtering workers: Category = ' + wkCategory() + ', Role = ' + wkRole() + ', Block = ' + wkBlock() + (wkSearch() ? ', Search = ' + wkSearch() : ''))"><app-icon name="Filter" [size]="13"></app-icon>More filters</button>
        </div>
      </div>

      <div class="card bold">
        <div class="table-responsive">
          <table class="tbl">
            <thead>
              <tr>
                <th>EMP ID</th><th>Name / പേര്</th><th>Category</th><th>Role</th>
                <th>Block</th><th>Joined</th><th>Bank Account</th><th>Aadhaar</th>
                <th class="num">Day rate</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (w of filteredWorkers(); track w.id) {
                <tr>
                  <td class="mono"><b>{{ w.id }}</b></td>
                  <td>
                    <div class="row gap-8">
                      <div class="avatar" style="width: 24px; height: 24px; font-size: 10px; background: var(--bg-3); color: var(--ink);">
                        {{ getInitials(w.name) }}
                      </div>
                      <div>
                        <b>{{ w.name }}</b>
                        <div class="ml muted" style="font-size: 11px;">{{ w.ml }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="w.cat === 'Permanent' ? 'leaf' : (w.cat === 'Casual' ? 'amber' : 'clay')">
                      {{ w.cat[0] }} · {{ w.cat }}
                    </span>
                  </td>
                  <td>{{ w.role }}</td>
                  <td class="mono">{{ w.block }}</td>
                  <td class="mono muted">{{ w.join }}</td>
                  <td class="mono" style="font-size: 12px;">{{ w.acct }}</td>
                  <td class="mono" style="font-size: 12px;">{{ w.aadhar }}</td>
                  <td class="num">₹{{ w.wage }}</td>
                  <td>
                    <div class="row gap-8">
                      <button class="btn ghost sm" style="padding: 3px 6px;" (click)="onAction('Viewing profile: ' + w.name + ' (' + w.id + ')\\nRole: ' + w.role + '\\nBlock: ' + w.block + '\\nBank: ' + w.acct)"><app-icon name="Eye" [size]="13"></app-icon></button>
                      <button class="btn ghost sm" style="padding: 3px 6px;" (click)="openEditModal(w)"><app-icon name="Edit" [size]="13"></app-icon></button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot">
          <span class="muted">Page 1 of 42</span>
          <div style="margin-left: auto;" class="row gap-8">
            <button class="btn ghost sm" (click)="onAction('Loading previous page (page 0 of 42)')">&#x2039; Prev</button>
            <button class="btn ghost sm" (click)="onAction('Loading next page (page 2 of 42)')">Next &#x203a;</button>
          </div>
        </div>
      </div>

      <!-- Org hierarchy strip -->
      <div class="card bold mt-24">
        <div class="card-head"><div class="ttl">Employee hierarchy · Kulathupuzha Estate</div></div>
        <div class="card-body" style="padding: 24px;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
            <app-hierarchy-node title="Managing Director" name="Dr. K. Vasudevan IAS" sub="SFCK HQ"></app-hierarchy-node>
            <div style="width: 2px; height: 14px; background: var(--rule-soft);"></div>
            <app-hierarchy-node title="General Manager" name="Ratheesh K." sub="Plantations & Operations"></app-hierarchy-node>
            <div style="width: 2px; height: 14px; background: var(--rule-soft);"></div>
            <app-hierarchy-node title="Estate Manager" name="P. Suresh Kumar" sub="Kulathupuzha" [highlight]="true"></app-hierarchy-node>
            <div style="width: 2px; height: 14px; background: var(--rule-soft);"></div>
            <app-hierarchy-node title="Assistant Estate Manager" name="Lakshmi Menon"></app-hierarchy-node>
            <div style="width: 2px; height: 14px; background: var(--rule-soft);"></div>
            <app-hierarchy-node title="Field Officer" name="Asha M."></app-hierarchy-node>
            <div style="width: 2px; height: 14px; background: var(--rule-soft);"></div>
            <div style="display: flex; gap: 32px; justify-content: center;">
              <app-hierarchy-node title="Field Supervisor" name="Reena Vijayan" sub="EMP-1830"></app-hierarchy-node>
              <app-hierarchy-node title="Tapping Supervisor" name="Vinod Raj" sub="EMP-1944"></app-hierarchy-node>
            </div>
            <div style="display: flex; gap: 24px; margin-top: 14px;">
              <app-hierarchy-node title="Coll. Centre Worker" name="Beena Thomas + 17" sub="grade C5" [small]="true"></app-hierarchy-node>
              <app-hierarchy-node title="Tappers" name="Rajan, Lekha + 410" sub="grade T2/T3" [small]="true"></app-hierarchy-node>
              <app-hierarchy-node title="General Workers" name="Mohanan + 63" sub="permanent/casual" [small]="true"></app-hierarchy-node>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WorkersComponent {
  dataService = inject(DataService);
  workers = this.dataService.workers;

  wkCategory = signal('All categories');
  wkRole = signal('All roles');
  wkBlock = signal('All blocks');
  wkSearch = signal('');

  showAddModal = false;
  newWorker: Worker = this.getEmptyWorker();

  showEditModal = false;
  editingWorker: Worker | null = null;

  scanId = '';
  isScanning = false;

  getEmptyWorker(): Worker {
    return {
      id: '',
      name: '',
      ml: '',
      cat: 'Permanent',
      role: 'Tapper',
      block: 'KLP-B07',
      join: new Date().toISOString().split('T')[0],
      acct: '',
      aadhar: '',
      wage: 712,
      st: 'present',
      in: '—',
      out: '—',
      hr: 0,
      task: '—',
      estate: 'KLP',
      verified: false
    };
  }

  getInitials(name: string) {
    return name.split(' ').map(x => x[0]).join('').slice(0, 2);
  }

  cats = computed(() => {
    const wks = this.workers();
    const countPerm = wks.filter(w => w.cat === 'Permanent').length + 403;
    const countCas = wks.filter(w => w.cat === 'Casual').length + 62;
    const countDep = wks.filter(w => w.cat === 'Dependent').length + 17;
    return {
      Permanent: countPerm,
      Casual: countCas,
      Dependent: countDep,
      Total: countPerm + countCas + countDep
    };
  });

  filteredWorkers = computed(() => {
    return this.workers().filter(w => {
      if (this.wkSearch().trim()) {
        const q = this.wkSearch().toLowerCase();
        const matchName = w.name.toLowerCase().includes(q) || (w.ml && w.ml.toLowerCase().includes(q));
        const matchId = w.id.toLowerCase().includes(q);
        const matchAad = w.aadhar && w.aadhar.toLowerCase().includes(q);
        const matchAcc = w.acct && w.acct.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchAad && !matchAcc) return false;
      }

      if (this.wkCategory() !== 'All categories' && w.cat !== this.wkCategory()) return false;

      if (this.wkRole() !== 'All roles') {
        const roleMap: any = {
          'Tapper': 'Tapper',
          'Coll. Centre': 'Coll. Centre Wk.',
          'General Worker': 'General Worker',
          'Supervisor': ['Field Supervisor', 'Tapping Sup.']
        };
        const allowedRoles = roleMap[this.wkRole()];
        if (Array.isArray(allowedRoles)) {
          if (!allowedRoles.includes(w.role)) return false;
        } else {
          if (w.role !== allowedRoles) return false;
        }
      }

      if (this.wkBlock() !== 'All blocks' && w.block !== this.wkBlock()) return false;

      return true;
    });
  });

  handleAddWorkerSubmit() {
    if (!this.newWorker.id || !this.newWorker.name) {
      alert('Please fill in both Employee ID and Name.');
      return;
    }
    if (this.workers().some(w => w.id.toUpperCase() === this.newWorker.id.toUpperCase())) {
      alert(`Employee ID ${this.newWorker.id} already exists.`);
      return;
    }
    this.dataService.updateWorkers(prev => [...prev, { ...this.newWorker }]);
    this.showAddModal = false;
    this.newWorker = this.getEmptyWorker();
    alert('Worker added successfully!');
  }

  openEditModal(w: Worker) {
    this.editingWorker = { ...w };
    this.showEditModal = true;
  }

  handleEditWorkerSubmit() {
    if (!this.editingWorker || !this.editingWorker.id || !this.editingWorker.name) {
      alert('Please fill in both Employee ID and Name.');
      return;
    }
    const editId = this.editingWorker.id;
    this.dataService.updateWorkers(prev => prev.map(w => w.id === editId ? { ...this.editingWorker! } : w));
    this.showEditModal = false;
    this.editingWorker = null;
    alert('Worker updated successfully!');
  }

  handleScan() {
    if (!this.scanId.trim()) return;
    this.isScanning = true;
    setTimeout(() => {
      this.isScanning = false;
      this.dataService.updateWorkers(prev => prev.map(w => {
        if (w.id.toUpperCase() === this.scanId.toUpperCase()) {
          const now = new Date();
          return {
            ...w,
            st: 'present',
            in: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
          };
        }
        return w;
      }));
      this.scanId = '';
      alert('Authentication Success: Marked Present');
    }, 1500);
  }

  onAction(msg: string) {
    alert(msg);
  }
}
