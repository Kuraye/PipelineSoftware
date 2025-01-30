const { execSync } = require('child_process');
const pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
  const nonComplianceList = [];

  it('should check if the PDF file and risk treatment plan exist and their content', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const riskTreatmentPlanPath = 'Risk_Treatment_Plan.csv';
    const logFilePath = 'system.log';
    const reportFile = 'test_report.txt';
    const outputFile = 'outputfile.txt';
    fs.writeFileSync(reportFile, "    This document has the purpose of showing the results of the checks that happened while building the application.\n");
    // PDF checks
    if (fs.existsSync(pdfPath)) {
      const pdfData = await pdfParse(pdfPath);
      const text = pdfData.text.toLowerCase();
      fs.writeFileSync(reportFile, "    5.1.A. Policy document exists\n");

      if (text.includes('organization specific')) {
        fs.appendFileSync(reportFile, "    5.2.A. Policy document is tailored\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.A. Policy document is not tailored\n");
        nonComplianceList.push('5.2.A');
      }

      if (text.includes('security objectives')) {
        fs.appendFileSync(reportFile, "    5.2.B. Security Objectives documented\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.B. Security Objectives not documented\n");
        nonComplianceList.push('5.2.B');
      }

      if (text.includes('commitment to compliance')) {
        fs.appendFileSync(reportFile, "    5.2.C. Policy document contains Commitment to compliance\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 5.2.C. Policy document does not contain Commitment to compliance\n");
        nonComplianceList.push('5.2.C');
      }
    } else {
      fs.writeFileSync(reportFile, "[!] 5.1.A. Policy document missing\n");
      nonComplianceList.push('5.1.A');
    }
    await new Promise((resolve) => {
      fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading log file:', err);
          fs.appendFileSync(reportFile, "[!] 5.2.F. Error reading log file\n");
          nonComplianceList.push('5.2.F.');
        } else {
          if (data.includes('policy document')) {
            fs.appendFileSync(reportFile, "    5.2.F. Policy document communication confirmed\n");
          } else {
            fs.appendFileSync(reportFile, "[!] 5.2.F. Policy document communication not confirmed\n");
            nonComplianceList.push('5.2.F.');
          }
        }
        resolve();
      });
    });


    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach(item => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
