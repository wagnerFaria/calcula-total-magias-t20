import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';

// Load module.json to get version and ID
const moduleJson = JSON.parse(fs.readFileSync('./module/module.json', 'utf8'));
const manifestId = moduleJson.id;
const version = moduleJson.version;

const zipFileName = `${manifestId}-${version}.zip`;
const output = fs.createWriteStream(path.join(process.cwd(), zipFileName));

// In archiver v8, use ZipArchive class directly
const archive = new ZipArchive({
    zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
    console.log(`Zip file created: ${zipFileName} (${archive.pointer()} total bytes)`);
});

archive.on('error', function(err) {
    throw err;
});

archive.pipe(output);

// Add the module directory content, but prefixed with the module ID
// Foundry expects the zip to contain a folder with the module ID
archive.directory('module/', manifestId);

archive.finalize();
