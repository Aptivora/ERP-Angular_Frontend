import { Component, Input, inject } from '@angular/core';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'app-page-head',
  standalone: true,
  template: `
    <div class="page-head">
      <div style="min-width: 0;">
        @if (config.lang() === 'en' || config.lang() === 'both' || !ml) {
          <div class="page-title">{{ title }}</div>
        }
        @if (ml && (config.lang() === 'ml' || config.lang() === 'both')) {
          @if (config.lang() === 'both') {
            <div class="ml muted" style="font-size: 15px; margin-top: 4px; font-weight: 600;">{{ ml }}</div>
          } @else {
            <div class="page-title ml">{{ ml }}</div>
          }
        }
        @if (sub) {
          <div class="page-sub">{{ sub }}</div>
        }
        <ng-content select="[content]"></ng-content>
      </div>
      <div class="page-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeadComponent {
  @Input() title!: string;
  @Input() ml?: string;
  @Input() sub?: string;

  public config = inject(AppConfigService);
}
