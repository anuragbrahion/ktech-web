import React from 'react';
import BaseCMSEditor from '../../../components/BaseCMSEditor';
import {
  getWebsitePrivacy,
  postWebsitePrivacy
} from '../../../redux/slices/website';

export default function PrivacyPolicyEditor() {
  const apiConfig = {
    getAction: getWebsitePrivacy,
    postAction: postWebsitePrivacy,
    getDataKey: 'websitePrivacyGetData',
    postDataKey: 'websitePrivacyPostData'
  };

  const defaultFormData = {
    text: "We respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.",
    pPolicyBanner: {
      heading: "<h1>Privacy Policy</h1>",
      subHeading: "<h2>Your Data, Our Responsibility</h2>",
      bgColor: "#065F46",
      textColor: "#ECFDF5",
      bannerLogo: []
    }
  };

  return (
    <BaseCMSEditor
      pageTitle="Privacy Policy Editor"
      pageDescription="Customize your privacy policy page content"
      apiConfig={apiConfig}
      defaultFormData={defaultFormData}
      bannerFieldName="pPolicyBanner"
    />
  );
}