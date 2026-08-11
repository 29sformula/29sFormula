const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add createPortal import
if (!content.includes("import { createPortal } from 'react-dom';")) {
  content = content.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport { createPortal } from "react-dom";'
  );
}

// 2. Add mounted state
if (!content.includes('const [mounted, setMounted] = useState(false);')) {
  content = content.replace(
    'const [shippingPolicyText, setShippingPolicyText] = useState<string>("");',
    'const [shippingPolicyText, setShippingPolicyText] = useState<string>("");\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => { setMounted(true); }, []);'
  );
}

// 3. Move the modal into a portal
const modalTarget = `{/* Policy Modal */}
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
      </div>`;

const modalReplacement = `{mounted && createPortal(
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
        </div>,
        document.body
      )}`;

if (content.includes('{/* Policy Modal */}')) {
  content = content.replace(modalTarget, modalReplacement);
  fs.writeFileSync(file, content);
  console.log("Portal patched");
}
