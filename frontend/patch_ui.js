const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const uiCode = `
                      {/* Storefront Policies & Popups */}
                      <div className={styles.dashboardCard} style={{ marginBottom: "20px" }}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => setActiveCustomizerSection(activeCustomizerSection === "policies" ? null : "policies")}
                        >
                          <h2 className={styles.cardHeaderTitleNoBorder}>Storefront Policies & Popups</h2>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={\`\${styles.chevronIcon} \${activeCustomizerSection === "policies" ? styles.chevronRotated : ""}\`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                        {activeCustomizerSection === "policies" && (
                          <div className={styles.accordionContent}>
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
                          </div>
                        )}
                      </div>
`;

if (!content.includes('Storefront Policies & Popups')) {
    content = content.replace(
        '{/* SUB TAB 2: PRODUCT PREVIEW PAGE CUSTOMIZER */}',
        uiCode + '\n                  {/* SUB TAB 2: PRODUCT PREVIEW PAGE CUSTOMIZER */}'
    );
    fs.writeFileSync(file, content);
    console.log('UI Patch applied.');
} else {
    console.log('UI Patch already exists.');
}
