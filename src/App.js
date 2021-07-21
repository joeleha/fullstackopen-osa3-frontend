import React, { useEffect, useState } from "react";
import Contacts from "./Contacts";
import contactService from "./services/contactService";

const Filter = ({ text, value, onChange }) => {
  return (
    <p>
      {text}
      <input value={value} onChange={onChange} />
    </p>
  );
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="notification">
      {message}
    </div>
  );
};

const Error = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  }

  return (
    <div className="error">
      {errorMessage}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [st, setNewFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [errorMessage, setError] = useState(null);

  useEffect(() => {
    contactService.getAll()
      .then((response) => {
        console.log("promise fulfilled");
        setPersons(response);
      });
  }, []);

  const setName = (event) => {
    setNewName(event.target.value);
  };

  const setNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const setFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const contacts = persons.filter((person) =>
    person.name.toLowerCase().includes(st.toLowerCase())
  );

  const addContact = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    if (persons.some((e) => e.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const uc = persons.find((p) => p.name === newName);
        console.log(uc.id);
        contactService
          .update(uc.id, newPerson)
          .then((returnedPerson) => {
            const filtered = persons.filter((person) => person.id !== uc.id);
            setPersons(filtered.concat(returnedPerson));
            setNotification(`Updated information for ${returnedPerson.name}`);
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
    } else {
      contactService
        .create(newPerson)
        .then((returnedPerson) => {
          console.log(returnedPerson);
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setError(
            `${error}`,
          );
          setTimeout(() => {
            setError(null);
          }, 5000);
        });
    }
  };

  const deleteContact = (contact) => {
    if (window.confirm(`Delete ${contact.name}`)) {
      contactService.deleteContact(contact.id)
        .then(() => {
          console.log("deleted");
          setPersons(contacts.filter((person) => person.id !== contact.id));
          setNotification(`Deleted ${contact.name} from phonebook`);
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          setError(
            `Information of ${contact.name} has already been removed from server.`,
          );
          setTimeout(() => {
            setError(null);
          }, 5000);
          setPersons(contacts.filter((person) => person.id !== contact.id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error errorMessage={errorMessage} />
      <Filter text="filter shown with " value={st} onChange={setFilter} />
      <h3>Add a new</h3>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={setName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={setNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <Contacts contacts={contacts} deleteContact={deleteContact} />
    </div>
  );
};

export default App;
