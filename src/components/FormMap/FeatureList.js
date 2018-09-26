import React from 'react';
import { Alert } from 'antd';
import FeatureMessage from 'components/FormMap/FeatureMessage';

const FeaturesList = props => {
  const features = props.features
    .sort((a, b) => a.properties.timestampCreatedAt > b.properties.timestampCreatedAt);
  return features.length > 0 ? (
    <div>
      {features.map((feature, i) => (
        <FeatureMessage
          key={feature.properties.id}
          i={i}
          feature={feature}
          {...props}
        />
      ))}
    </div>
  ) : <Alert message="Dessiner la zone concernée sur la carte" type="info" />;
};

export default FeaturesList;
