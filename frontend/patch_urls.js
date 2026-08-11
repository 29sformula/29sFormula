const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

const helperCode = `
  const formatUrl = (url: string) => {
    if (!url || url === "#") return "#";
    if (url.startsWith("/")) return url;
    if (!/^https?:\\/\\//i.test(url)) {
      return \`https://\${url}\`;
    }
    return url;
  };
`;

if (!content.includes('formatUrl(url: string)')) {
  // Inject the helper before the return statement
  content = content.replace(
    '  return (',
    helperCode + '\n  return ('
  );

  // Update the hrefs
  content = content.replace(
    '<a href={instagramLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Instagram</a>',
    '<a href={formatUrl(instagramLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Instagram</a>'
  );
  content = content.replace(
    '<a href={facebookLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Facebook</a>',
    '<a href={formatUrl(facebookLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Facebook</a>'
  );
  content = content.replace(
    '<a href={contactLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Contact</a>',
    '<a href={formatUrl(contactLink)} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Contact</a>'
  );

  fs.writeFileSync(file, content);
  console.log('URLs patched.');
} else {
  console.log('URLs already patched.');
}
