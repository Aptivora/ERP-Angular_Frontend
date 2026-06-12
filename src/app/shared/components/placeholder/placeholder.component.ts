import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div class="page">
      <div style="max-width: 560px; margin: 80px auto; text-align: center; padding: 32px; border: var(--bd); border-radius: 8px; background: var(--surface);">
        <div class="page-title mt-16">{{ title }}</div>
        <div class="muted mt-8">
          This feature is currently being migrated from React to Angular.
        </div>
      </div>
    </div>
  `
})
export class PlaceholderComponent {
  @Input() title = 'Under Construction';
}
