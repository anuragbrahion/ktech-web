import React from 'react';
 import {
  getWebsiteAboutUs,
  postWebsiteAboutUs
} from '../../../redux/slices/website';
import BaseCMSEditor from '../../../components/BaseCMSEditor';

export default function AboutUsEditor() {
  const apiConfig = {
    getAction: getWebsiteAboutUs,
    postAction: postWebsiteAboutUs,
    getDataKey: 'websiteAboutUsGetData',
    postDataKey: 'websiteAboutUsPostData'
  };

  const defaultFormData = {
    text: "We are a leading EdTech platform focused on delivering practical, industry-ready education. Our goal is to empower learners with skills that matter in the real world.",
    aboutBanner: {
      heading: "<h1>About Us</h1>",
      subHeading: "<h2>Empowering Learners Everywhere</h2>",
      bgColor: "#1E40AF",
      textColor: "#FFFFFF",
      bannerLogo: []
    }
  };

  return (
    <BaseCMSEditor
      pageTitle="About Us Editor"
      pageDescription="Customize your about us page content"
      apiConfig={apiConfig}
      defaultFormData={defaultFormData}
      bannerFieldName="aboutBanner"
    />
  );
}