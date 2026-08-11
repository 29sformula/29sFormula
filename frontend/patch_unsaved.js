const fs = require('fs');
const file = '/Users/bhanubharat/Desktop/B/projects/29s-formula/frontend/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `    googleClientId !== (originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com") ||`;
const replacement1 = `    googleClientId !== (originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com") ||
    contactUsText !== (originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.") ||
    returnPolicyText !== (originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.") ||
    shippingPolicyText !== (originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.") ||`;

if (content.includes(target1) && !content.includes('contactUsText !== (originalSettings.contactUsText')) {
    content = content.replace(target1, replacement1);
}

const target2 = `    if (googleClientId !== (originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com")) changes.push("Google Analytics Client ID");`;
const replacement2 = `    if (googleClientId !== (originalSettings.googleClientId || "753896502014-yourmockclientid.apps.googleusercontent.com")) changes.push("Google Analytics Client ID");
    if (contactUsText !== (originalSettings.contactUsText || "Need help? Email us at hello@29sformula.in and our support team will get back to you within 24 hours.")) changes.push("Contact Us Text");
    if (returnPolicyText !== (originalSettings.returnPolicyText || "We offer a 7-day hassle-free return policy. If you're not fully satisfied with your purchase, contact our support team for a full refund.")) changes.push("Return Policy Text");
    if (shippingPolicyText !== (originalSettings.shippingPolicyText || "We offer free shipping across India. Orders are typically processed within 1-2 business days and delivered within 4-7 business days.")) changes.push("Shipping Policy Text");`;

if (content.includes(target2) && !content.includes('changes.push("Contact Us Text")')) {
    content = content.replace(target2, replacement2);
}

fs.writeFileSync(file, content);
console.log('Unsaved changes patched successfully.');
