import React from 'react';
import BaseCMSEditor from '../../../components/BaseCMSEditor';
import {
  getWebsiteWhyUs,
  postWebsiteWhyUs
} from '../../../redux/slices/website';

export default function WhyUsEditor() {
  const apiConfig = {
    getAction: getWebsiteWhyUs,
    postAction: postWebsiteWhyUs,
    getDataKey: 'websiteWhyUsGetData',
    postDataKey: 'websiteWhyUsPostData'
  };

  const defaultFormData = {
    text: "We focus on quality education, expert instructors, hands-on learning, and real-world outcomes. Our platform is designed to help learners succeed faster and smarter.",
    whyUsBanner: {
      heading: "<h1>Why Choose Us</h1>",
      subHeading: "<h2>Because Your Success Matters</h2>",
      bgColor: "#7C3AED",
      textColor: "#FFFFFF",
      bannerLogo: []
    }
  };

  return (
    <BaseCMSEditor
      pageTitle="Why Us Editor"
      pageDescription="Customize your why us page content"
      apiConfig={apiConfig}
      defaultFormData={defaultFormData}
      bannerFieldName="whyUsBanner"
    />
  );
}