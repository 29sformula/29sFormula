const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, filesList);
    } else if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      filesList.push(name);
    }
  }
  return filesList;
}

const appDir = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app';
const files = getFiles(appDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Remove the inline css variable
  if (content.includes("style={{ '--primary-brand-color': primaryColor } as React.CSSProperties}")) {
    content = content.replace(/ style=\{\{ '--primary-brand-color': primaryColor \} as React\.CSSProperties\}/g, '');
    changed = true;
  }

  // 2. Update setPrimaryColor to also set document root variable
  if (content.includes('setPrimaryColor(data.primaryColor);')) {
    const updateRoot = 'setPrimaryColor(data.primaryColor);\n              if (typeof document !== "undefined") document.documentElement.style.setProperty("--primary-brand-color", data.primaryColor);';
    if (!content.includes('document.documentElement.style.setProperty("--primary-brand-color"')) {
        content = content.replace('setPrimaryColor(data.primaryColor);', updateRoot);
        changed = true;
    }
  }

  // 3. Update hero background color in page.tsx
  if (file.endsWith('page.tsx') && content.includes('(heroBgColor || primaryColor || "#57bc74")')) {
    content = content.replace(
      '(heroBgColor || primaryColor || "#57bc74")',
      '(heroBgColor || "var(--primary-brand-color, #57bc74)")'
    );
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
console.log('Patch complete.');
