import React, { useEffect } from 'react';

const SEOHelmet = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | Bridge AI` : 'Bridge AI — Universal Chat & Prompt Sync';

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description || 'Instantly bridge, summarize, and sync conversation contexts across ChatGPT, Claude, Gemini, and DeepSeek without context loss.';

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
