import React from 'react';
import { FooterHelp, Link } from '@shopify/polaris';

const AppFooter = () => (
  <FooterHelp>
    For more details, please go to{' '}
    <Link
      url="#"
      onClick={() => {
        window.open('https://mapleapps.cc');
      }}
    >
      Maple Apps Inc.
    </Link>{' '}
    website.
  </FooterHelp>
);

export default AppFooter;
