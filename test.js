const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');

describe('PDF Content Tests', () => {
  it('should check if the PDF file exists and its content', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const remotePdfUrl = 'http://extranet.local/policy/document.pdf';

    if (fs.existsSync(pdfPath)) {
      // Local PDF exists
      const pdfData = await pdfParse(pdfPath);
      const text = pdfData.text.toLowerCase();

      // Check for specific strings and write to the report
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
    } else {
      // Try to fetch the PDF from the remote URL
      try {
        const response = await axios({ url: remotePdfUrl, responseType: 'stream' });
        response.data.pipe(fs.createWriteStream(pdfPath));

        // Now the PDF exists locally, process it as before
        const pdfData = await pdfParse(pdfPath);
        const text = pdfData.text.toLowerCase();

        // ... (rest of the code for checking PDF content and writing to the report)
      } catch (error) {
        console.error('Error fetching remote PDF:', error);
        // Handle the error, e.g., log the error, retry, or notify administrators
        fs.writeFileSync(reportFile, "[!] 5.1.A. Policy document not accessible\n");
      }
    }
  });
});
