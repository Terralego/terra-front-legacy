import React from 'react';
import { Alert, Icon, Modal, Spin } from 'antd';
import { incidenceMessages } from './FormMap.config';

const FORBIDDEN_DRAW = 4;

const getType = type => {
  switch (type) {
    case 'Polygon':
      return 'Zone';
    case 'Point':
      return 'Point';
    default:
      return 'Parcours';
  }
};

const getMessage = (incidence, i, type) => {
  let message = `${getType(type)} ${i}`;

  if (incidence) {
    message += ` : incidence ${incidence.GRIDCODE}`;
    if (incidence.date_from && incidence.date_to) {
      message += ` du ${incidence.date_from} au ${incidence.date_to}`;
    }
  }
  return message;
};

const ForbidenDrawn = ({ id, removeFeature }) => {
  Modal.error({
    title: 'ZONE INTERDITE !',
    content: 'Le parcours que vous avez tracé se situe dans une zone qui possède un niveau d\'incidence très élevé (niveau 4) sur l\'environnement. Pour cette raison, vous ne pouvez pas réaliser l\'activité que vous souhaitez sur cette zone.',
    onOk: () => removeFeature(id),
  });
  return null;
};

const FeatureMessage = ({
  feature: { properties: { incidence, id }, geometry: { type } },
  i,
  ...props
}) => {
  const GRIDCODE = incidence ? incidence.GRIDCODE : 'pending';
  const message = type === 'Line' ? incidenceMessages.parcours : incidenceMessages.zone;

  if (incidence && GRIDCODE === FORBIDDEN_DRAW) {
    return <ForbidenDrawn id={id} removeFeature={props.removeFeature} />;
  }

  return (
    <Alert
      message={getMessage(incidence, i, type)}
      description={
        <React.Fragment>
          {GRIDCODE === 'pending' && <Spin size="small" style={{ marginRight: 12 }} />}
          {message[GRIDCODE] && message[GRIDCODE].text}
        </React.Fragment>
      }
      type={message[GRIDCODE] ? message[GRIDCODE].type : 'info'}
      style={{ marginTop: 12 }}
      closeText={props.editable && <Icon type="delete" style={{ fontSize: 20, color: message[GRIDCODE].color }} />}
      afterClose={() => props.removeFeature(id)}
      banner
      showIcon={false}
    />
  );
};

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
  ) : <Alert message="Dessiner le parcours ou la zone concernée sur la carte" type="info" />;
};

export default FeaturesList;
