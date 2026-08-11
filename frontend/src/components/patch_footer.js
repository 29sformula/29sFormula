const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import React, { useState, useEffect }')) {
    content = content.replace('import React from "react";', 'import React, { useState, useEffect } from "react";');
}

const componentStart = `export default function Footer() {`;
const componentState = `
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [contactUsText, setContactUsText] = useState<string>("");
  const [returnPolicyText, setReturnPolicyText] = useState<string>("");
  const [shippingPolicyText, setShippingPolicyText] = useState<string>("");

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.contactUsText) setContactUsText(data.contactUsText);
        if (data.returnPolicyText) setReturnPolicyText(data.returnPolicyText);
        if (data.shippingPolicyText) setShippingPolicyText(data.shippingPolicyText);
      })
      .catch(err => console.warn("Failed to load policies for footer:", err));
  }, []);

  const getPopupTitle = () => {
    switch (activePopup) {
      case 'contact': return 'Contact Us';
      case 'return': return 'Return Policy';
      case 'shipping': return 'Shipping Policy';
      default: return '';
    }
  };

  const getPopupContent = () => {
    switch (activePopup) {
      case 'contact': return contactUsText;
      case 'return': return returnPolicyText;
      case 'shipping': return shippingPolicyText;
      default: return '';
    }
  };
`;

if (!content.includes('const [activePopup, setActivePopup]')) {
    content = content.replace(componentStart, componentStart + componentState);
}

// Update the links in Footer
const linksOld = `          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/shop" className={styles.footerLink}>All Products</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
            <Link href="/" className={styles.footerLink}>Return Policy</Link>
            <Link href="/" className={styles.footerLink}>Shipping Policy</Link>
          </div>`;

const linksNew = `          <div className={styles.footerLinks}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/shop" className={styles.footerLink}>All Products</Link>
            <button onClick={() => setActivePopup('contact')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Contact Us</button>
            <button onClick={() => setActivePopup('return')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Return Policy</button>
            <button onClick={() => setActivePopup('shipping')} className={styles.footerLink} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}>Shipping Policy</button>
          </div>`;

if (content.includes(linksOld)) {
    content = content.replace(linksOld, linksNew);
}

// Add the modal HTML before the final Fragment closing tag
const modalHtml = `
      {/* Policy Modal */}
      <div 
        className={\`\${styles.policyModalOverlay} \${activePopup ? styles.open : ""}\`}
        onClick={() => setActivePopup(null)}
      >
        <div 
          className={styles.policyModalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className={styles.policyModalCloseBtn}
            onClick={() => setActivePopup(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className={styles.policyModalTitle}>{getPopupTitle()}</h2>
          <div className={styles.policyModalText}>
            {getPopupContent()}
          </div>
        </div>
      </div>
    </>
`;

if (!content.includes('policyModalOverlay')) {
    content = content.replace(/<\/>\s*$/, modalHtml);
}

fs.writeFileSync(file, content);
console.log('Patch applied successfully.');
