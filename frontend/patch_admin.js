const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add states
if (!content.includes('const [contactUsText, setContactUsText]')) {
    content = content.replace(
        '  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);',
        '  const [showLifestyle, setShowLifestyle] = useState<boolean>(true);\n  const [contactUsText, setContactUsText] = useState<string>("Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");\n  const [returnPolicyText, setReturnPolicyText] = useState<string>("We offer a 7-day hassle-free return policy. If you\'re not fully satisfied with your purchase, contact our support team for a full refund.");\n  const [shippingPolicyText, setShippingPolicyText] = useState<string>("We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");'
    );
}

// 2. Add to fetchSettings
if (!content.includes('if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);')) {
    content = content.replace(
        '        const loadedFaqs = data.faqs || [];',
        '        if (data.contactUsText !== undefined) setContactUsText(data.contactUsText);\n        if (data.returnPolicyText !== undefined) setReturnPolicyText(data.returnPolicyText);\n        if (data.shippingPolicyText !== undefined) setShippingPolicyText(data.shippingPolicyText);\n        const loadedFaqs = data.faqs || [];'
    );
}

// 3. Add to originalSettings inside fetchSettings
if (!content.includes('contactUsText: data.contactUsText || "",')) {
    content = content.replace(
        '          googleClientId: data.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com"',
        '          googleClientId: data.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com",\n          contactUsText: data.contactUsText || "",\n          returnPolicyText: data.returnPolicyText || "",\n          shippingPolicyText: data.shippingPolicyText || ""'
    );
}

// 4. Add to handleSaveStorefrontSettings
if (!content.includes('contactUsText,')) {
    content = content.replace(
        '        googleClientId',
        '        googleClientId,\n        contactUsText,\n        returnPolicyText,\n        shippingPolicyText'
    );
}

// 5. Add to handleDiscardStorefrontChanges
if (!content.includes('setContactUsText(originalSettings.contactUsText')) {
    content = content.replace(
        '      setGoogleClientId(originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com");',
        '      setGoogleClientId(originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com");\n      setContactUsText(originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.");\n      setReturnPolicyText(originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you\'re not fully satisfied with your purchase, contact our support team for a full refund.");\n      setShippingPolicyText(originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.");'
    );
}

// 6. Add UI fields in Storefront Settings Tab
const uiCode = `
                        {/* Storefront Policies */}
                        <div className={styles.sectionDivider} style={{ margin: "2rem 0" }} />
                        <h4 className={styles.settingsSubHeading}>Storefront Policies & Popups</h4>
                        <div className={styles.settingsGrid} style={{ gridTemplateColumns: "1fr" }}>
                          <div className={styles.settingsGroup}>
                            <label className={styles.settingsLabel}>Contact Us Text</label>
                            <textarea
                              className={styles.settingsInput}
                              value={contactUsText}
                              onChange={(e) => setContactUsText(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className={styles.settingsGroup}>
                            <label className={styles.settingsLabel}>Return Policy Text</label>
                            <textarea
                              className={styles.settingsInput}
                              value={returnPolicyText}
                              onChange={(e) => setReturnPolicyText(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className={styles.settingsGroup}>
                            <label className={styles.settingsLabel}>Shipping Policy Text</label>
                            <textarea
                              className={styles.settingsInput}
                              value={shippingPolicyText}
                              onChange={(e) => setShippingPolicyText(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
`;
if (!content.includes('Storefront Policies & Popups')) {
    content = content.replace(
        '{/* Developer APIs */}',
        uiCode + '\n                        {/* Developer APIs */}'
    );
}

fs.writeFileSync(file, content);
console.log('Patch applied successfully.');
