import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { DpsAComponent } from './components/dps-a.component';
import { DpsBComponent } from './components/dps-b.component';
import { DpsCComponent } from './components/dps-c.component';
import { AppConfigService } from '../../core/services/app-config.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-dps',
  standalone: true,
  imports: [CommonModule, PageHeadComponent, DpsAComponent, DpsBComponent, DpsCComponent, BiComponent],
  template: `
    <div class="page">
      <app-page-head
        title="Daily Production Statement"
        ml="ദൈനംദിന ഉൽപാദന സ്റ്റേറ്റ്മെൻ്റ്"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="dps_sub"></app-bi></div>
        </ng-container>
      </app-page-head>
      
      @switch (variant()) {
        @case ('A') { <app-dps-a></app-dps-a> }
        @case ('B') { <app-dps-b></app-dps-b> }
        @case ('C') { <app-dps-c></app-dps-c> }
        @default { <app-dps-a></app-dps-a> }
      }
    </div>
  `
})
export class DpsComponent {
  private config = inject(AppConfigService);
  
  // Use dashVariant or define a separate setting if needed, 
  // here we reuse dashVariant or default to 'A' based on the React implementation
  variant = () => this.config.dashVariant() || 'A';
}
