import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sfck-mark',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 32 32" fill="none">
      <rect x="0" y="0" width="32" height="32" rx="6" fill="currentColor"/>
      <text x="16" y="14" text-anchor="middle"
            font-family="Manrope, sans-serif" font-weight="800" font-size="9"
            fill="var(--accent-ink, #fff)" letter-spacing="0.5">SFCK</text>
      <line x1="6" y1="17" x2="26" y2="17" stroke="var(--accent-ink, #fff)" stroke-width="0.75" opacity="0.5"/>
      <path d="M16 20 C 13 23, 13 26, 16 26 C 19 26, 19 23, 16 20 Z"
            fill="var(--accent-ink, #fff)"/>
    </svg>
  `
})
export class SfckMarkComponent {
  @Input() size: number | string = 28;
}
