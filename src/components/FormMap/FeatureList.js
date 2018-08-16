import React from 'react';
import { Alert, Icon } from 'antd';
import { getFeatureType } from 'helpers/mapHelpers';

const getMessage = (i, type) => `${getFeatureType(type)} ${i}`;

const FeatureMessage = ({
  feature: { properties: { id }, geometry: { type } },
  i,
  ...props
}) => (
  <Alert
    message={getMessage(i, type)}
    type="info"
    style={{ marginTop: 12 }}
    closeText={props.editable && <Icon type="delete" style={{ fontSize: 20 }} />}
    afterClose={() => props.removeFeature(id)}
    banner
    showIcon={false}
  />
);

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
