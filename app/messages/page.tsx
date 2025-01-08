"use client";
import React, { useState, useEffect } from "react";

interface Message {
  text: string;
  sender: string;
}

interface Contact {
  id: number;
  username: string;
  gender: string;
  role: string;
}
interface Group{
  id: number;
  name: string;
}

const user_id = 1;

const MessagesPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [view, setView] = useState<"contacts" | "groups">("contacts");

  const [messages, setMessages] = useState<{
    [key: string]: Message[];
  }>({
    Alice: [
      { text: "Hi Alice!", sender: "me" },
      { text: "How are you?", sender: "Alice" },
      { text: "I'm good, thanks!", sender: "me" },
      { text: "What about you?", sender: "Alice" },
    ],
    Bob: [
      { text: "Hey Bob!", sender: "me" },
      { text: "What's up?", sender: "Bob" },
      { text: "Not much, just working.", sender: "me" },
      { text: "Cool, let's catch up later.", sender: "Bob" },
    ],
    Charlie: [
      { text: "Hello Charlie!", sender: "me" },
      { text: "Long time no see!", sender: "Charlie" },
      { text: "Yeah, it's been a while.", sender: "me" },
      { text: "We should meet up soon.", sender: "Charlie" },
    ],
    Group1: [
      { text: "Hello Group1!", sender: "me" },
      { text: "Welcome to the group chat.", sender: "Group1" },
    ],
    Group2: [
      { text: "Hello Group2!", sender: "me" },
      { text: "This is a group message.", sender: "Group2" },
    ],
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`https://localhost:443/users/${user_id}/department-users/`, {
          method: "GET",
        });
        const data = await response.json();
        setContacts(data.users);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`https://localhost:443/users/${user_id}/groups/`, {
          method: "GET",
        });
        const data = await response.json();
        setGroups(data.groups);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const addMessage = (newMessage: Message) => {
    if (selectedContact) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.username]: [...prevMessages[selectedContact.username], newMessage],
      }));
    } else if (selectedGroup) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedGroup.name]: [...prevMessages[selectedGroup.name], newMessage],
      }));
    }
  };

  return (
    <div
      className="p-4 grid grid-cols-2"
      style={{ height: "calc(100vh - 100px)" }}
    >
      {/* Contacts or Groups List */}
      <div className="pr-4 min-h-full scroll-m-0">
        {/* toggle buttons */}
        <div className="col-span-2 mb-4 align-middle text-center">
          <button
            className={`mr-2 p-2 rounded-md ${
              view === "contacts"
                ? "bg-yellow-600 text-white"
                : "bg-transparent border-2 border-yellow-600"
            }`}
            onClick={() => setView("contacts")}
          >
            Contacts
          </button>
          <button
            className={`p-2 rounded-md ${
              view === "groups"
                ? "bg-yellow-600 text-white"
                : "bg-transparent border-2 border-yellow-600"
            }`}
            onClick={() => setView("groups")}
          >
            Groups
          </button>
        </div>
        <h2 className="text-xl font-bold">
          {view === "contacts" ? "Contacts" : "Groups"}
        </h2>
        <ul>
          {view === "contacts"
            ? contacts.map((contact) =>
                contact.id !== user_id ? (
                  <li
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setSelectedGroup(null);
                    }}
                    className="bg-transparent my-2 p-4 rounded-md border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition duration-150 ease-in"
                  >
                    {contact.username}
                  </li>
                ) : null
              )
            : groups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => {
                    setSelectedGroup(group);
                    setSelectedContact(null);
                  }}
                  className="bg-transparent my-2 p-4 rounded-md border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition duration-150 ease-in"
                >
                  {group.name}
                </li>
              ))}
        </ul>
      </div>

      {/* Messages View */}
      <div className="pl-4 flex flex-col min-h-full scroll-m-0">
        <h2 className="font-bold text-xl">
          {selectedContact
            ? selectedContact.username
            : selectedGroup
            ? selectedGroup.name
            : "Messages"}
        </h2>
        {selectedContact || selectedGroup ? (
          <div className="flex flex-col flex-grow">
            <ul className="flex flex-col text-white flex-grow overflow-y-auto">
              {(selectedContact
                ? messages[selectedContact.username]
                : messages[selectedGroup!.name]
              ).map((msg, index) => (
                <li
                  key={index}
                  className={`my-2 p-2 rounded-md inline-block max-w-xs break-words ${
                    msg.sender === user_id.toString()
                      ? "text-right bg-zinc-700 self-end"
                      : "text-left bg-yellow-600 self-start"
                  }`}
                >
                  {msg.text}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full p-2 bg-transparent rounded-md border-yellow-600 border-2"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    e.currentTarget.value.trim() !== ""
                  ) {
                    addMessage({ text: e.currentTarget.value, sender: user_id.toString() });
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button
                className="ml-2 p-2 bg-yellow-600 text-white rounded-md"
                onClick={() => {
                  const input = document.querySelector(
                    'input[type="text"]'
                  ) as HTMLInputElement;
                  if (input.value.trim() !== "") {
                    addMessage({ text: input.value, sender: user_id.toString() });
                    input.value = "";
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p>Select a contact or group to view messages</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
