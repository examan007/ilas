import * as React from 'react';
import { InteractiveLink } from '../ui/InteractiveLink';
import { P } from '../ui/Paragraph';
import { styled } from '../stitches.config';

const LinkContainer = styled('span', {
  display: 'block',
  margin: '8px 0',
});

const RepoReadmeLink: React.VFC = () => (
  <InteractiveLink href="https://www.illuminatiglaserandstyle.com">
    repo readme
  </InteractiveLink>
);

export const Home: React.VFC = () => (
  <div>
     <img src="images/business-card.png" alt="iLaS business card."/>
  </div>
);
