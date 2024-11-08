const pdfParse = require('pdf-parse');

describe('PDF Content Tests', () => {
  it('should check if the PDF file exists', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    expect(fs.existsSync(pdfPath)).toBe(true);
  });

  it('should check for specific strings in the PDF', async () => {
    const pdfPath = 'PolicyDocument.pdf';
    const pdfData = await pdfParse(pdfPath);
    const text = pdfData.text.toLowerCase();

    expect(text).toContain('organization specific');
    expect(text).toContain('commitment to compliance');
  });
});
