import { Component, Input, computed, inject } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    operations: 'Operations', masters: 'Masters', finance: 'Finance', insight: 'Insight', system: 'System',
    dashboard: 'Dashboard', attendance: 'Attendance', dps: 'Daily Production', collection: 'Collection Centre',
    tapping: 'Tapping Schedule', workers: 'Workers', assets: 'Estate & Blocks', inventory: 'Inventory',
    mazdoor: 'Mazdoor Estimate', payroll: 'Payroll', payslip: 'Payslip', reports: 'Reports', settings: 'Settings',
    field: 'Field App', search_p: 'Search workers, blocks, vouchers…', today: 'Today', yesterday: 'Yesterday'
  },
  ml: {
    operations: 'പ്രവർത്തനങ്ങൾ', masters: 'മാസ്റ്ററുകൾ', finance: 'ധനകാര്യം', insight: 'വിശകലനം', system: 'സിസ്റ്റം',
    dashboard: 'ഡാഷ്ബോർഡ്', attendance: 'ഹാജർ', dps: 'ദൈനംദിന ഉൽപാദനം', collection: 'കളക്ഷൻ കേന്ദ്രം',
    tapping: 'ടാപ്പിംഗ് ഷെഡ്യൂൾ', workers: 'തൊഴിലാളികൾ', assets: 'എസ്റ്റേറ്റ് & ബ്ലോക്കുകൾ', inventory: 'ഇൻവെന്ററി',
    mazdoor: 'മസ്ദൂർ എസ്റ്റിമേറ്റ്', payroll: 'വേതനം', payslip: 'പേസ്ലിപ്പ്', reports: 'റിപ്പോർട്ടുകൾ', settings: 'ക്രമീകരണങ്ങൾ',
    field: 'ഫീൽഡ് ആപ്പ്', search_p: 'തൊഴിലാളികൾ, ബ്ലോക്കുകൾ തിരയുക…', today: 'ഇന്ന്', yesterday: 'ഇന്നലെ'
  }
};

@Component({
  selector: 'app-bi',
  standalone: true,
  template: `
    @if (lang() === 'both') {
      <ng-container>{{ enText }} <span class="ml muted" style="font-weight: 400; font-size: 0.92em;">· {{ mlText }}</span></ng-container>
    } @else if (lang() === 'ml') {
      <span class="ml">{{ mlText }}</span>
    } @else {
      <ng-container>{{ enText }}</ng-container>
    }
  `,
  styles: [':host { display: inline; }']
})
export class BiComponent {
  @Input({ required: true }) k!: string;
  @Input() overrideLang?: string;

  private config = inject(AppConfigService);

  get lang() {
    return computed(() => this.overrideLang || this.config.lang());
  }

  get enText() {
    return TRANSLATIONS['en'][this.k] || this.k;
  }

  get mlText() {
    return TRANSLATIONS['ml'][this.k] || this.k;
  }
}
