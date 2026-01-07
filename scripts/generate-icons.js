import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_ICON = path.join(__dirname, '../assets/icon.png');
const DEST_DIR = path.join(__dirname, '../assets/icons');
const SIZES = [16, 32, 48, 128];

async function generateIcons() {
  console.log('🖼️  Generating Icons...');

  try {
    for (const size of SIZES) {
      console.log(`   Processing ${size}x${size}...`);
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .toFile(path.join(DEST_DIR, `icon-${size}.png`));
    }
    console.log('✅ Icons generated successfully!');
  } catch (err) {
    console.error('❌ Error generating icons:', err);
    process.exit(1);
  }
}

generateIcons();
