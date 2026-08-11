const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/backend/index.js';
let content = fs.readFileSync(file, 'utf8');

const missingDestructure = `
      supportText,
      careersText,
      tradeEnquiryText,
      aboutUsText,
      instagramLink,
      facebookLink,
      contactLink,`;

if (!content.includes('instagramLink,')) {
    content = content.replace(
        'shippingPolicyText\n    } = req.body;',
        'shippingPolicyText,' + missingDestructure + '\n    } = req.body;'
    );
}

const missingAssignments = `
    if (supportText !== undefined) settings.supportText = supportText;
    if (careersText !== undefined) settings.careersText = careersText;
    if (tradeEnquiryText !== undefined) settings.tradeEnquiryText = tradeEnquiryText;
    if (aboutUsText !== undefined) settings.aboutUsText = aboutUsText;
    if (instagramLink !== undefined) settings.instagramLink = instagramLink;
    if (facebookLink !== undefined) settings.facebookLink = facebookLink;
    if (contactLink !== undefined) settings.contactLink = contactLink;`;

if (!content.includes('settings.instagramLink =')) {
    content = content.replace(
        'if (shippingPolicyText !== undefined) settings.shippingPolicyText = shippingPolicyText;',
        'if (shippingPolicyText !== undefined) settings.shippingPolicyText = shippingPolicyText;' + missingAssignments
    );
    fs.writeFileSync(file, content);
    console.log('Backend save logic patched.');
} else {
    console.log('Backend save logic already patched.');
}
