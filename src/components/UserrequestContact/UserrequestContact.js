import React from 'react';
import PropTypes from 'prop-types';
import { Card, Collapse } from 'antd';

import profileInitial from 'modules/profile-initial';

import styles from 'components/UserrequestContact/UserrequestContact.module.scss';

const UserrequestContact = ({ data }) => {
  const {
    contacts = profileInitial.properties.contacts,
    structure = profileInitial.properties.structure,
  } = data.owner.properties;
  const { affiliation = [], name, label } = structure;
  return (
    <Card
      style={{ marginTop: 21 }}
      title="Information sur la structure et personnes de contacts"
    >
      <ul className={styles.meta}>
        {(contacts[0].firstname || contacts[0].lastname) &&
          <li><strong>Demandeur :</strong> {contacts[0].firstname} {contacts[0].lastname}</li>
        }
        {data.owner.email &&
          <li><strong>Email :</strong> {data.owner.email}</li>
        }
        {name &&
          <li><strong>Structure :</strong> {name}</li>
        }
        {affiliation.length > 0 &&
          <li>
            <strong>Affiliation et partenariat(s):</strong>
            {affiliation.map(affiliate => affiliate)}
          </li>}
      </ul>
      {label && <p><strong>Label(s) :</strong> {label}</p>}
      {contacts.length && contacts[0].firstname && contacts[0].lastname && contacts[0].phone &&
        <Collapse style={{ marginTop: 30 }}>
          {contacts.map(contact => (
            <Collapse.Panel
              key={contact.phone + contact.firstname}
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
      }
    </Card>
  );
};

UserrequestContact.propTypes = {
  data: PropTypes.shape({
    owner: PropTypes.shape({
      email: PropTypes.string,
      properties: PropTypes.shape({
        structure: PropTypes.shape({
          affiliation: PropTypes.array,
          name: PropTypes.string,
          label: PropTypes.string,
        }),
      }),
      contacts: PropTypes.array,
    }),
  }),
};

UserrequestContact.defaultProps = {
  data: {
    owner: {
      properties: {
        structure: {
          affiliation: [],
          name: '',
          label: '',
        },
        contacts: [],
      },
    },
  },
};

export default UserrequestContact;
