import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('\n🚀 Starting coverage test run...');
console.log(`📝 Output will be saved to: ${filePath}\n`);

// Create write stream
const stream = fs.createWriteStream(filePath);
const header = `Coverage Report generated at ${now.toLocaleString()}\ncommand: ${COMMAND} ${ARGS.join(' ')}\n${'-'.repeat(80)}\n\n`;
stream.write(header);

// Run command
const child = spawn('npm', ARGS, {
  cwd: path.resolve(__dirname, '..'),
  env: { ...process.env, FORCE_COLOR: '0' }, // Disable color for text file readability
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
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

  if (code === 0) {
    try {
      console.log('\n🔄 Automating Git operations...');

      // Get current branch
      const branch = execSync('git branch --show-current').toString().trim();
      console.log(`📌 Branch detected: ${branch}`);

      // Git Add
      execSync(`git add "${OUTPUT_DIR}"`);
      console.log('➕ File staged.');

      // Git Commit
      const commitMsg = `chore(tests): histórico coverage atualizado ${timestamp.split('_')[0]}`;
      execSync(`git commit -m "${commitMsg}"`);
      console.log(`💾 Committed: "${commitMsg}"`);

      // Git Push
      console.log('🚀 Pushing to remote...');
      execSync(`git push origin ${branch}`);
      console.log('✅ Changes pushed successfully!');
    } catch (error) {
      console.error('\n❌ Git automation failed:', error.message);
      // Don't exit with error code if just git failed, as tests passed
    }
  }

  process.exit(code);
});
