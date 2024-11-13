const pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
  const nonComplianceList = [];

  it('should check if the PDF file exists and its content', async () => {
    const pdfPath = 'PolicyDocument.pdf';

    if (fs.existsSync(pdfPath)) {
      const pdfData = await pdfParse(pdfPath);
      const text = pdfData.text.toLowerCase();

      const reportFile = 'test_report.txt';
      fs.writeFileSync(reportFile, "# This document has the results if the application complies with the ISO 27001 and NEN 7510\n");
      fs.appendFileSync(reportFile, "5.1.A. Policy document exists\n");

      if (text.includes('organization specific')) {
        fs.appendFileSync(reportFile, "5.2.A. Policy document is tailored\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.A. Policy document is not tailored\n");
        nonComplianceList.push('5.2.A');
      }
      if (text.includes('security objectives')) {
        fs.appendFileSync(reportFile, "5.2.B. Security objectives documented\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.B. Security objectives not documented\n");
        nonComplianceList.push('5.2.B');
      }

      if (text.includes('commitment to compliance')) {
        fs.appendFileSync(reportFile, "5.2.C. Policy document contains Commitment to compliance\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.C. Policy document does not contain Commitment to compliance\n");
        nonComplianceList.push('5.2.C');
      }

      fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
      nonComplianceList.forEach(item => {
        fs.appendFileSync(reportFile, `- ${item}\n`);
      });
    } else {
      fs.writeFileSync('test_report.txt', "[!] 5.1.A. Policy document missing\n");
      nonComplianceList.push('5.1.A');
      fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
      nonComplianceList.forEach(item => {
        fs.appendFileSync(reportFile, `- ${item}\n`);
      });
    }
  });
});
