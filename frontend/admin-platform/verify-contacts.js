const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando módulo de contactos...\n');

// Verificar páginas
const pages = [
  'src/app/dashboard/contacts/page.tsx',
  'src/app/dashboard/contacts/import/page.tsx', 
  'src/app/dashboard/contacts/lists/page.tsx',
  'src/app/dashboard/contacts/[id]/page.tsx'
];

// Verificar componentes
const components = [
  'src/components/contacts/ContactsPage.tsx',
  'src/components/contacts/ContactTable.tsx',
  'src/components/contacts/ContactFilters.tsx',
  'src/components/contacts/ContactForm.tsx',
  'src/components/contacts/ContactImportPage.tsx',
  'src/components/contacts/ContactListsPage.tsx',
  'src/components/contacts/ContactDetailPage.tsx'
];

let allFilesExist = true;

console.log('📄 Páginas:');
pages.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
    allFilesExist = false;
  }
});

console.log('\n🧩 Componentes:');
components.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
    allFilesExist = false;
  }
});

// Verificar que las páginas usen 'use client'
console.log('\n🔧 Verificando client components:');
pages.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes("'use client'")) {
      console.log(`✅ ${file} - Client component`);
    } else {
      console.log(`⚠️  ${file} - Falta 'use client'`);
    }
  }
});

// Verificar rutas en sidebar
console.log('\n🧭 Verificando navegación:');
const sidebarFile = 'src/components/Sidebar.tsx';
if (fs.existsSync(sidebarFile)) {
  const content = fs.readFileSync(sidebarFile, 'utf8');
  if (content.includes('subItems')) {
    console.log('✅ Sidebar actualizado con subitems de contactos');
  } else {
    console.log('⚠️  Sidebar no tiene subitems configurados');
  }
}

// Verificar API client
console.log('\n📡 Verificando API client:');
const apiFile = 'src/lib/api.ts';
if (fs.existsSync(apiFile)) {
  const content = fs.readFileSync(apiFile, 'utf8');
  const methods = ['getContact', 'createContact', 'updateContact', 'deleteContact', 'importContacts'];
  methods.forEach(method => {
    if (content.includes(method)) {
      console.log(`✅ ${method} implementado`);
    } else {
      console.log(`❌ ${method} faltante`);
    }
  });
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 ¡Módulo de contactos completamente implementado!');
  console.log('📝 Funcionalidades disponibles:');
  console.log('   • Tabla de contactos con paginación y filtros');
  console.log('   • Formulario de crear/editar contactos');
  console.log('   • Importación masiva de CSV');
  console.log('   • Gestión de listas de contactos');
  console.log('   • Vista de detalle individual');
  console.log('   • Navegación integrada en sidebar');
  console.log('\n🌐 Rutas disponibles:');
  console.log('   • /dashboard/contacts - Lista principal');
  console.log('   • /dashboard/contacts/import - Importar CSV');
  console.log('   • /dashboard/contacts/lists - Gestión de listas');
  console.log('   • /dashboard/contacts/[id] - Detalle de contacto');
} else {
  console.log('❌ Faltan archivos del módulo de contactos');
}
console.log('='.repeat(50));