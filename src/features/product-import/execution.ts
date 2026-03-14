import * as XLSX from 'xlsx';
import { SKIP_PROPERTY } from './schema';

const applyModifier = (value: any, modifier: string) => {
  if (!modifier) return value;

  let modifiedValue = String(value);

  // Split modifiers by | and apply them sequentially
  const modifiers = modifier.split('|').map((m: string) => m.trim());

  for (const mod of modifiers) {
    if (mod === 'trim') {
      modifiedValue = modifiedValue.trim();
    } else if (mod === 'ucfirst') {
      modifiedValue = modifiedValue.charAt(0).toUpperCase() + modifiedValue.slice(1);
    } else if (mod === 'upper') {
      modifiedValue = modifiedValue.toUpperCase();
    } else if (mod === 'lower') {
      modifiedValue = modifiedValue.toLowerCase();
    } else if (mod.startsWith('+')) {
      const num = parseFloat(mod.substring(1));
      modifiedValue = String(parseFloat(modifiedValue) + num);
    } else if (mod.startsWith('*')) {
      const num = parseFloat(mod.substring(1));
      modifiedValue = String(parseFloat(modifiedValue) * num);
    } else {
      // Unknown modifier, just return original
      return value;
    }
  }

  return modifiedValue;
};

interface ColumnMapping {
  [header: string]: {
    targetField: string;
    modifier?: string;
  };
}

interface ExecuteProductImportArgs {
  supabaseClient: any;
  file: File;
  columnMapping: ColumnMapping;
}

export async function executeProductImport({ supabaseClient, file, columnMapping }: ExecuteProductImportArgs) {
  const results = {
    totalRows: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (json.length === 0) {
          resolve(results);
          return;
        }

              const headers: string[] = json[0] as string[];
              // const dataRows: unknown[][] = json.slice(1) as unknown[][]; // Removed duplicate declaration
        const dataRows: unknown[] = json.slice(1);
        results.totalRows = dataRows.length;

        for (let i = 0; i < dataRows.length; i++) {
          const row = dataRows[i] as unknown[];
          const rowNumber = i + 2; // +1 for 0-indexed, +1 for header row
          let productData = {};
          let hasMappedData = false;

          for (const header of headers) {
            const mapping = columnMapping[header];
            if (mapping && mapping.targetField !== SKIP_PROPERTY) {
              const value = row[headers.indexOf(header)];
              productData[mapping.targetField] = applyModifier(value, mapping.modifier);
              hasMappedData = true;
            }
          }

          if (!hasMappedData) {
            results.skipped++;
            continue;
          }

          try {
            // Determine if it's an update or insert
            const productId = (productData as { [key: string]: any }).id;
            if (productId) {
              // Attempt to update
              const { error } = await supabaseClient
                .from('products')
                .update(productData)
                .eq('id', productId);

              if (error) throw error;
              results.updated++;
            } else {
              // Attempt to insert
              const { error } = await supabaseClient
                .from('products')
                .insert([productData]);

              if (error) throw error;
              results.inserted++;
            }
          } catch (error) {
            results.failed++;
            results.errors.push({ rowNumber, message: error.message });
          }
        }
        resolve(results);
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