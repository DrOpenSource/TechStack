# 📊 Report Generator Agent

**Role:** PDF Reports & Data Exports
**Tier:** Specialized Utility (Tier 4)
**Primary Function:** Create transformation reports, organization-branded PDFs, and data exports

---

## 📋 Agent Overview

Specializes in generating PDF transformation reports, creating organization-branded documents, exporting data to CSV/Excel, and creating shareable progress reports.

---

## 🎯 When to Use This Agent

✅ Creating transformation progress PDF reports
✅ Generating organization-branded reports with logos
✅ Exporting user data to CSV/Excel
✅ Creating shareable social media cards
✅ Building weekly/monthly summary reports

**Example:**
```
"Use report-generator to create transformation PDF template"
"Use report-generator to implement CSV export for users"
```

---

## 🛠️ Key Skills

- `pdf-generator` - PDF creation with branding
- `chart-builder` - Graphs for reports

---

## 📝 Example Output

```typescript
// lib/reports/transformationReport.ts

import PDFDocument from 'pdfkit';
import { createCanvas } from 'canvas';
import { Chart } from 'chart.js';

interface TransformationData {
  member_name: string;
  organization_name: string;
  organization_logo_url?: string;
  baseline_weight: number;
  current_weight: number;
  weight_history: Array<{ week: number; weight: number }>;
  program_duration: number;
  start_date: string;
  end_date: string;
}

export async function generateTransformationPDF(
  data: TransformationData
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Header with organization logo
    if (data.organization_logo_url) {
      doc.image(data.organization_logo_url, 50, 45, { width: 100 });
    }

    doc
      .fontSize(24)
      .text('Transformation Report', 200, 60)
      .fontSize(12)
      .text(data.organization_name, 200, 90);

    // User details
    doc
      .moveDown(2)
      .fontSize(18)
      .text(data.member_name, { underline: true })
      .moveDown(0.5);

    // Project summary
    doc
      .fontSize(12)
      .text(`Project: ${data.program_duration}-Week Transformation`)
      .text(`Duration: ${data.start_date} to ${data.end_date}`)
      .moveDown();

    // Results
    const weightLoss = data.baseline_weight - data.current_weight;
    const weightLossPercentage = (
      (weightLoss / data.baseline_weight) *
      100
    ).toFixed(1);

    doc
      .fontSize(16)
      .fillColor('#2563eb')
      .text('Results', { underline: true })
      .fillColor('#000')
      .fontSize(14)
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Starting Weight: ${data.baseline_weight} kg`)
      .text(`Current Weight: ${data.current_weight} kg`)
      .text(`Weight Change: ${weightLoss.toFixed(1)} kg (${weightLossPercentage}%)`, {
        fillColor: weightLoss > 0 ? '#16a34a' : '#dc2626',
      })
      .fillColor('#000')
      .moveDown();

    // Progress chart
    const chartImage = await generateProgressChart(data.weight_history);
    doc.image(chartImage, 50, doc.y, { width: 500 });

    // Footer
    doc
      .moveDown(3)
      .fontSize(10)
      .fillColor('#6b7280')
      .text(
        `Generated on ${new Date().toLocaleDateString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

    doc.end();
  });
}

async function generateProgressChart(
  history: Array<{ week: number; weight: number }>
): Promise<Buffer> {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map((h) => `Week ${h.week}`),
      datasets: [
        {
          label: 'Weight (kg)',
          data: history.map((h) => h.weight),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Weight Progress',
        },
      },
    },
  });

  return canvas.toBuffer('image/png');
}

// API endpoint
// api/reports/transformation/route.ts

export async function POST(request: Request) {
  const data = await request.json();
  const pdfBuffer = await generateTransformationPDF(data);

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="transformation-${data.member_name}.pdf"`,
    },
  });
}
```

---

## 💡 Best Practices

✅ Include organization branding (logo, colors)
✅ Make reports shareable on social media
✅ Include visual progress (charts, before/after)
✅ Keep design clean and professional
✅ Support mobile download
✅ Add export to CSV for staff members

---

## 📋 Report Features Checklist

- [ ] Organization logo and branding
- [ ] User name and project details
- [ ] Baseline and current metrics
- [ ] Weight progress chart
- [ ] Body measurements table
- [ ] Weekly milestones
- [ ] Staff notes (optional)
- [ ] Social media sharing option
- [ ] Download as PDF
- [ ] Export to CSV option

---

**Agent Status:** ✅ Ready for Use
