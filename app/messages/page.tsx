"use client";
import React, { useState, useEffect } from "react";

interface Message {
  sender: number;
  message: string;
  timestamp: string;
}

interface Contact {
  id: number;
  username: string;
  gender: string;
  role: string;
}
interface Group {
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

  let [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    "john_doe": [
      { sender: 2, message: "Hello!", timestamp: "2023-10-01T10:00:00Z" },
      { sender: 1, message: "Hi there!", timestamp: "2023-10-01T10:01:00Z" },
    ],
    "group_1": [
      { sender: 3, message: "Welcome to the group!", timestamp: "2023-10-01T10:05:00Z" },
      { sender: 1, message: "Thank you!", timestamp: "2023-10-01T10:06:00Z" },
    ],
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:443/ws/chat/2/1/");

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let msgs = data.messages;
      console.log("Messages        ", data.messages);
      setMessages(data.messages);
      console.log("Messages:", msgs);
      setMessages(msgs);
      console.log("Messages:", messages);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactsRes, groupsRes] = await Promise.all([
          fetch(`https://localhost:443/users/${user_id}/department-users/`),
          fetch(`https://localhost:443/users/${user_id}/groups/`),
        ]);

        const contactsData = await contactsRes.json();
        const groupsData = await groupsRes.json();

        setContacts(contactsData.users);
        setGroups(groupsData.groups);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addMessage = (newMessage: Message) => {
    if (selectedContact) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedContact.username]: [
          ...(prevMessages[selectedContact.username as keyof typeof prevMessages] || []),
          newMessage,
        ],
      }));

      // Send message to server
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(newMessage.message);
      }
    } else if (selectedGroup) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedGroup.name]: [
          ...(prevMessages[selectedGroup.name as keyof typeof prevMessages] || []),
          newMessage,
        ],
      }));

      // Send message to server
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(newMessage.message);
      }
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
        {selectedContact ? (
          <div className="flex flex-col flex-grow">
            <ul className="flex flex-col text-white flex-grow overflow-y-auto">
              {(selectedContact ? messages[selectedContact.username as keyof typeof messages] : selectedGroup ? messages[selectedGroup.name as keyof typeof messages] : [])?.map((msg: Message, index: number) => (
                <li key={index} className="my-2 p-2 rounded-md bg-yellow-600">
                  <p><strong>{msg.sender}:</strong> {msg.message}</p>
                  <p className="text-sm">{new Date(msg.timestamp).toLocaleString()}</p>
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
                    addMessage({
                      message: e.currentTarget.value,
                      sender: user_id,
                      timestamp: new Date().toISOString(),
                    });
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
                    addMessage({
                      message: input.value,
                      sender: user_id,
                      timestamp: new Date().toISOString(),
                    });
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
