const pdfParse = require('pdf-parse');
const fs = require('fs');

describe('PDF Content Tests', () => {
  const nonComplianceList = [];

  it('should check if the PDF file and risk treatment plan exist and their content', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const riskTreatmentPlanPath = 'Risk_Treatment_Plan.csv';
    const reportFile = 'test_report.txt';

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

    // Risk Treatment Plan checks
    const riskTreatmentPlanPromise = new Promise((resolve, reject) => {
      if (fs.existsSync(riskTreatmentPlanPath)) {
        fs.readFile(riskTreatmentPlanPath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } else {
        reject(new Error('Risk Treatment Plan missing'));
      }
    });

    try {
      const riskTreatmentPlanData = await riskTreatmentPlanPromise;
      fs.appendFileSync(reportFile, "    8.1.A. Risk Treatment Plan exists\n");

      if (riskTreatmentPlanData.includes('treatment plan details')) {
        fs.appendFileSync(reportFile, "    8.1.B. Risk Treatment Plan contains treatment plan details\n");
      } else {
        fs.appendFileSync(reportFile, "[!] 8.1.B. Risk Treatment Plan does not contain treatment plan details\n");
        nonComplianceList.push('8.1.B');
      }
    } catch (error) {
      fs.appendFileSync(reportFile, "[!] 8.1.A. Risk Treatment Plan missing or could not be read\n");
      nonComplianceList.push('8.1.A');
    }

    // Write non-compliance list to report file
    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach(item => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
