import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, '../node_modules/@innovatrics/dot-document-auto-capture/dot-assets');
const destinationPath = path.resolve(__dirname, '../public/dot-assets');

fs.copy(sourcePath, destinationPath, { overwrite: true })
  .then(() => console.log('Innovatrics dot-assets copied successfully!'))
  .catch(err => console.error('Error copying Innovatrics dot-assets:', err)); 