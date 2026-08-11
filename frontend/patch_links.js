const fs = require('fs');

// --- BACKEND ---
const backendFile = '/Users/bhanubharat/Desktop/B/projects/29s-formula/backend/index.js';
let bContent = fs.readFileSync(backendFile, 'utf8');

const newBackendFields = `
  instagramLink: { type: String, default: "#" },
  facebookLink: { type: String, default: "#" },
  contactLink: { type: String, default: "#" },
`;

if (!bContent.includes('instagramLink: {')) {
  bContent = bContent.replace(
    'shippingPolicyText: {',
    newBackendFields + '  shippingPolicyText: {'
  );
  fs.writeFileSync(backendFile, bContent);
  console.log('Backend patched.');
}

// --- ADMIN UI ---
const adminFile = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let aContent = fs.readFileSync(adminFile, 'utf8');

const uiStateFields = `  const [instagramLink, setInstagramLink] = useState<string>("#");
  const [facebookLink, setFacebookLink] = useState<string>("#");
  const [contactLink, setContactLink] = useState<string>("#");
`;

if (!aContent.includes('const [instagramLink, setInstagramLink]')) {
  aContent = aContent.replace(
    '  const [contactUsText, setContactUsText]',
    uiStateFields + '  const [contactUsText, setContactUsText]'
  );
  
  aContent = aContent.replace(
    'contactUsText !== (originalSettings.contactUsText',
    `instagramLink !== (originalSettings.instagramLink || "#") ||
    facebookLink !== (originalSettings.facebookLink || "#") ||
    contactLink !== (originalSettings.contactLink || "#") ||
    contactUsText !== (originalSettings.contactUsText`
  );

  aContent = aContent.replace(
    'if (contactUsText !== (originalSettings.contactUsText',
    `if (instagramLink !== (originalSettings.instagramLink || "#")) changes.push("Instagram Link");
    if (facebookLink !== (originalSettings.facebookLink || "#")) changes.push("Facebook Link");
    if (contactLink !== (originalSettings.contactLink || "#")) changes.push("Contact Link");
    if (contactUsText !== (originalSettings.contactUsText`
  );

  aContent = aContent.replace(
    'if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);',
    `if (data.instagramLink !== undefined) setInstagramLink(data.instagramLink);
        if (data.facebookLink !== undefined) setFacebookLink(data.facebookLink);
        if (data.contactLink !== undefined) setContactLink(data.contactLink);
        if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);`
  );

  aContent = aContent.replace(
    'contactUsText: data.contactUsText || "",',
    `instagramLink: data.instagramLink || "#",
          facebookLink: data.facebookLink || "#",
          contactLink: data.contactLink || "#",
          contactUsText: data.contactUsText || "",`
  );
  
  aContent = aContent.replace(
    'contactUsText: contactUsText,',
    `instagramLink: instagramLink,
        facebookLink: facebookLink,
        contactLink: contactLink,
        contactUsText: contactUsText,`
  );

  aContent = aContent.replace(
    'setContactUsText(originalSettings.contactUsText',
    `setInstagramLink(originalSettings.instagramLink || "#");
      setFacebookLink(originalSettings.facebookLink || "#");
      setContactLink(originalSettings.contactLink || "#");
      setContactUsText(originalSettings.contactUsText`
  );

  const uiElements = `                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Instagram Link</label>
                                <textarea className={styles.textareaInput} value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} rows={1} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Facebook Link</label>
                                <textarea className={styles.textareaInput} value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} rows={1} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Contact Page Link</label>
                                <textarea className={styles.textareaInput} value={contactLink} onChange={(e) => setContactLink(e.target.value)} rows={1} />
                              </div>
`;

  aContent = aContent.replace(
    '<div className={styles.inputGroup}>\n                                <label className={styles.inputLabel}>Contact Us Text</label>',
    uiElements + '                              <div className={styles.inputGroup}>\n                                <label className={styles.inputLabel}>Contact Us Text</label>'
  );

  fs.writeFileSync(adminFile, aContent);
  console.log('Admin patched.');
}

// --- FOOTER ---
const footerFile = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/components/Footer.tsx';
let fContent = fs.readFileSync(footerFile, 'utf8');

if (!fContent.includes('const [instagramLink, setInstagramLink]')) {
  fContent = fContent.replace(
    '  const [contactUsText, setContactUsText]',
    `  const [instagramLink, setInstagramLink] = useState<string>("#");
  const [facebookLink, setFacebookLink] = useState<string>("#");
  const [contactLink, setContactLink] = useState<string>("#");
  const [contactUsText, setContactUsText]`
  );

  fContent = fContent.replace(
    'if (data.contactUsText) setContactUsText(data.contactUsText);',
    `if (data.instagramLink) setInstagramLink(data.instagramLink);
        if (data.facebookLink) setFacebookLink(data.facebookLink);
        if (data.contactLink) setContactLink(data.contactLink);
        if (data.contactUsText) setContactUsText(data.contactUsText);`
  );
  
  fContent = fContent.replace(
    '<a href="#" className={styles.footerLink} rel="noopener noreferrer">Instagram</a>',
    `<a href={instagramLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Instagram</a>`
  );
  fContent = fContent.replace(
    '<a href="#" className={styles.footerLink} rel="noopener noreferrer">Facebook</a>',
    `<a href={facebookLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Facebook</a>`
  );
  fContent = fContent.replace(
    '<Link href="/" className={styles.footerLink}>Contact</Link>',
    `<a href={contactLink} className={styles.footerLink} rel="noopener noreferrer" target="_blank">Contact</a>`
  );

  fs.writeFileSync(footerFile, fContent);
  console.log('Footer patched.');
}

