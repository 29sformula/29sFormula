const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The section added earlier looks like this:
/*
                            <div className={styles.settingsGrid} style={{ gridTemplateColumns: "1fr" }}>
                              <div className={styles.settingsGroup}>
                                <label className={styles.settingsLabel}>Contact Us Text</label>
                                <textarea
                                  className={styles.settingsInput}
*/

const oldBlock = `                            <div className={styles.settingsGrid} style={{ gridTemplateColumns: "1fr" }}>
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
                            </div>`;

const newBlock = `                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Contact Us Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={contactUsText}
                                  onChange={(e) => setContactUsText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Return Policy Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={returnPolicyText}
                                  onChange={(e) => setReturnPolicyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Shipping Policy Text</label>
                                <textarea
                                  className={styles.textareaInput}
                                  value={shippingPolicyText}
                                  onChange={(e) => setShippingPolicyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync(file, content);
    console.log('Styles patched successfully.');
} else {
    console.log('Could not find the old block to replace.');
}
