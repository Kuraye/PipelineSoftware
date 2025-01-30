const fs = require('fs');
const { parse } = require('csv-parse');

describe('CSV File Checks', () => {
  const reportFile = 'testreport.txt';
  const csvFilePath = 'Risk_Treatment_Plan.csv';
  const nonComplianceList = [];

  beforeAll(() => {
    fs.writeFileSync(reportFile, "This document has the purpose of showing the results of the checks for the Risk Treatment Plan CSV file.\n\n");
  });

  it('should check if the CSV file exists and validate its content', (done) => {
    if (fs.existsSync(csvFilePath)) {
      fs.appendFileSync(reportFile, "8.1.A. Risk Treatment Plan exists\n");

      const results = [];
      let hasDetails = false;

      fs.readFile(csvFilePath, 'utf8')
        .then((csvData) => {
          parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
            if (err) {
              fs.appendFileSync(reportFile, `[!] 8.1.F. Error parsing CSV file: ${err.message}\n`);
              nonComplianceList.push('8.1.F');
              done();
              return;
            }

            results.push(...records);

            if (results.length > 0) {
              fs.appendFileSync(reportFile, "8.1.B. Risk Treatment Plan contains data\n");

              hasDetails = results.some(row => Object.values(row).some(value => value && value.toLowerCase().includes('details')));

              if (hasDetails) {
                fs.appendFileSync(reportFile, "8.1.C. The word 'details' was found in the CSV file\n");
              } else {
                fs.appendFileSync(reportFile, "[!] 8.1.C. The word 'details' was not found in the CSV file\n");
                nonComplianceList.push('8.1.C');
              }

              results.forEach((row, index) => {
                if (!row['Risk']) {
                  fs.appendFileSync(reportFile, `[!] 8.1.D. Row ${index + 1}: Missing "Risk" value\n`);
                  nonComplianceList.push(`8.1.D (Row ${index + 1})`);
                }

                if (!row['Treatment']) {
                  fs.appendFileSync(reportFile, `[!] 8.1.E. Row ${index + 1}: Missing "Treatment" value\n`);
                  nonComplianceList.push(`8.1.E (Row ${index + 1})`);
                }
              });
            } else {
              fs.appendFileSync(reportFile, "[!] 8.1.B. Risk Treatment Plan is empty\n");
              nonComplianceList.push('8.1.B');
            }

            done();
          });
        })
        .catch((err) => {
          fs.appendFileSync(reportFile, `[!] 8.1.F. Error reading CSV file: ${err.message}\n`);
          nonComplianceList.push('8.1.F');
          done();
        });
    } else {
      fs.appendFileSync(reportFile, "[!] 8.1.A. Risk Treatment Plan is missing!\n");
      nonComplianceList.push('8.1.A');
      done();
    }
  });

  afterAll(() => {
    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach((item) => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
