import { Injectable, signal, effect } from '@angular/core';

export const TWEAK_DEFAULTS = {
  theme: "light",
  accent: "clay",
  lang: "both",
  dashVariant: "A",
  dpsVariant: "A",
  payslipVariant: "A",
  density: "balanced"
};

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  theme = signal(TWEAK_DEFAULTS.theme);
  accent = signal(TWEAK_DEFAULTS.accent);
  lang = signal(TWEAK_DEFAULTS.lang);
  dashVariant = signal(TWEAK_DEFAULTS.dashVariant);
  dpsVariant = signal(TWEAK_DEFAULTS.dpsVariant);
  payslipVariant = signal(TWEAK_DEFAULTS.payslipVariant);
  density = signal(TWEAK_DEFAULTS.density);
  tweaksOpen = signal(false);

  constructor() {
    this.initFromLocalStorage();

    // Effect to apply theme and accent to document
    effect(() => {
      document.documentElement.dataset['theme'] = this.theme();
      document.documentElement.dataset['accent'] = this.accent();
    });
  }

  private initFromLocalStorage() {
    try {
      const saved = localStorage.getItem('aptivora_tweaks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) this.theme.set(parsed.theme);
        if (parsed.accent) this.accent.set(parsed.accent);
        if (parsed.lang) this.lang.set(parsed.lang);
        if (parsed.dashVariant) this.dashVariant.set(parsed.dashVariant);
        if (parsed.dpsVariant) this.dpsVariant.set(parsed.dpsVariant);
        if (parsed.payslipVariant) this.payslipVariant.set(parsed.payslipVariant);
        if (parsed.density) this.density.set(parsed.density);
      }
    } catch (e) {
      console.error("Error reading tweaks from local storage", e);
    }
  }

  private saveToLocalStorage() {
    const data = {
      theme: this.theme(),
      accent: this.accent(),
      lang: this.lang(),
      dashVariant: this.dashVariant(),
      dpsVariant: this.dpsVariant(),
      payslipVariant: this.payslipVariant(),
      density: this.density()
    };
    localStorage.setItem('aptivora_tweaks', JSON.stringify(data));
  }

  setTweak(key: string, value: string) {
    switch(key) {
      case 'theme': this.theme.set(value); break;
      case 'accent': this.accent.set(value); break;
      case 'lang': this.lang.set(value); break;
      case 'dashVariant': this.dashVariant.set(value); break;
      case 'dpsVariant': this.dpsVariant.set(value); break;
      case 'payslipVariant': this.payslipVariant.set(value); break;
      case 'density': this.density.set(value); break;
    }
    this.saveToLocalStorage();
  }

  toggleTweaks() {
    this.tweaksOpen.set(!this.tweaksOpen());
  }
}
