export const fontCategories = [
  {
    category: "Apple & System OS Fonts",
    fonts: [
      { name: "SF Pro", label: "SF Pro (Apple System Sans)" },
      { name: "New York", label: "New York (Apple System Serif)" },
      { name: "SF Mono", label: "SF Mono (Apple System Monospace)" },
      { name: "Segoe UI", label: "Segoe UI (Windows System Sans)" },
      { name: "Helvetica Neue", label: "Helvetica Neue (Classic Apple Sans)" },
      { name: "Georgia", label: "Georgia (Classic Web Serif)" },
      { name: "Garamond", label: "Garamond (Elegant Web Serif)" }
    ]
  },
  {
    category: "Elegant Serifs (Classical & Editorial)",
    fonts: [
      { name: "Cinzel", label: "Cinzel (Classical Roman)" },
      { name: "Playfair Display", label: "Playfair Display (Elegant Editorial)" },
      { name: "Cormorant Garamond", label: "Cormorant Garamond (High-End Luxury)" },
      { name: "Fraunces", label: "Fraunces (Vintage Expressive)" },
      { name: "Bodoni Moda", label: "Bodoni Moda (High-Fashion Contrast)" },
      { name: "Lora", label: "Lora (Contemporary Serif)" },
      { name: "Merriweather", label: "Merriweather (Warm Serif)" },
      { name: "EB Garamond", label: "EB Garamond (Historical Serif)" },
      { name: "Libre Baskerville", label: "Libre Baskerville (Traditional Serif)" },
      { name: "Prata", label: "Prata (Elegant High-Contrast Serif)" },
      { name: "Newsreader", label: "Newsreader (Editorial Serif)" },
      { name: "Cardo", label: "Cardo (Classic Academic Serif)" },
      { name: "Noto Serif", label: "Noto Serif (Universal Serif)" },
      { name: "PT Serif", label: "PT Serif (Modern Work Serif)" },
      { name: "Domine", label: "Domine (Highly Legible Book Serif)" }
    ]
  },
  {
    category: "Sleek Sans-Serifs (Modern & Clean)",
    fonts: [
      { name: "Outfit", label: "Outfit (Default Modern)" },
      { name: "Inter", label: "Inter (Clean UI Sans)" },
      { name: "Roboto", label: "Roboto (Structured Neo-Grotesque)" },
      { name: "Montserrat", label: "Montserrat (Geometric Sans)" },
      { name: "DM Sans", label: "DM Sans (Minimalist Geometric)" },
      { name: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Sleek Clean)" },
      { name: "Poppins", label: "Poppins (Friendly Geometric)" },
      { name: "Open Sans", label: "Open Sans (Neutral Sans)" },
      { name: "Lato", label: "Lato (Warm Sans)" },
      { name: "Raleway", label: "Raleway (Elegant Sans)" },
      { name: "Nunito", label: "Nunito (Soft Rounded Sans)" },
      { name: "Rubik", label: "Rubik (Low-Contrast Sans)" },
      { name: "Heebo", label: "Heebo (Compact Modern Sans)" },
      { name: "Work Sans", label: "Work Sans (Neo-Grotesque Display)" },
      { name: "Manrope", label: "Manrope (Clean Tech Sans)" },
      { name: "Sora", label: "Sora (Tech Display Sans)" },
      { name: "Urbanist", label: "Urbanist (Fashion Sans)" }
    ]
  },
  {
    category: "Modern Display & Bold (Expressive & Experimental)",
    fonts: [
      { name: "Syne", label: "Syne (Futuristic Art-Direction)" },
      { name: "Unbounded", label: "Unbounded (Ultra-Bold Geometric)" },
      { name: "Oswald", label: "Oswald (Condensed Impact)" },
      { name: "Bebas Neue", label: "Bebas Neue (Bold Headline Condensed)" },
      { name: "Archivo Black", label: "Archivo Black (Heavy Metal Sans)" },
      { name: "Syncopate", label: "Syncopate (Wide Futuristic Sans)" },
      { name: "Righteous", label: "Righteous (Art Deco Display)" },
      { name: "Ultra", label: "Ultra (Chunky Slab Serif)" },
      { name: "Anton", label: "Anton (Heavy Condensed Impact)" },
      { name: "Abril Fatface", label: "Abril Fatface (High-Contrast Bold Poster)" },
      { name: "Bungee", label: "Bungee (Urban Signage Display)" },
      { name: "Fredoka", label: "Fredoka (Cheerful Friendly Sans)" },
      { name: "Space Grotesk", label: "Space Grotesk (Tech Brutalist Sans)" },
      { name: "Cinzel Decorative", label: "Cinzel Decorative (Ornate Luxury Serif)" }
    ]
  },
  {
    category: "Monospace & Technical (Brutalist Coding)",
    fonts: [
      { name: "Space Mono", label: "Space Mono (Brutalist Technical)" },
      { name: "Fira Code", label: "Fira Code (Developer Coding Sans)" },
      { name: "Source Code Pro", label: "Source Code Pro (Classic Code Mono)" },
      { name: "JetBrains Mono", label: "JetBrains Mono (Sleek Technical Mono)" },
      { name: "Roboto Mono", label: "Roboto Mono (Clean Grotesque Mono)" },
      { name: "Share Tech Mono", label: "Share Tech Mono (Retro Cyber Tech)" }
    ]
  },
  {
    category: "Handwritten & Artistic (Elegant Scripts)",
    fonts: [
      { name: "Great Vibes", label: "Great Vibes (Classical Script)" },
      { name: "Alex Brush", label: "Alex Brush (Flowing Script)" },
      { name: "Sacramento", label: "Sacramento (Slim Editorial Script)" },
      { name: "Caveat", label: "Caveat (Organic Hand-Written)" },
      { name: "Dancing Script", label: "Dancing Script (Playful Script)" },
      { name: "Pacifico", label: "Pacifico (Retro Fun Script)" },
      { name: "Playball", label: "Playball (Sporty Calligraphy)" }
    ]
  }
];

export const getFontFamilyStack = (fontName: string) => {
  if (fontName === "SF Pro") {
    return `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "New York") {
    return `"New York", Georgia, "Times New Roman", serif`;
  }
  if (fontName === "SF Mono") {
    return `"SF Mono", Consolas, "Courier New", monospace`;
  }
  if (fontName === "Segoe UI") {
    return `"Segoe UI", -apple-system, Roboto, Helvetica, Arial, sans-serif`;
  }
  if (fontName === "Helvetica Neue") {
    return `"Helvetica Neue", Helvetica, Arial, sans-serif`;
  }
  return `"${fontName}", sans-serif`;
};
