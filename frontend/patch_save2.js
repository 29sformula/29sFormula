const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const missingFields = `
          contactUsText,
          returnPolicyText,
          shippingPolicyText,
          supportText,
          careersText,
          tradeEnquiryText,
          aboutUsText,
          instagramLink,
          facebookLink,
          contactLink,`;

if (!content.includes('aboutUsText,')) { // using aboutUsText as it's definitely not in the payload yet
    // Inject into fetch payload (around line 1325)
    content = content.replace(
        'googleClientId,\n          faqs',
        'googleClientId,\n          faqs,' + missingFields
    );
    
    // Inject into setOriginalSettings
    content = content.replace(
        'googleClientId,\n        faqs',
        'googleClientId,\n        faqs,' + missingFields
    );
    
    fs.writeFileSync(file, content);
    console.log('Saved fields added to payload.');
} else {
    console.log('Payload already updated.');
}
