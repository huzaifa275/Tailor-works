import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'public', 'icon-192.png');
const buffer = fs.readFileSync(file);
console.log('File size:', buffer.length);
console.log('First 50 bytes (hex):', Array.from(buffer.slice(0, 50)).map(b => b.toString(16).padStart(2, '0')).join(' '));
console.log('First 50 bytes (ascii):', buffer.slice(0, 50).toString('ascii'));
