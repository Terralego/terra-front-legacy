import React from 'react';
import { Card, Collapse } from 'antd';

const UserrequestContact = ({ contacts }) => (
  <Card
    style={{ marginTop: 21 }}
    title={contacts.length > 1 ? 'Contacter les demandeurs:' : 'Contacter le demandeur:'}
  >
    <Collapse style={{ marginBottom: 24 }}>
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

export default UserrequestContact;
