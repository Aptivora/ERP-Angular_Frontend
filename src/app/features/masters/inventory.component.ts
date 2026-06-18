import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeadComponent } from '../../shared/components/page-head/page-head.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DataService } from '../../core/services/data.service';
import { PdfExportService } from '../../core/services/pdf-export.service';
import { BiComponent } from '../../shared/components/bi/bi.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeadComponent, IconComponent, BiComponent],
  template: `
    <div class="page" id="inventory-export-content">
      <app-page-head
        title="Inventory & Stock"
        ml="ഇൻവെന്ററി & സ്റ്റോക്ക്"
        [sub]="''"
      >
        <ng-container content>
          <div class="muted mt-4" style="font-size: 13px;"><app-bi k="inv_sub"></app-bi></div>
        </ng-container>
        <ng-container actions>
          <button class="btn ghost sm" (click)="downloadPdf('inventory_report')"><app-icon name="Download" [size]="13"></app-icon><app-bi k="stock_report"></app-bi></button>
          <button class="btn ghost sm" (click)="onAction('Goods Received Note: Enter supplier, PO number, items received.')"><app-bi k="grn"></app-bi></button>
          <button class="btn primary sm" (click)="onAction('+ Issue Voucher: Select item, quantity, destination block, and supervisor.')"><app-icon name="Plus" [size]="13"></app-icon><app-bi k="issue_voucher"></app-bi></button>
        </ng-container>
      </app-page-head>

      <div class="grid g-4 mb-16">
        <div class="kpi"><div class="label"><app-bi k="skus_tracked"></app-bi></div><div class="value">124</div><div class="delta">8 critical low</div></div>
        <div class="kpi"><div class="label"><app-bi k="inv_value"></app-bi></div><div class="value">₹162.4<span class="unit">lakh</span></div><div class="delta">incl. WIP latex stock</div></div>
        <div class="kpi"><div class="label"><app-bi k="issued_week"></app-bi></div><div class="value">₹14.8<span class="unit">lakh</span></div><div class="delta up">↑ 12% vs last week</div></div>
        <div class="kpi"><div class="label"><app-bi k="stockouts"></app-bi></div><div class="value">3<span class="unit">/30d</span></div><div class="delta down">2 due to vendor delay</div></div>
      </div>

      <div class="row mb-16 gap-8" style="flex-wrap: wrap;">
        <div class="topbar-search" style="flex: 0 1 300px;">
          <app-icon name="Search" [size]="14"></app-icon>
          <input placeholder="Search SKU, name…" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
        </div>
        <select class="select" [ngModel]="invCategory()" (ngModelChange)="invCategory.set($event)">
          <option>All categories</option><option>Chemicals</option><option>Fertilizers</option><option>Tools</option><option>Consumables</option>
        </select>
        <select class="select" [ngModel]="invLocation()" (ngModelChange)="invLocation.set($event)">
          <option>All locations</option><option>CC-Main</option><option>Store-A</option><option>Store-B</option>
        </select>
        <select class="select" [ngModel]="invStatus()" (ngModelChange)="invStatus.set($event)">
          <option>All status</option><option>OK</option><option>Low stock</option><option>Critical</option>
        </select>
      </div>

      <div class="grid mb-16" style="grid-template-columns: 2fr 1fr;">
        <div class="card bold">
          <div class="card-head"><div class="ttl"><app-bi k="stock_register"></app-bi></div></div>
          <table class="tbl">
            <thead>
              <tr>
                <th><app-bi k="sku"></app-bi></th><th><app-bi k="item"></app-bi></th><th class="num"><app-bi k="stock"></app-bi></th><th><app-bi k="uom"></app-bi></th>
                <th><app-bi k="reorder"></app-bi></th><th><app-bi k="location"></app-bi></th><th class="num"><app-bi k="unit_rs"></app-bi></th><th class="num"><app-bi k="value"></app-bi></th><th><app-bi k="status"></app-bi></th>
              </tr>
            </thead>
            <tbody>
              @for (it of filteredInventory(); track it.sku) {
                <tr>
                  <td class="mono"><b>{{ it.sku }}</b></td>
                  <td><b>{{ it.name }}</b><div class="ml muted" style="font-size: 11px;">{{ it.ml }}</div></td>
                  <td class="num"><b>{{ it.stock.toLocaleString() }}</b></td>
                  <td>{{ it.uom }}</td>
                  <td>
                    <div class="bar" style="width: 90px;">
                      <i [style.width.%]="getPercent(it.stock, it.max)"
                         [style.background]="it.status === 'low' ? 'var(--oxide)' : 'var(--leaf)'"></i>
                    </div>
                    <div class="mono muted" style="font-size: 10px; margin-top: 2px;">min {{ it.min }} · max {{ it.max }}</div>
                  </td>
                  <td class="mono" style="font-size: 12px;">{{ it.location }}</td>
                  <td class="num">{{ it.unit.toLocaleString() }}</td>
                  <td class="num"><b>₹{{ (it.stock * it.unit).toLocaleString('en-IN') }}</b></td>
                  <td>
                    @if (it.status === 'low') {
                      <span class="badge oxide">Below ROL</span>
                    } @else {
                      <span class="badge leaf">OK</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="col">
          <div class="card bold">
            <div class="card-head"><div class="ttl"><app-bi k="todays_issues"></app-bi></div></div>
            <table class="tbl dense">
              <thead><tr><th><app-bi k="voucher"></app-bi></th><th><app-bi k="to"></app-bi></th><th><app-bi k="item"></app-bi></th><th class="num"><app-bi k="qty"></app-bi></th></tr></thead>
              <tbody>
                <tr><td class="mono"><b>ISS-0824</b></td><td>KLP-B07</td><td>Ammonia 25%</td><td class="num">24 L</td></tr>
                <tr><td class="mono"><b>ISS-0825</b></td><td>KLP-B08</td><td>Ammonia 25%</td><td class="num">18 L</td></tr>
                <tr><td class="mono"><b>ISS-0826</b></td><td>KLP-B12</td><td>Latex cups</td><td class="num">240 pcs</td></tr>
                <tr><td class="mono"><b>ISS-0827</b></td><td>KLP-B27</td><td>Tap. knife</td><td class="num">4 pcs</td></tr>
                <tr><td class="mono"><b>ISS-0828</b></td><td>CC-Main</td><td>Rainguard</td><td class="num">2 rolls</td></tr>
              </tbody>
            </table>
          </div>

          <div class="card bold">
            <div class="card-head">
              <div class="ttl">Reorder suggestions</div>
              <span class="badge oxide" style="margin-left: auto;">3</span>
            </div>
            <div class="card-body col" style="gap: 10px; font-size: 12px;">
              <div>
                <div class="row between"><b>Muriate of Potash</b><span class="mono hl-oxide">−22%</span></div>
                <div class="muted">Order 1,800 kg · lead time 7 days</div>
                <button class="btn ghost sm mt-8" (click)="onAction('Raising Purchase Requisition for Muriate of Potash (1,800 kg)…')">Raise PR</button>
              </div>
              <div style="border-top: var(--bd-soft); padding-top: 8px;">
                <div class="row between"><b>DAP</b><span class="mono hl-oxide">−38%</span></div>
                <div class="muted">Order 2,200 kg · GeM rate ₹36/kg</div>
                <button class="btn ghost sm mt-8" (click)="onAction('Raising Purchase Requisition for DAP (2,200 kg)…')">Raise PR</button>
              </div>
              <div style="border-top: var(--bd-soft); padding-top: 8px;">
                <div class="row between"><b>Latex cup (HDPE)</b><span class="mono hl-oxide">−8%</span></div>
                <div class="muted">Order 3,000 pcs · vendor: PolyKraft</div>
                <button class="btn ghost sm mt-8" (click)="onAction('Raising Purchase Requisition for Latex cup HDPE (3,000 pcs)…')">Raise PR</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    @if (toastMessage()) {
      <div style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink-1); color: var(--bg-1); padding: 12px 24px; border-radius: var(--r-md); font-size: 13px; font-weight: 500; z-index: 1000; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 8px;">
        <app-icon name="Check" [size]="16"></app-icon>
        {{ toastMessage() }}
      </div>
    }
  `
})
export class InventoryComponent {
  dataService = inject(DataService);
  private pdfService = inject(PdfExportService);
  
