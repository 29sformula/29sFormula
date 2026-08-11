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

if (!content.includes('contactUsText,')) {
    // Inject into fetch payload
    content = content.replace(
        'googleClientId,',
        'googleClientId,' + missingFields
    );
    fs.writeFileSync(file, content);
    console.log('Saved fields added to payload.');
} else {
    console.log('Payload already updated.');
}
