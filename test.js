const pdfParse = require('pdf-parse');

test('Check PDF Content', async () => {
  const pdfPath = 'PolicyDocument.pdf';

  const pdfData = await pdfParse(pdfPath);
  const text = pdfData.text.toLowerCase(); // Convert text to lowercase for case-insensitive comparison

  expect(text).toContain('organization specific');
  expect(text).toContain('commitment to compliance');
});
