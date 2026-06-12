import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

import { DashSupervisorComponent } from './components/dash-supervisor/dash-supervisor.component';
import { DashAdminComponent } from './components/dash-admin/dash-admin.component';
import { DashAuditorComponent } from './components/dash-auditor/dash-auditor.component';
import { DashWorkerComponent } from './components/dash-worker/dash-worker.component';
import { DashCcWorkerComponent } from './components/dash-cc-worker/dash-cc-worker.component';

@Component({
  selector: 'app-role-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent, 
    PageHeadComponent, 
    IconComponent,
    DashSupervisorComponent,
    DashAdminComponent,
    DashAuditorComponent,
    DashWorkerComponent,
    DashCcWorkerComponent
  ],
  template: `
    @switch (dashView) {
      @case ('exec') {
        <app-dashboard variant="C"></app-dashboard>
      }
      @case ('ops') {
        <app-dashboard variant="A"></app-dashboard>
      }
      @case ('map') {
        <app-dashboard variant="B"></app-dashboard>
      }
      @case ('block') {
        <div class="page">
          <app-page-head
            title="My Day"
            ml="എന്റെ ദിവസം"
            [sub]="role().name + ' · ' + role().title + ' · ' + role().scope"
          >
            <ng-container actions>
              <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
              <button class="btn ghost sm"><app-icon name="Refresh" [size]="13"></app-icon>Refresh</button>
              <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
            </ng-container>
          </app-page-head>
          <app-dash-supervisor [role]="role()"></app-dash-supervisor>
        </div>
      }
      @case ('system') {
        <div class="page">
          <app-page-head
            title="System Overview"
            ml="സിസ്റ്റം"
            sub="Service health · users · integrations · audit"
          >
            <ng-container actions>
              <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
              <button class="btn ghost sm"><app-icon name="Refresh" [size]="13"></app-icon>Refresh</button>
              <a href="#settings" class="btn ghost sm">Open settings</a>
              <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
            </ng-container>
          </app-page-head>
          <app-dash-admin></app-dash-admin>
        </div>
      }
      @case ('audit') {
        <div class="page">
          <app-page-head
            title="Audit Workspace"
            ml="ഓഡിറ്റ് വർക്ക്സ്പേസ്"
            [sub]="'Engagement SFCK/AUD/26-27/04 · ' + role().name"
          >
            <ng-container actions>
              <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
              <button class="btn ghost sm"><app-icon name="Download" [size]="13"></app-icon>Export findings</button>
              <button class="btn ghost sm"><app-icon name="Plus" [size]="13"></app-icon>Raise finding</button>
              <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
            </ng-container>
          </app-page-head>
          <app-dash-auditor></app-dash-auditor>
        </div>
      }
      @case ('worker') {
        <div class="page">
          <app-page-head
            title="My Account"
            ml="എന്റെ അക്കൗണ്ട്"
            [sub]="role().name + ' · ' + role().title + ' · ' + role().empId + ' · ' + (role().block || role().scope)"
          >
            <ng-container actions>
              <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
              <a href="#payslip" class="btn ghost sm"><app-icon name="Download" [size]="13"></app-icon>Payslip</a>
              <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
            </ng-container>
          </app-page-head>
          <app-dash-worker [role]="role()"></app-dash-worker>
        </div>
      }
      @case ('collection') {
        <div class="page">
          <app-page-head
            title="My Day · Collection Centre"
            ml="എന്റെ ദിവസം · കളക്ഷൻ കേന്ദ്രം"
            [sub]="role().name + ' · ' + role().title"
          >
            <ng-container actions>
              <button class="btn ghost sm" (click)="config.toggleTweaks()"><app-icon name="Settings" [size]="13"></app-icon>Tweaks</button>
              <button class="btn ghost sm"><app-icon name="Refresh" [size]="13"></app-icon>Refresh</button>
              <a href="#collection" class="btn ghost sm"><app-icon name="Plus" [size]="13"></app-icon>New intake</a>
              <button class="btn primary sm" (click)="saveChanges()"><app-icon name="Check" [size]="13"></app-icon>Save Changes</button>
            </ng-container>
          </app-page-head>
          <app-dash-cc-worker [role]="role()"></app-dash-cc-worker>
        </div>
      }
      @default {
        <app-dashboard variant="A"></app-dashboard>
      }
    }
  `
})
export class RoleDashboardComponent {
  private auth = inject(AuthService);
  public config = inject(AppConfigService);
  
  role = () => this.auth.authState().role;

  get dashView() {
    return this.role()?.dashView || 'ops';
  }

  saveChanges() {
    window.alert('Changes saved successfully.');
  }
}
