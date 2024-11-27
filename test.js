const { execSync } = require('child_process');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const csvParser = require('csv-parser');

describe('PDF Content Tests', () => {
  const nonComplianceList = [];

  it('should check if the PDF file and risk treatment plan exist and their content', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const riskTreatmentPlanPath = 'Risk_Treatment_Plan.csv';
    const logFilePath = 'system.log';
    const reportFile = 'test_report.txt';
    fs.writeFileSync(reportFile, "    This document exists as a report where you can see which guidelines you haven't implemented yet in the project. At the end of the list, you will be able to see which non-compliances you still have.\n");
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
          const resourceAllocationPromise = new Promise((resolve, reject) => {
          const command = 'grep -q "information_security_resources" resources.csv';
      
            exec(command, (error, stdout, stderr) => {
              if (error) {
                reject(error);
              } else if (stdout.trim() === 'Resources allocated') {
                resolve();
              } else {
                reject(new Error('Resource allocation not found'));
              }
            });
          });
      
          try {
            await resourceAllocationPromise;
            fs.appendFileSync(reportFile, "    7.1.   Resource is allocated\n");
          } catch (error) {
            fs.appendFileSync(reportFile, "[!] 7.1.   Resource is not allocated\n");
            nonComplianceList.push('7.1.');
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
      
    if (fs.existsSync(riskTreatmentPlanPath)) {
      fs.appendFileSync(reportFile, "8.1.A. Risk Treatment Plan exists\n");

      const foundTreatmentPlanDetails = await new Promise((resolve) => {
        let found = false;
        fs.createReadStream(riskTreatmentPlanPath)
          .pipe(csvParser())
          .on('data', (row) => {
            console.log('Row:', row); // Log the entire row
            console.log('A1:', row['A1']); // Log the specific A1 column
            if (row['A1'] && row['A1'].includes('Treatment Plan Details')) {
              found = true;
              console.log('Found "Treatment Plan Details" in A1');
            }
          })
          .on('end', () => {
            resolve(found);
          });
      });
    
          if (foundTreatmentPlanDetails) {
            fs.appendFileSync(reportFile, "    8.1.B. Risk Treatment Plan meets details\n");
          } else {
            fs.appendFileSync(reportFile, "[!] 8.1.B. Risk Treatment Plan is missing details\n");
            nonComplianceList.push('8.1.B.');
          }  
      } else {
         fs.appendFileSync(reportFile, "[!] 8.1.A. Risk Treatment Plan is missing!\n");
          nonComplianceList.push('8.1.A.');
    }
    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach(item => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
