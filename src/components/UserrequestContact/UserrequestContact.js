import React from 'react';
import PropTypes from 'prop-types';
import { Card, Collapse } from 'antd';

const UserrequestContact = ({ user }) => {
  const { contacts = [] } = user.properties;
  const { affiliation = [], name, label } = user.properties.structure;
  return (
    <Card
      style={{ marginTop: 21 }}
      title="Information sur la structure et personnes de contacts"
    >
      <p><strong>Demandeur:</strong> {contacts[0].firstname} {contacts[0].lastname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Structure:</strong> {name}</p>
      {affiliation.length > 0 &&
        <p>
          <strong>Affiliation et partenariat(s):</strong>
          {affiliation.map(affiliate => affiliate)}
        </p>}
      {label && <p><strong>Label(s):</strong> {label}</p>}
      <Collapse style={{ marginTop: 30 }}>
        {contacts.map(contact => (
          <Collapse.Panel
            key={contact.phone && contact.firstname}
            header={`${contact.firstname} ${contact.lastname}`}
          >
            <p><strong>Numéro: </strong> {contact.phone[0]}</p>
            {contact.phone[1] && <p><strong>Numéro secondaire:</strong> {contact.phone[1]}</p>}
            {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
            {contact.position && <p><strong>Fonction:</strong> {contact.position}</p>}
            {contact.zipcode && <p><strong>Code postal:</strong> {contact.zipcode}</p>}
            {contact.city && <p><strong>Ville:</strong> {contact.city}</p>}
          </Collapse.Panel>
          ))}
      </Collapse>
    </Card>
  );
};

UserrequestContact.propTypes = {
  user: PropTypes.shape({
    properties: PropTypes.shape({
      structure: PropTypes.shape({
        affiliation: PropTypes.array,
        name: PropTypes.string,
        label: PropTypes.string,
      }),
    }),
    contacts: PropTypes.array,
  }),
};

UserrequestContact.defaultProps = {
  user: {
    properties: {
      structure: {
        affiliation: [],
        name: '',
        label: '',
      },
      contacts: [],
    },
  },
};

export default UserrequestContact;
