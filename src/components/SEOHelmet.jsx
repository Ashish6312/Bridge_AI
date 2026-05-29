import React, { useEffect } from 'react';

const SEOHelmet = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | BridgeAI` : 'BridgeAI — Cross-LLM Context Bridge';

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || 'Bridge your intelligence between ChatGPT, Gemini, and Claude with zero logic decay.';

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords ? keywords.join(', ') : 'AI context, LLM relay, ChatGPT context, Gemini context, Claude context, productivity';
  }, [title, description, keywords]);

  return null;
};

export default SEOHelmet;
