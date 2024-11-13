const pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
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
      }

      if (text.includes('commitment to compliance')) {
        fs.appendFileSync(reportFile, "5.2.C. Policy document contains Commitment to compliance\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.C. Policy document does not contain Commitment to compliance\n");
      }

      // Count the occurrences of "[!" in the report file
      const reportContent = fs.readFileSync(reportFile, 'utf-8');
      const nonComplianceCount = reportContent.match(/\[\!\]/g).length;

      fs.appendFileSync(reportFile, `\n\nTotal Non-Compliance Issues: ${nonComplianceCount}`);
    } else {
      fs.writeFileSync('test_report.txt', "[!] 5.1.A. Policy document missing\n");
    }
  });
});
