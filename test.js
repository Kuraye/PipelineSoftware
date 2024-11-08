Fconst pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
  it('should check if the PDF file exists', async () => {
    const pdfPath = 'PolicyDocument.pdf';

    if (fs.existsSync(pdfPath)) {
      console.log('5.1.A. Policy document exists');
    } else {
      console.log('[!] 5.1.A. Policy document does not exist');
    }
  });

  it('should check for specific strings in the PDF', async () => {
    const pdfPath = 'PolicyDocument.pdf';

    const pdfData = await pdfParse(pdfPath);
    const text = pdfData.text.toLowerCase();

    const reportFile = 'test_report.txt';
    fs.writeFileSync(reportFile, 'Test Report:\n');

    if (text.includes('organization specific')) {
      fs.appendFileSync(reportFile, '5.2.A. Policy document is tailored\n');
    } else {
      fs.appendFileSync(reportFile, '[!] 5.2.A. Policy document is not tailored\n');
    }

    if (text.includes('commitment to compliance')) {
      fs.appendFileSync(reportFile, '5.2.C. Policy document contains commitment to compliance\n');
    } else {
      fs.appendFileSync(reportFile, '[!] 2.2.C. Policy document does not contain commitment to compliance\n');
    }
  });
});
