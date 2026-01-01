const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.resolve(__dirname, '../docs/history_coverage');
const COMMAND = 'npm';
const ARGS = ['run', 'test:coverage'];

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate filename with timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
const filename = `coverage_${timestamp}.txt`;
const filePath = path.join(OUTPUT_DIR, filename);

console.log(`\n🚀 Starting coverage test run...`);
console.log(`📝 Output will be saved to: ${filePath}\n`);

// Create write stream
const stream = fs.createWriteStream(filePath);
const header = `Coverage Report generated at ${now.toLocaleString()}\ncommand: ${COMMAND} ${ARGS.join(' ')}\n${'-'.repeat(80)}\n\n`;
stream.write(header);

// Run command
const child = spawn(COMMAND, ARGS, {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: '0' }, // Disable color for text file readability
    stdio: ['inherit', 'pipe', 'pipe']
});

// Pipe output to file and console
child.stdout.on('data', (data) => {
    process.stdout.write(data);
    stream.write(data);
});

child.stderr.on('data', (data) => {
    process.stderr.write(data);
    stream.write(data);
});

child.on('close', (code) => {
    stream.end();
    console.log(`\n\n✅ Coverage report saved to: ${filePath}`);
    process.exit(code);
});
