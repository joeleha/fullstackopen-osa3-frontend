import React from "react";

const Person = (props) => {
  return (
    <>
    <p>{props.name} {props.number}</p>
    <button onClick={() => { props.deleteContact() }}>delete</button>
    </>
  );
};

const Contacts = ({ contacts, deleteContact }) => {
  const contactList = contacts.map((person) =>
      <Person key={person.number} name={person.name} number={person.number} deleteContact={ () => deleteContact(person) } />
  );
  return (
    <>
      <h3>Numbers</h3>
      {contactList}
    </>
  );
};

export default Contacts;
