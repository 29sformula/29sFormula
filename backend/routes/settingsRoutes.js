import express from "express";
import Settings from "../models/Settings.js";
import { cachedSettings, setCachedSettings, invalidateSettingsCache } from "../utils/cache.js";

const router = express.Router();

router.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the 29s Formula Perfume E-commerce API",
    status: "healthy",
    version: "1.0.0"
  });
});

router.get("/api/settings", async (req, res) => {
  try {
    if (cachedSettings) {
      return res.json(cachedSettings);
    }
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    setCachedSettings(settings);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/api/settings", async (req, res) => {
  try {
    const { 
      tickerText, 
      tickerSpeed,
      announcementText, 
      heroTitle, 
      heroManifesto, 
      videoTitle, 
      videoSubtitle, 
      videoUrl, 
      videoFallbackColor,
      lifestyleText,
      lifestyleImage,
      primaryColor,
      showTicker,
      showAnnouncement,
      showVideo,
      showLifestyle,
      faqs,
      googleClientId,
      contactUsText,
      returnPolicyText,
      shippingPolicyText,
      supportText,
      careersText,
      tradeEnquiryText,
      aboutUsText,
      instagramLink,
      facebookLink,
      contactLink
    } = req.body;
    
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }

    const oldVideoUrl = settings.videoUrl;

    if (tickerText !== undefined) settings.tickerText = tickerText;
    if (tickerSpeed !== undefined) settings.tickerSpeed = tickerSpeed;
    if (announcementText !== undefined) settings.announcementText = announcementText;
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (req.body.heroTitleFontType !== undefined) settings.heroTitleFontType = req.body.heroTitleFontType;
    if (req.body.heroTitleFontColor !== undefined) settings.heroTitleFontColor = req.body.heroTitleFontColor;
    if (req.body.heroTitleFontSize !== undefined) settings.heroTitleFontSize = req.body.heroTitleFontSize;
    if (req.body.heroTitleFontAlignment !== undefined) settings.heroTitleFontAlignment = req.body.heroTitleFontAlignment;
    if (req.body.heroTitleFontWeight !== undefined) settings.heroTitleFontWeight = req.body.heroTitleFontWeight;
    if (heroManifesto !== undefined) settings.heroManifesto = heroManifesto;
    if (req.body.heroBgType !== undefined) settings.heroBgType = req.body.heroBgType;
    if (req.body.heroBgColor !== undefined) settings.heroBgColor = req.body.heroBgColor;
    if (req.body.heroBgImage !== undefined) settings.heroBgImage = req.body.heroBgImage;
    if (req.body.heroBgVideo !== undefined) settings.heroBgVideo = req.body.heroBgVideo;
    if (req.body.heroTemplate !== undefined) settings.heroTemplate = req.body.heroTemplate;
    if (req.body.showHeroTitle !== undefined) settings.showHeroTitle = req.body.showHeroTitle;
    if (req.body.showHeroManifesto !== undefined) settings.showHeroManifesto = req.body.showHeroManifesto;
    if (req.body.showHeroButton !== undefined) settings.showHeroButton = req.body.showHeroButton;
    if (req.body.heroButtonText !== undefined) settings.heroButtonText = req.body.heroButtonText;
    if (req.body.heroButtonStyle !== undefined) settings.heroButtonStyle = req.body.heroButtonStyle;
    if (req.body.heroButtonSize !== undefined) settings.heroButtonSize = req.body.heroButtonSize;
    if (req.body.heroButtonColor !== undefined) settings.heroButtonColor = req.body.heroButtonColor;
    if (req.body.heroButtonTextColor !== undefined) settings.heroButtonTextColor = req.body.heroButtonTextColor;
    if (req.body.heroManifestoFontType !== undefined) settings.heroManifestoFontType = req.body.heroManifestoFontType;
    if (req.body.heroManifestoFontColor !== undefined) settings.heroManifestoFontColor = req.body.heroManifestoFontColor;
    if (req.body.heroManifestoFontSize !== undefined) settings.heroManifestoFontSize = req.body.heroManifestoFontSize;
    if (req.body.heroManifestoFontAlignment !== undefined) settings.heroManifestoFontAlignment = req.body.heroManifestoFontAlignment;
    if (req.body.heroManifestoFontWeight !== undefined) settings.heroManifestoFontWeight = req.body.heroManifestoFontWeight;
                        
    // Product Preview Page settings
    if (req.body.showProductReviews !== undefined) settings.showProductReviews = req.body.showProductReviews;
    if (req.body.showProductExploreMore !== undefined) settings.showProductExploreMore = req.body.showProductExploreMore;
    if (req.body.showProductFaq !== undefined) settings.showProductFaq = req.body.showProductFaq;
    if (req.body.usageGuideText !== undefined) settings.usageGuideText = req.body.usageGuideText;
    if (req.body.exploreMoreTitle !== undefined) settings.exploreMoreTitle = req.body.exploreMoreTitle;
    if (req.body.deliverySubtext !== undefined) settings.deliverySubtext = req.body.deliverySubtext;
    if (videoTitle !== undefined) settings.videoTitle = videoTitle;
    if (videoSubtitle !== undefined) settings.videoSubtitle = videoSubtitle;
    if (videoUrl !== undefined) settings.videoUrl = videoUrl;
    if (videoFallbackColor !== undefined) settings.videoFallbackColor = videoFallbackColor;
    if (lifestyleText !== undefined) settings.lifestyleText = lifestyleText;
    if (lifestyleImage !== undefined) settings.lifestyleImage = lifestyleImage;
    if (req.body.primaryColor !== undefined) settings.primaryColor = req.body.primaryColor;
    if (req.body.brandLogoType !== undefined) settings.brandLogoType = req.body.brandLogoType;
    if (req.body.brandLogoValue !== undefined) settings.brandLogoValue = req.body.brandLogoValue;
    if (showTicker !== undefined) settings.showTicker = showTicker;
    if (showAnnouncement !== undefined) settings.showAnnouncement = showAnnouncement;
    if (showVideo !== undefined) settings.showVideo = showVideo;
    if (showLifestyle !== undefined) settings.showLifestyle = showLifestyle;
    if (faqs !== undefined) settings.faqs = faqs;
    if (googleClientId !== undefined) settings.googleClientId = googleClientId;
    if (contactUsText !== undefined) settings.contactUsText = contactUsText;
    if (returnPolicyText !== undefined) settings.returnPolicyText = returnPolicyText;
    if (shippingPolicyText !== undefined) settings.shippingPolicyText = shippingPolicyText;
    if (supportText !== undefined) settings.supportText = supportText;
    if (careersText !== undefined) settings.careersText = careersText;
    if (tradeEnquiryText !== undefined) settings.tradeEnquiryText = tradeEnquiryText;
    if (aboutUsText !== undefined) settings.aboutUsText = aboutUsText;
    if (instagramLink !== undefined) settings.instagramLink = instagramLink;
    if (facebookLink !== undefined) settings.facebookLink = facebookLink;
    if (contactLink !== undefined) settings.contactLink = contactLink;

    await settings.save();

    // Update in-memory cache
    setCachedSettings(settings);

    // Delete old background video from Cloudinary if changed/removed
    if (videoUrl !== undefined && oldVideoUrl && oldVideoUrl !== videoUrl) {
      await deleteFromCloudinary(oldVideoUrl);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to save page settings" });
  }
});

export default router;
