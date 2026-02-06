import { cpSync, rmSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Clean up previous build
const distDir = join(__dirname, 'dist');
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
}

// Create dist directory
mkdirSync(distDir, { recursive: true });

console.log('📦 Merging builds...');

// Copy frontend build to dist root
const frontendDist = join(__dirname, 'frontend', 'dist');
if (existsSync(frontendDist)) {
  cpSync(frontendDist, distDir, { recursive: true });
  console.log('✅ Frontend build copied to dist/');
} else {
  console.error('❌ Frontend build not found!');
  process.exit(1);
}

// Copy admin build to dist/admin
const adminDist = join(__dirname, 'admin', 'dist');
const adminDestDir = join(distDir, 'admin');
if (existsSync(adminDist)) {
  cpSync(adminDist, adminDestDir, { recursive: true });
  console.log('✅ Admin build copied to dist/admin/');
} else {
  console.error('❌ Admin build not found!');
  process.exit(1);
}

console.log('🎉 Build merge complete!');
