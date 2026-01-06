import fs from 'fs';
import path from 'path';
import imageSize from 'image-size';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const SCREENSHOTS_DIR = path.join(ASSETS_DIR, 'screenshots');

const REQUIRED_ICONS = [16, 32, 48, 128];
const VALID_SCREENSHOT_DIMENSIONS = [
  { width: 1280, height: 800 },
  { width: 640, height: 400 },
];

function validateIcons() {
  console.log('🔍 Validating Icons...');
  const errors = [];

  for (const size of REQUIRED_ICONS) {
    const iconPath = path.join(ICONS_DIR, `icon-${size}.png`);
    if (!fs.existsSync(iconPath)) {
      errors.push(`❌ Missing icon: icon-${size}.png`);
      continue;
    }

    try {
      // @ts-ignore - image-size aceita string mesmo que o tipo diga Uint8Array
      const dimensions = imageSize(iconPath);
      if (dimensions.width !== size || dimensions.height !== size) {
        errors.push(
          `❌ Invalid dimensions for icon-${size}.png: Expected ${size}x${size}, got ${dimensions.width}x${dimensions.height}`
        );
      } else {
        console.log(`✅ icon-${size}.png OK`);
      }
    } catch (err) {
      errors.push(`❌ Error reading icon-${size}.png: ${err.message}`);
    }
  }

  return errors;
}

function validateScreenshots() {
  console.log('\n🔍 Validating Screenshots...');
  const errors = [];

  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    console.warn('⚠️ Screenshots directory not found. Skipping screenshot validation.');
    return [];
  }

  const files = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.match(/\.(png|jpg|jpeg)$/));

  if (files.length === 0) {
    console.warn('⚠️ No screenshots found.');
  }

  for (const file of files) {
    const filePath = path.join(SCREENSHOTS_DIR, file);
    try {
      // @ts-ignore - image-size aceita string mesmo que o tipo diga Uint8Array
      const dimensions = imageSize(filePath);
      const isValid = VALID_SCREENSHOT_DIMENSIONS.some(
        (d) => d.width === dimensions.width && d.height === dimensions.height
      );

      if (!isValid) {
        errors.push(
          `❌ Invalid screenshot dimensions for ${file}: ${dimensions.width}x${dimensions.height}. Expected 1280x800 or 640x400.`
        );
      } else {
        console.log(`✅ ${file} OK (${dimensions.width}x${dimensions.height})`);
      }
    } catch (err) {
      errors.push(`❌ Error reading screenshot ${file}: ${err.message}`);
    }
  }

  return errors;
}

function main() {
  console.log('🚀 Starting Asset Validation...\n');

  const iconErrors = validateIcons();
  const screenshotErrors = validateScreenshots();

  const allErrors = [...iconErrors, ...screenshotErrors];

  if (allErrors.length > 0) {
    console.error('\n💥 Validation Failed:');
    allErrors.forEach((err) => console.error(err));
    process.exit(1);
  } else {
    console.log('\n✨ All assets validated successfully!');
  }
}

main();
