const fs = require('fs');
const csv = require('csv-parser');

describe('CSV File Checks', () => {
  const reportFile = 'test_report.txt';
  const csvFilePath = 'Risk_Treatment_Plan.csv';
  const nonComplianceList = [];

  beforeAll(() => {
    // Initialize the report file with a header
    fs.writeFileSync(reportFile, "This document has the purpose of showing the results of the checks for the Risk Treatment Plan CSV file.\n\n");
  });

  it('should check if the CSV file exists and validate its content', (done) => {
    if (fs.existsSync(csvFilePath)) {
      fs.appendFileSync(reportFile, "8.1.A. Risk Treatment Plan exists\n");

      const results = [];
      let hasDetails = false; // Flag to check if "details" is found

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);

          // Check if any column in the row contains the word "details"
          Object.values(row).forEach((value) => {
            if (value.toLowerCase().includes('details')) {
              hasDetails = true;
            }
          });
        })
        .on('end', () => {
          // Check if the CSV file has data
          if (results.length > 0) {
            fs.appendFileSync(reportFile, "8.1.B. Risk Treatment Plan contains data\n");

            // Check if the word "details" was found
            if (hasDetails) {
              fs.appendFileSync(reportFile, "8.1.C. The word 'details' was found in the CSV file\n");
            } else {
              fs.appendFileSync(reportFile, "[!] 8.1.C. The word 'details' was not found in the CSV file\n");
              nonComplianceList.push('8.1.C');
            }

            // Example: Validate specific columns or values
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
        })
        .on('error', (error) => {
          fs.appendFileSync(reportFile, `[!] 8.1.F. Error reading CSV file: ${error.message}\n`);
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
    // Append the non-compliance list to the report file
    fs.appendFileSync(reportFile, `\nNon-Compliance List:\n`);
    nonComplianceList.forEach((item) => {
      fs.appendFileSync(reportFile, `- ${item}\n`);
    });
  });
});
