const fs = require('fs');
const { parse } = require('csv-parse');

describe('CSV File Checks', () => {
  const reportFile = 'csvchecks_report.txt';
  const csvFilePath = 'Risk_Treatment_Plan.csv';
  const nonComplianceList = [];

  beforeAll(() => {
    fs.writeFileSync(reportFile, "This document has the purpose of showing the results of the checks for the Risk Treatment Plan CSV file.\n\n");
  });

  it('should check if the CSV file exists and validate its content', (done) => {
    if (fs.existsSync(csvFilePath)) {
      fs.appendFileSync(reportFile, "8.3.1a. Risk Treatment Plan exists\n");

      const results = [];
      let hasDetails = false;

      fs.promises.readFile(csvFilePath) // Read as Buffer
        .then(csvBuffer => {
          const csvData = csvBuffer.toString('utf8'); // Convert to UTF-8 string

          parse(csvData, { columns: true, skip_empty_lines: true }, (err, records) => {
            if (err) {
              fs.appendFileSync(reportFile, `[!] Error parsing CSV file: ${err.message}\n`);
              nonComplianceList.push('Csv file');
              done();
              return;
            }

            results.push(...records);

            if (results.length > 0) {

              hasDetails = results.some(row => Object.values(row).some(value => value && value.toLowerCase().includes('details')));

              if (hasDetails) {
                fs.appendFileSync(reportFile, "8.3.1b. Risk treatment plan contains details\n");
              } else {
                fs.appendFileSync(reportFile, "[!] 8.3.1b Risk treament plan does not contain details\n");
                nonComplianceList.push('8.3.1b');
              }
              
            } else {
              fs.appendFileSync(reportFile, "[!] 8.3.1a Risk Treatment Plan is empty\n");
              nonComplianceList.push('8.1.B');
            }

            done();
          });
        })
        .catch((err) => {
          fs.appendFileSync(reportFile, `[!] Error reading CSV file: ${err.message}\n`);
          nonComplianceList.push('CSV-parse error');
          done();
        });
    } else {
      fs.appendFileSync(reportFile, "[!] 8.3.1a. Risk Treatment Plan is missing!\n");
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
