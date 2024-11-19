const pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
  const nonComplianceList = [];

  it('should check if the PDF file and risk treatment plan exist and their content', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const riskTreatmentPlanPath = 'Risk_Treatment_Plan.csv';

    if (fs.existsSync(pdfPath)) {
      const pdfData = await pdfParse(pdfPath);
      const text = pdfData.text.toLowerCase();

      const reportFile = 'test_report.txt';
      fs.writeFileSync(reportFile, "# This document has the results if the application complies with the ISO 27001 and NEN 7510\n");
      fs.appendFileSync(reportFile, "5.1.A. Policy document exists\n");

      // ... (rest of your PDF content checks)

      fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
      nonComplianceList.forEach(item => {
        fs.appendFileSync(reportFile, `- ${item}\n`);
      });
    } else {
      fs.writeFileSync('test_report.txt', "[!] 5.1.A. Policy document missing\n");
      nonComplianceList.push('5.1.A');
    }

    if (fs.existsSync(riskTreatmentPlanPath)) {
      fs.appendFileSync(reportFile, "8.1.A. Risk Treatment Plan exists\n");
    } else {
      fs.appendFileSync(reportFile, "[!] 8.1.A. Risk Treatment Plan missing\n");
      nonComplianceList.push('8.1.A');
    }

    // Update the non-compliance list in the report file
    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach(item => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
