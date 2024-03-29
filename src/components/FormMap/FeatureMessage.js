import React from 'react';
import { Alert, Icon } from 'antd';
import { getFeatureType } from 'helpers/mapHelpers';

const FeatureMessage = ({
  feature: { properties: { id }, geometry: { type } },
  i,
  ...props
}) => (
  <Alert
    message={`${getFeatureType(type)} ${i}`}
    type="info"
    style={{ marginTop: 12 }}
    closeText={props.editable && <Icon type="delete" style={{ fontSize: 20 }} />}
    afterClose={() => props.removeFeature(id)}
    banner
    showIcon={false}
  />
);

export default FeatureMessage;
