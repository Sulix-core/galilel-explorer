import React from 'react';

import Card from './Card';

const CardLinks = () => (
  <Card title="Links">
    {config.socialMedia.map((media) => (
      [<a href={media.link} target="_blank">{media.title}</a>, <br />]
    ))}
  </Card>
);

export default CardLinks;
