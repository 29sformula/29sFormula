const fs = require('fs');

// --- BACKEND ---
const backendFile = '/Users/bhanubharat/Desktop/B/projects/29s-formula/backend/index.js';
let bContent = fs.readFileSync(backendFile, 'utf8');

const newBackendFields = `
  supportText: { type: String, default: "For support inquiries, please contact us." },
  careersText: { type: String, default: "Join our team! Check out our open positions." },
  tradeEnquiryText: { type: String, default: "For trade and wholesale inquiries, contact our B2B team." },
  aboutUsText: { type: String, default: "We are 29sFORMULA, redefining luxury." },
`;

if (!bContent.includes('supportText: {')) {
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

const uiStateFields = `  const [supportText, setSupportText] = useState<string>("For support inquiries, please contact us.");
  const [careersText, setCareersText] = useState<string>("Join our team! Check out our open positions.");
  const [tradeEnquiryText, setTradeEnquiryText] = useState<string>("For trade and wholesale inquiries, contact our B2B team.");
  const [aboutUsText, setAboutUsText] = useState<string>("We are 29sFORMULA, redefining luxury.");
`;

if (!aContent.includes('const [supportText, setSupportText]')) {
  aContent = aContent.replace(
    '  const [contactUsText, setContactUsText]',
    uiStateFields + '  const [contactUsText, setContactUsText]'
  );
  
  aContent = aContent.replace(
    'contactUsText !== (originalSettings.contactUsText',
    `supportText !== (originalSettings.supportText || "For support inquiries, please contact us.") ||
    careersText !== (originalSettings.careersText || "Join our team! Check out our open positions.") ||
    tradeEnquiryText !== (originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.") ||
    aboutUsText !== (originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.") ||
    contactUsText !== (originalSettings.contactUsText`
  );

  aContent = aContent.replace(
    'if (contactUsText !== (originalSettings.contactUsText',
    `if (supportText !== (originalSettings.supportText || "For support inquiries, please contact us.")) changes.push("Support Text");
    if (careersText !== (originalSettings.careersText || "Join our team! Check out our open positions.")) changes.push("Careers Text");
    if (tradeEnquiryText !== (originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.")) changes.push("Trade Enquiry Text");
    if (aboutUsText !== (originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.")) changes.push("About Us Text");
    if (contactUsText !== (originalSettings.contactUsText`
  );

  aContent = aContent.replace(
    'if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);',
    `if (data.supportText !== undefined) setSupportText(data.supportText);
        if (data.careersText !== undefined) setCareersText(data.careersText);
        if (data.tradeEnquiryText !== undefined) setTradeEnquiryText(data.tradeEnquiryText);
        if (data.aboutUsText !== undefined) setAboutUsText(data.aboutUsText);
        if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);`
  );

  aContent = aContent.replace(
    'contactUsText: data.contactUsText || "",',
    `supportText: data.supportText || "",
          careersText: data.careersText || "",
          tradeEnquiryText: data.tradeEnquiryText || "",
          aboutUsText: data.aboutUsText || "",
          contactUsText: data.contactUsText || "",`
  );
  
  aContent = aContent.replace(
    'contactUsText: contactUsText,',
    `supportText: supportText,
        careersText: careersText,
        tradeEnquiryText: tradeEnquiryText,
        aboutUsText: aboutUsText,
        contactUsText: contactUsText,`
  );

  aContent = aContent.replace(
    'setContactUsText(originalSettings.contactUsText || "Need help?',
    `setSupportText(originalSettings.supportText || "For support inquiries, please contact us.");
      setCareersText(originalSettings.careersText || "Join our team! Check out our open positions.");
      setTradeEnquiryText(originalSettings.tradeEnquiryText || "For trade and wholesale inquiries, contact our B2B team.");
      setAboutUsText(originalSettings.aboutUsText || "We are 29sFORMULA, redefining luxury.");
      setContactUsText(originalSettings.contactUsText || "Need help?`
  );

  const uiElements = `                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Support Text</label>
                                <textarea className={styles.textareaInput} value={supportText} onChange={(e) => setSupportText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Careers Text</label>
                                <textarea className={styles.textareaInput} value={careersText} onChange={(e) => setCareersText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Trade Enquiry Text</label>
                                <textarea className={styles.textareaInput} value={tradeEnquiryText} onChange={(e) => setTradeEnquiryText(e.target.value)} rows={3} />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>About Us Text</label>
                                <textarea className={styles.textareaInput} value={aboutUsText} onChange={(e) => setAboutUsText(e.target.value)} rows={3} />
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

if (!fContent.includes('const [supportText, setSupportText]')) {
  fContent = fContent.replace(
    '  const [contactUsText, setContactUsText]',
    `  const [supportText, setSupportText] = useState<string>("");
  const [careersText, setCareersText] = useState<string>("");
  const [tradeEnquiryText, setTradeEnquiryText] = useState<string>("");
  const [aboutUsText, setAboutUsText] = useState<string>("");
  const [contactUsText, setContactUsText]`
  );

  fContent = fContent.replace(
    'if (data.contactUsText) setContactUsText(data.contactUsText);',
    `if (data.supportText) setSupportText(data.supportText);
        if (data.careersText) setCareersText(data.careersText);
        if (data.tradeEnquiryText) setTradeEnquiryText(data.tradeEnquiryText);
        if (data.aboutUsText) setAboutUsText(data.aboutUsText);
        if (data.contactUsText) setContactUsText(data.contactUsText);`
  );

  fContent = fContent.replace(
    "case 'contact': return 'Contact Us';",
    `case 'support': return 'Support';
      case 'careers': return 'Careers';
      case 'trade': return 'Trade Enquiry';
      case 'about': return 'About Us';
      case 'contact': return 'Contact Us';`
  );

  fContent = fContent.replace(
    "case 'contact': return contactUsText;",
    `case 'support': return supportText;
      case 'careers': return careersText;
      case 'trade': return tradeEnquiryText;
      case 'about': return aboutUsText;
      case 'contact': return contactUsText;`
  );
  
  fContent = fContent.replace(
    '<Link href="/" className={styles.footerLink}>Support</Link>',
    `<button onClick={() => setActivePopup('support')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Support</button>`
  );
  fContent = fContent.replace(
    '<Link href="/" className={styles.footerLink}>Careers</Link>',
    `<button onClick={() => setActivePopup('careers')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Careers</button>`
  );
  fContent = fContent.replace(
    '<Link href="/" className={styles.footerLink}>Trade Enquiry</Link>',
    `<button onClick={() => setActivePopup('trade')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Trade Enquiry</button>`
  );
  fContent = fContent.replace(
    '<Link href="/" className={styles.footerLink}>About Us</Link>',
    `<button onClick={() => setActivePopup('about')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>About Us</button>`
  );

  fs.writeFileSync(footerFile, fContent);
  console.log('Footer patched.');
}

