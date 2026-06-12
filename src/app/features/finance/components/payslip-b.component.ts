import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-payslip-b',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ml" style="max-width: 780px; margin: 0 auto; background: var(--surface); border: 2.5px solid var(--ink); padding: 24px;">
      <div style="text-align: center; border-bottom: 2px solid var(--ink); padding-bottom: 14px; margin-bottom: 14px;">
        <div style="font-size: 11px; font-family: var(--font-sans); letter-spacing: 0.06em; color: var(--ink-3);">GOVERNMENT OF KERALA · കേരള സർക്കാർ ഉടമസ്ഥതയിലുള്ളത്</div>
        <div style="font-size: 24px; font-weight: 700; margin-top: 4px;">കേരള സ്റ്റേറ്റ് ഫാമിംഗ് കോർപ്പറേഷൻ ലിമിറ്റഡ്</div>
        <div style="font-size: 13px; margin-top: 2px;">കുളത്തുപ്പുഴ എസ്റ്റേറ്റ്</div>
        <div style="font-size: 18px; font-weight: 700; margin-top: 8px; border: 1.5px solid var(--ink); display: inline-block; padding: 4px 18px;">വേതന ചീട്ട് · {{ p.period_ml }}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 12px;">
        <tbody>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>തൊഴിലാളിയുടെ പേര്:</b> രാജൻ പിള്ള</td>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>തൊഴിലാളി നം.:</b> <span class="mono">EMP-1042</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>വിഭാഗം:</b> സ്ഥിരം · T2</td>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>ബ്ലോക്ക്:</b> <span class="mono">KLP-B07</span> കല്ലാർകുട്ടി B7</td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>റോൾ:</b> ടാപ്പർ</td>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>ബാങ്ക് അക്കൗണ്ട്:</b> <span class="mono">{{ p.emp.acct }}</span></td>
          </tr>
          <tr>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>പ്രവൃത്തി ദിവസം:</b> 26</td>
            <td style="padding: 6px 8px; border: 1px solid var(--rule-soft);"><b>ഹാജർ:</b> 24 · അവധി: 2</td>
          </tr>
        </tbody>
      </table>

      <div class="grid g-2" style="gap: 0;">
        <div style="border: 1.5px solid var(--ink);">
          <div style="padding: 6px 10px; background: var(--ink); color: var(--bg); font-weight: 700; text-align: center;">വരവ്</div>
          <table style="width: 100%; font-size: 13px;">
            <tbody>
              @for (r of p.earnings; track r.code) {
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid var(--rule-soft);">{{ r.desc_ml }}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid var(--rule-soft); text-align: right; font-family: var(--font-mono);">₹{{ r.amount.toLocaleString('en-IN') }}</td>
                </tr>
              }
              <tr>
                <td style="padding: 8px 10px; font-weight: 700;">മൊത്തം</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 700; font-family: var(--font-mono);">₹{{ earningsTotal.toLocaleString('en-IN') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="border: 1.5px solid var(--ink); border-left: none;">
          <div style="padding: 6px 10px; background: var(--ink); color: var(--bg); font-weight: 700; text-align: center;">കിഴിവുകൾ</div>
          <table style="width: 100%; font-size: 13px;">
            <tbody>
              @for (r of p.deductions; track r.code) {
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid var(--rule-soft);">{{ r.desc_ml }}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid var(--rule-soft); text-align: right; font-family: var(--font-mono);">₹{{ r.amount.toLocaleString('en-IN') }}</td>
                </tr>
              }
              <tr>
                <td style="padding: 8px 10px; font-weight: 700;">മൊത്തം</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 700; font-family: var(--font-mono);">₹{{ dedTotal.toLocaleString('en-IN') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-top: 14px; padding: 14px; border: 2.5px solid var(--ink); text-align: center;">
        <div style="font-size: 13px; font-weight: 600;">അറ്റ വേതനം</div>
        <div class="mono" style="font-size: 32px; font-weight: 800;">₹{{ net.toLocaleString('en-IN') }}.00</div>
        <div style="font-size: 12px; margin-top: 4px;">ഇരുപത്തിനാലായിരത്തി അഞ്ഞൂറ്റി മുപ്പത്തിരണ്ട് രൂപ മാത്രം</div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px; font-size: 12px;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid var(--ink); padding-top: 6px; min-width: 160px;">ഫീൽഡ് സൂപ്പർവൈസർ</div>
          <div style="font-size: 11px; margin-top: 2px;">റീന വിജയൻ</div>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid var(--ink); padding-top: 6px; min-width: 160px;">എസ്റ്റേറ്റ് മാനേജർ</div>
          <div style="font-size: 11px; margin-top: 2px;">പി. സുരേഷ് കുമാർ</div>
        </div>
      </div>
    </div>
  `
})
export class PayslipBComponent {
  dataService = inject(DataService);
  
  get p(): any { return this.dataService.payslip; }
  get earningsTotal() { return this.p.earnings.reduce((s: number, r: any) => s + r.amount, 0); }
  get dedTotal() { return this.p.deductions.reduce((s: number, r: any) => s + r.amount, 0); }
  get net() { return this.earningsTotal - this.dedTotal; }
}
