import React from 'react';
import { Link, Text } from '@innovaccer/design-system';
import { useHistory } from 'react-router-dom';

const Footer = (props) => {
  const year = new Date().getFullYear();
  let history = useHistory();

  return (
    <footer className="App-footer">
      <Text appearance="white" weight="strong">
        &copy; Copyright {year} Engine
      </Text>
      <Link onClick={() => history.push('/references')}>References</Link>
    </footer>
  );
};

export default Footer;
