import * as XLSX from 'xlsx';

export async function parseFilePreview(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to array of arrays, then extract headers and first row
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length === 0) {
          resolve({ headers: [], estimatedDataRows: 0, sampleRow: {} });
          return;
        }

        const headers = json[0];
        const estimatedDataRows = json.length > 1 ? json.length - 1 : 0;

        let sampleRow = {};
        if (json.length > 1) {
          const firstDataRow = json[1];
          (headers as string[]).forEach((header, index) => {
            sampleRow[header] = firstDataRow[index];
          });
        }

        resolve({ headers, estimatedDataRows, sampleRow });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
}
