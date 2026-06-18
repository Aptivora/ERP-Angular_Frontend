import { Injectable } from '@angular/core';

declare var html2canvas: any;
declare var jspdf: any;

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  private scriptsLoaded = false;

  constructor() { }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  }

  private async loadDependencies(): Promise<void> {
    if (this.scriptsLoaded) return;
    // Load html2canvas and jspdf from cdnjs
    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    this.scriptsLoaded = true;
  }

  async exportElementToPdf(elementId: string, filename: string = 'export.pdf') {
    await this.loadDependencies();

    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found.`);
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  }
}
