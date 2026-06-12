import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    @if (type === 'aptivora') {
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 32 32" fill="none">
        <rect x="0" y="0" width="32" height="32" rx="6" fill="currentColor"/>
        <path d="M9 8 Q9 22 16 22 Q23 22 23 15 Q23 11 19 11 Q15 11 15 14 Q15 16 17 16"
              stroke="var(--accent-ink, #fff)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <circle cx="22" cy="22" r="2" fill="var(--accent-ink, #fff)"/>
      </svg>
    } @else if (type === 'sfck') {
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 32 32" fill="none">
        <rect x="0" y="0" width="32" height="32" rx="6" fill="currentColor"/>
        <text x="16" y="14" text-anchor="middle"
              font-family="Manrope, sans-serif" font-weight="800" font-size="9"
              fill="var(--accent-ink, #fff)" letter-spacing="0.5">SFCK</text>
        <line x1="6" y1="17" x2="26" y2="17" stroke="var(--accent-ink, #fff)" stroke-width="0.75" opacity="0.5"/>
        <path d="M16 20 C 13 23, 13 26, 16 26 C 19 26, 19 23, 16 20 Z"
              fill="var(--accent-ink, #fff)"/>
      </svg>
    }
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; }']
})
export class LogoComponent {
  @Input() type: 'aptivora' | 'sfck' = 'aptivora';
  @Input() size: number | string = 28;
}
