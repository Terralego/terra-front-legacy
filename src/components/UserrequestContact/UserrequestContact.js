import React from 'react';
import { Card, Collapse } from 'antd';

const { Panel } = Collapse;

const UserrequestContact = ({ contacts }) => (
  <Card
    style={{ marginTop: 21 }}
    title={contacts.length > 1 ? 'Contacter les demandeurs:' : 'Contacter le demandeur:'}
  >
    <Collapse style={{ marginBottom: 24 }}>
      {contacts.map(contact => (
        <Panel header={`${contact.firstname} ${contact.lastname}`}>
          <div key={`user-contact ${contact.phone} ${contact.firstname}`}>
            <p>
              <strong>{contact.firstname} {contact.lastname} : </strong> {contact.phone[0]}
            </p>
            {contact.email && <p><strong>Email :</strong> {contact.email}</p>}
          </div>
        </Panel>
        ))}
    </Collapse>
  </Card>
);

export default UserrequestContact;
