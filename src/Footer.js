import React from 'react';
import { Link, Text } from 'design-system';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="App-footer">
      <Text
        appearance="white"
        weight="strong"
      >
        &copy; Copyright { year } Sandesh Choudhary
      </Text>
      <Link href="/covid/references">References</Link>
    </footer>
  );
}

export default Footer;
