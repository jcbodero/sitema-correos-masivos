const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del proyecto...\n');

// Verificar archivos esenciales
const essentialFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  '.env.local',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/components/Dashboard.tsx'
];

let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
    allFilesExist = false;
  }
});

// Verificar node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules');
} else {
  console.log('❌ node_modules - FALTANTE');
  allFilesExist = false;
}

// Verificar variables de entorno
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('AUTH0_SECRET') && envContent.includes('AUTH0_CLIENT_ID')) {
    console.log('✅ Variables de entorno configuradas');
  } else {
    console.log('⚠️  Variables de entorno incompletas');
  }
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 ¡Configuración completa! El proyecto está listo.');
  console.log('📝 Para iniciar: npm run dev');
  console.log('🌐 URL: http://localhost:3000');
} else {
  console.log('❌ Faltan archivos esenciales. Revisar la configuración.');
}
console.log('='.repeat(50));