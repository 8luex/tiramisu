import { build } from 'esbuild';
import { readFileSync } from 'fs';

// Read package.json to get dependencies
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

// Build configuration for AWS Lambda
await build({
  entryPoints: ['src/lambda.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/lambda.js',
  format: 'cjs',
  minify: true,
  sourcemap: false,
  external: [
    // Don't bundle native modules
    '@prisma/client',
    '.prisma',
  ],
  logLevel: 'info',
}).catch(() => process.exit(1));

console.log('✅ Lambda bundle created successfully');
console.log('📦 Output: dist/lambda.js');
console.log('');
console.log('Next steps:');
console.log('1. Run: npm run prisma:generate');
console.log('2. Copy node_modules/@prisma and node_modules/.prisma to dist/');
console.log('3. Zip dist/ folder for Lambda deployment');
