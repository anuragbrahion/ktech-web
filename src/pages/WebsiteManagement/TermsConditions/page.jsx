import React from 'react';
import BaseCMSEditor from '../../../components/BaseCMSEditor';
import {
  getWebsiteTerms,
  postWebsiteTerms
} from '../../../redux/slices/website';

export default function TermsAndConditionsEditor() {
  const apiConfig = {
    getAction: getWebsiteTerms,
    postAction: postWebsiteTerms,
    getDataKey: 'websiteTermsGetData',
    postDataKey: 'websiteTermsPostData'
  };

  const defaultFormData = {
    text: "By using this platform, you agree to comply with all applicable laws and our Terms and Conditions. Please review them carefully before proceeding.",
    termConditionBanner: {
      heading: "<h1>Terms & Conditions</h1>",
      subHeading: "<h2>Please Read Carefully</h2>",
      bgColor: "#111827",
      textColor: "#F9FAFB",
      bannerLogo: []
    }
  };

  return (
    <BaseCMSEditor
      pageTitle="Terms & Conditions Editor"
      pageDescription="Customize your terms and conditions page content"
      apiConfig={apiConfig}
      defaultFormData={defaultFormData}
      bannerFieldName="termConditionBanner"
    />
  );
}