  searchQuery = signal('');
  invCategory = signal('All categories');
  invLocation = signal('All locations');
  invStatus = signal('All status');
  toastMessage = signal<string | null>(null);

  filteredInventory = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.invCategory();
    const loc = this.invLocation();
    const status = this.invStatus();

    return this.dataService.inventory.filter(it => {
      // Search filter
      if (query && !it.sku.toLowerCase().includes(query) && !it.name.toLowerCase().includes(query)) {
        return false;
      }
      
      // Category filter (based on SKU prefix)
      if (cat !== 'All categories') {
        if (cat === 'Chemicals' && !it.sku.startsWith('CHM')) return false;
        if (cat === 'Fertilizers' && !it.sku.startsWith('FRT')) return false;
        if (cat === 'Tools' && it.sku !== 'SUP-TAP') return false;
        if (cat === 'Consumables' && !it.sku.startsWith('SUP-C') && !it.sku.startsWith('SUP-R')) return false;
      }

      // Location filter
      if (loc !== 'All locations' && it.location !== loc) {
        return false;
      }

      // Status filter
      if (status !== 'All status') {
        if (status === 'OK' && it.status !== 'ok') return false;
        if (status === 'Low stock' && it.status !== 'low') return false;
        if (status === 'Critical' && it.status !== 'critical') return false; // Though critical doesn't exist yet, good for future proofing
      }

      return true;
    });
  });

  getPercent(stock: number, max: number) {
    return Math.min(100, (stock / max) * 100);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  onAction(msg: string) {
    this.showToast(msg);
  }

  downloadPdf(name: string) {
    this.showToast('Generating PDF...');
    this.pdfService.exportElementToPdf('inventory-export-content', name + '.pdf');
  }
}
