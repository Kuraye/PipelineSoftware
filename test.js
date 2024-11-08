const pdfParse = require('pdf-parse');

test('Check PDF Content', async () => {
  const pdfPath = 'PolicyDocument.pdf'; // Adjust the path as needed

  const pdfData = await pdfParse(pdfPath);
  const text = pdfData.text;

  expect(text).toContain('Commitment to compliance');
  expect(text).toContain('Organization Specific');
});
