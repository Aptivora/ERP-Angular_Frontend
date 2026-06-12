import { Injectable, signal, computed, WritableSignal } from '@angular/core';

export interface Worker {
  id: string;
  name: string;
  ml: string;
  cat: string;
  role: string;
  estate: string;
  block: string;
  join: string;
  acct: string;
  aadhar: string;
  wage: number;
  st: string;
  in: string;
  out: string;
  hr: number | string;
  task: string;
  rem?: string;
  verified: boolean;
}

const DEFAULT_WORKERS: Worker[] = [
  { id: 'EMP-1042', name: 'Rajan Pillai', ml: 'രാജൻ പിള്ള', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B07', join: '2011-06-14', acct: 'KSB·0042178', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'present', in: '06:12', out: '13:48', hr: 7.6, task: 'Tapping · 380 trees', verified: true },
  { id: 'EMP-1158', name: 'Lekha Devi', ml: 'ലേഖ ദേവി', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B07', join: '2013-02-01', acct: 'KSB·0051902', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'present', in: '06:08', out: '13:52', hr: 7.7, task: 'Tapping · 380 trees', verified: true },
  { id: 'EMP-1209', name: 'Sasi Kumar', ml: 'ശശി കുമാർ', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B08', join: '2009-11-22', acct: 'KSB·0034812', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'present', in: '06:18', out: '14:04', hr: 7.8, task: 'Tapping · 360 trees', verified: true },
  { id: 'EMP-1276', name: 'Beena Thomas', ml: 'ബീന തോമസ്', cat: 'Permanent', role: 'Coll. Centre Wk.', estate: 'KLP', block: '—', join: '2015-05-10', acct: 'KSB·0062201', aadhar: '[Aadhaar Redacted]', wage: 686, st: 'present', in: '07:00', out: '15:00', hr: 8.0, task: 'Coll. Centre weighing', verified: true },
  { id: 'EMP-1311', name: 'Suresh Babu', ml: 'സുരേഷ് ബാബു', cat: 'Casual', role: 'General Worker', estate: 'KLP', block: 'KLP-B12', join: '2024-01-08', acct: 'KSB·0078442', aadhar: '[Aadhaar Redacted]', wage: 612, st: 'absent', in: '—', out: '—', hr: 0, task: '—', rem: '3rd consecutive · notify FO', verified: false },
  { id: 'EMP-1402', name: 'Mini Joseph', ml: 'മിനി ജോസഫ്', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B12', join: '2010-09-30', acct: 'KSB·0039518', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'present', in: '06:05', out: '13:42', hr: 7.6, task: 'Tapping · 412 trees', verified: true },
  { id: 'EMP-1505', name: 'Anil Kumar', ml: 'അനിൽ കുമാർ', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B27', join: '2014-07-18', acct: 'KSB·0058773', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'leave', in: '—', out: '—', hr: 0, task: 'CL', rem: 'Casual leave approved', verified: true },
  { id: 'EMP-1617', name: 'Geetha Mohan', ml: 'ഗീത മോഹൻ', cat: 'Permanent', role: 'Tapper', estate: 'KLP', block: 'KLP-B27', join: '2008-04-25', acct: 'KSB·0028104', aadhar: '[Aadhaar Redacted]', wage: 712, st: 'present', in: '06:14', out: '13:46', hr: 7.5, task: 'Tapping · 405 trees', verified: true },
  { id: 'EMP-1721', name: 'Mohanan Nair', ml: 'മോഹനൻ നായർ', cat: 'Dependent', role: 'General Worker', estate: 'KLP', block: 'KLP-B07', join: '2022-03-14', acct: 'KSB·0071285', aadhar: '[Aadhaar Redacted]', wage: 612, st: 'present', in: '07:30', out: '15:30', hr: 8.0, task: 'Block clearing', verified: false },
  { id: 'EMP-1830', name: 'Reena Vijayan', ml: 'റീന വിജയൻ', cat: 'Permanent', role: 'Field Supervisor', estate: 'KLP', block: '—', join: '2007-12-01', acct: 'KSB·0024106', aadhar: '[Aadhaar Redacted]', wage: 980, st: 'present', in: '06:00', out: '—', hr: '—', task: 'Field Supervisor', verified: true },
  { id: 'EMP-1944', name: 'Vinod Raj', ml: 'വിനോദ് രാജ്', cat: 'Permanent', role: 'Tapping Sup.', estate: 'KLP', block: '—', join: '2012-08-22', acct: 'KSB·0048601', aadhar: '[Aadhaar Redacted]', wage: 920, st: 'present', in: '06:00', out: '—', hr: '—', task: 'Tapping Supervisor', verified: true },
  { id: 'EMP-2055', name: 'Saritha Anand', ml: 'സരിത ആനന്ദ്', cat: 'Casual', role: 'Tapper', estate: 'KLP', block: 'KLP-B08', join: '2024-08-01', acct: 'KSB·0079904', aadhar: '[Aadhaar Redacted]', wage: 660, st: 'present', in: '06:22', out: '13:58', hr: 7.6, task: 'Tapping · 350 trees', verified: true },
];

@Injectable({
  providedIn: 'root'
})
export class DataService {
  estates = [
    { id: 'KLP', name: 'Kulathupuzha Estate', ml: 'കുളത്തുപ്പുഴ എസ്റ്റേറ്റ്', hectares: 1240, blocks: 38, tappers: 412, mgr: 'P. Suresh Kumar' },
    { id: 'PNR', name: 'Punalur Estate', ml: 'പുനലൂർ എസ്റ്റേറ്റ്', hectares: 980, blocks: 28, tappers: 318, mgr: 'K. Anitha' },
    { id: 'THD', name: 'Thodupuzha Estate', ml: 'തൊടുപുഴ എസ്റ്റേറ്റ്', hectares: 1120, blocks: 32, tappers: 366, mgr: 'V. Ramesan' },
    { id: 'ATR', name: 'Athirappilly Estate', ml: 'അതിരപ്പിള്ളി എസ്റ്റേറ്റ്', hectares: 870, blocks: 24, tappers: 281, mgr: 'M. Latha' },
    { id: 'KLR', name: 'Kallar Estate', ml: 'കല്ലാർ എസ്റ്റേറ്റ്', hectares: 750, blocks: 22, tappers: 246, mgr: 'S. Babu' },
  ];

  divisions = ['North', 'South', 'East', 'West', 'Central'];

  blocks = [
    { id: 'KLP-B07', estate: 'KLP', name: 'Kallarkutty B7', division: 'North', hectares: 32.5, trees: 14250, maturity: 'Mature', cycle: 'D1', tappers: 12 },
    { id: 'KLP-B08', estate: 'KLP', name: 'Kallarkutty B8', division: 'North', hectares: 28.2, trees: 12640, maturity: 'Mature', cycle: 'D2', tappers: 10 },
    { id: 'KLP-B12', estate: 'KLP', name: 'Aryankavu A', division: 'South', hectares: 41.8, trees: 18100, maturity: 'Mature', cycle: 'D3', tappers: 15 },
    { id: 'KLP-B19', estate: 'KLP', name: 'Vilakkupara V2', division: 'East', hectares: 22.4, trees: 9820, maturity: 'Immature', cycle: '—', tappers: 0 },
    { id: 'KLP-B23', estate: 'KLP', name: 'Edamon E3', division: 'West', hectares: 18.6, trees: 7340, maturity: 'CUT', cycle: '—', tappers: 0 },
    { id: 'KLP-B27', estate: 'KLP', name: 'Tenmala T1', division: 'Central', hectares: 35.0, trees: 15400, maturity: 'Mature', cycle: 'D4', tappers: 14 }
  ];

  dpsRows = [
    { emp: 'EMP-1042', name: 'Rajan Pillai', block: 'KLP-B07', cycle: 'D1', trees: 380, cups: 364, latex: 32.4, scrap: 3.1, drc: 33.8, status: 'verified' },
    { emp: 'EMP-1158', name: 'Lekha Devi', block: 'KLP-B07', cycle: 'D1', trees: 380, cups: 371, latex: 34.1, scrap: 2.8, drc: 34.2, status: 'verified' },
    { emp: 'EMP-1209', name: 'Sasi Kumar', block: 'KLP-B08', cycle: 'D2', trees: 360, cups: 348, latex: 29.6, scrap: 2.4, drc: 32.9, status: 'verified' },
    { emp: 'EMP-1402', name: 'Mini Joseph', block: 'KLP-B12', cycle: 'D3', trees: 412, cups: 392, latex: 36.8, scrap: 3.4, drc: 33.5, status: 'verified' },
    { emp: 'EMP-1505', name: 'Anil Kumar', block: 'KLP-B27', cycle: 'D4', trees: 405, cups: 388, latex: 35.2, scrap: 3.0, drc: 34.0, status: 'pending' },
    { emp: 'EMP-1617', name: 'Geetha Mohan', block: 'KLP-B27', cycle: 'D4', trees: 405, cups: 401, latex: 38.6, scrap: 3.2, drc: 34.6, status: 'pending' },
    { emp: 'EMP-2055', name: 'Saritha Anand', block: 'KLP-B08', cycle: 'D2', trees: 350, cups: 318, latex: 26.8, scrap: 2.1, drc: 31.4, status: 'pending' },
  ];

  prodTrend = [
    { d: 'Mon', latex: 8420, scrap: 740, base: 8200, target: 9000 },
    { d: 'Tue', latex: 8612, scrap: 760, base: 8200, target: 9000 },
    { d: 'Wed', latex: 9104, scrap: 812, base: 8200, target: 9000 },
    { d: 'Thu', latex: 8946, scrap: 798, base: 8200, target: 9000 },
    { d: 'Fri', latex: 9268, scrap: 840, base: 8200, target: 9000 },
    { d: 'Sat', latex: 8804, scrap: 770, base: 8200, target: 9000 },
    { d: 'Sun', latex: 9420, scrap: 880, base: 8200, target: 9000 },
  ];

  inventory = [
    { sku: 'CHM-AMM-25', name: 'Ammonia 25% (Bulk)', ml: 'അമോണിയ 25%', uom: 'L', stock: 2840, min: 1500, max: 5000, location: 'CC-Main', unit: 84, status: 'ok' },
    { sku: 'CHM-AMM-DR', name: 'Ammonia Drum 200L', ml: 'അമോണിയ ഡ്രം', uom: 'Drum', stock: 14, min: 8, max: 30, location: 'CC-Main', unit: 16800, status: 'ok' },
    { sku: 'FRT-RP-08', name: 'Rubber Mix 10:10:4:1.5', ml: 'റബർ മിക്സ്', uom: 'kg', stock: 4250, min: 3000, max: 8000, location: 'Store-A', unit: 32, status: 'ok' },
    { sku: 'FRT-MOP', name: 'Muriate of Potash', ml: 'മ്യൂറിയറ്റ് പൊട്ടാഷ്', uom: 'kg', stock: 1180, min: 1500, max: 4000, location: 'Store-A', unit: 28, status: 'low' },
    { sku: 'FRT-DAP', name: 'Di-Ammonium Phosphate', ml: 'ഡി-അമോണിയം', uom: 'kg', stock: 620, min: 1000, max: 3000, location: 'Store-B', unit: 36, status: 'low' },
    { sku: 'SUP-CUP', name: 'Latex Cup (HDPE)', ml: 'ലാറ്റക്സ് കപ്പ്', uom: 'pcs', stock: 1840, min: 2000, max: 6000, location: 'Store-A', unit: 14, status: 'low' },
    { sku: 'SUP-TAP', name: 'Tapping Knife', ml: 'ടാപ്പിംഗ് കത്തി', uom: 'pcs', stock: 86, min: 30, max: 120, location: 'Store-A', unit: 340, status: 'ok' },
    { sku: 'SUP-RAIN', name: 'Rainguard Polythene', ml: 'റെയിൻഗാർഡ്', uom: 'roll', stock: 28, min: 20, max: 60, location: 'Store-B', unit: 1240, status: 'ok' },
  ];

  payslip = {
    period: '21 Apr – 20 May 2026',
    period_ml: '2026 ഏപ്രിൽ 21 – മേയ് 20',
    emp: DEFAULT_WORKERS[0],
    days_worked: 26,
    days_present: 24,
    days_leave: 2,
    earnings: [
      { code: 'BASIC', desc: 'Basic Wages', desc_ml: 'അടിസ്ഥാന വേതനം', amount: 18512 },
      { code: 'DA', desc: 'Dearness Allowance', desc_ml: 'ക്ഷാമബത്ത', amount: 4628 },
      { code: 'HRA', desc: 'House Rent Allowance', desc_ml: 'വീട്ടുവാടക ബത്ത', amount: 1480 },
      { code: 'HL', desc: 'Head-Load Charge (1402 kg × ₹0.84)', desc_ml: 'ഹെഡ്-ലോഡ് ചാർജ്', amount: 1178 },
      { code: 'INCN', desc: 'DRC Incentive (above base)', desc_ml: 'ഉൽപാദന ഇൻസെന്റീവ്', amount: 2840 },
      { code: 'OT', desc: 'Overtime (4 hrs)', desc_ml: 'ഓവർടൈം (4 മണി)', amount: 312 },
    ],
    deductions: [
      { code: 'PF', desc: 'Provident Fund (12%)', desc_ml: 'പ്രൊവിഡന്റ് ഫണ്ട്', amount: 2221 },
      { code: 'ESI', desc: 'ESI (0.75%)', desc_ml: 'ഇ.എസ്.ഐ', amount: 217 },
      { code: 'ADV', desc: 'Advance Recovery', desc_ml: 'അഡ്വാൻസ് റിക്കവറി', amount: 1500 },
      { code: 'COOP', desc: 'Estate Co-op Society', desc_ml: 'സഹകരണ സംഘം', amount: 400 },
      { code: 'WLF', desc: 'Welfare Fund', desc_ml: 'ക്ഷേമനിധി', amount: 80 },
    ],
  };

  tappingCycle = [
    { day: 'D1', blocks: ['Kallarkutty B7', 'Aryankavu C', 'Tenmala T3', 'Edamon E1'], trees: 38420, supervisors: ['Vinod Raj', 'Reena Vijayan'] },
    { day: 'D2', blocks: ['Kallarkutty B8', 'Vilakkupara V1', 'Tenmala T4', 'Edamon E2'], trees: 36210, supervisors: ['Vinod Raj', 'Reena Vijayan'] },
    { day: 'D3', blocks: ['Aryankavu A', 'Aryankavu B', 'Tenmala T5', 'Anchal A'], trees: 39860, supervisors: ['Vinod Raj', 'Reena Vijayan'] },
    { day: 'D4', blocks: ['Tenmala T1', 'Tenmala T2', 'Vilakkupara V2', 'Punalur P1'], trees: 35480, supervisors: ['Vinod Raj', 'Reena Vijayan'] },
  ];

  // Persistent workers signal
  workers = signal<Worker[]>([]);
  dpsSignal = signal<any[]>(this.dpsRows);

  updateDpsRow(emp: string, field: string, value: any) {
    this.dpsSignal.update(rows => rows.map(r => r.emp === emp ? { ...r, [field]: value } : r));
  }

  addDpsRow(row: any) {
    this.dpsSignal.update(rows => [...rows, row]);
  }

  constructor() {
    this.initWorkers();
  }

  private initWorkers() {
    try {
      const saved = localStorage.getItem('aptivora_workers');
      if (saved) {
        this.workers.set(JSON.parse(saved));
      } else {
        localStorage.setItem('aptivora_workers', JSON.stringify(DEFAULT_WORKERS));
        this.workers.set(DEFAULT_WORKERS);
      }
    } catch (e) {
      console.error("[DataService] Error parsing aptivora_workers", e);
      this.workers.set(DEFAULT_WORKERS);
    }
  }

  updateWorkers(updater: (workers: Worker[]) => Worker[]) {
    this.workers.update(current => {
      const updated = updater(current);
      localStorage.setItem('aptivora_workers', JSON.stringify(updated));
      return updated;
    });
  }

  // Use persistent data logic mimicking window.usePersistentData
  createPersistentSignal<T>(key: string, fallback: T): [WritableSignal<T>, (val: T | ((prev: T) => T)) => void] {
    const saved = localStorage.getItem(key);
    let initial = fallback;
    if (saved) {
      try {
        initial = JSON.parse(saved);
      } catch (e) {
        console.error(`Error parsing localStorage for ${key}`, e);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(fallback));
    }

    const sig = signal<T>(initial);

    const setter = (valOrUpdater: T | ((prev: T) => T)) => {
      sig.update(prev => {
        const newVal = typeof valOrUpdater === 'function' ? (valOrUpdater as any)(prev) : valOrUpdater;
        localStorage.setItem(key, JSON.stringify(newVal));
        return newVal;
      });
    };

    return [sig, setter];
  }
}
