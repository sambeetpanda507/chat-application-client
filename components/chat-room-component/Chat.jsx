import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import styles from "../../styles/chat-room-styles/chatroom.module.css";

let socket;

const Chat = () => {
  const [sentMessage, setSentMessage] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const serverUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

  useEffect(() => {
    setName(window.localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    socket = io(serverUrl);

    socket.on("recieve", (data) => {
      handleRecieveMsg(data);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [serverUrl]);

  const handleRecieveMsg = (data) => {
    const chatArea = document.getElementById("chat_area");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(styles.msg, styles.left);
    const incomingDiv = document.createElement("div");
    incomingDiv.classList.add(styles.incoming);
    const username = document.createElement("p");
    username.innerHTML = data.name;
    const message = document.createElement("p");
    message.innerHTML = data.sentMessage;
    incomingDiv.appendChild(username);
    incomingDiv.appendChild(message);
    msgDiv.appendChild(incomingDiv);
    chatArea.appendChild(msgDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sentMessage.length > 0) {
      const chatArea = document.getElementById("chat_area");
      const msgDiv = document.createElement("div");
      msgDiv.classList.add(styles.msg, styles.right);
      const outgoingDiv = document.createElement("div");
      outgoingDiv.classList.add(styles.outgoing);
      const username = document.createElement("p");
      username.innerHTML = "you";
      const message = document.createElement("p");
      message.innerHTML = sentMessage;
      outgoingDiv.appendChild(username);
      outgoingDiv.appendChild(message);
      msgDiv.appendChild(outgoingDiv);
      chatArea.appendChild(msgDiv);
      chatArea.scrollTop = chatArea.scrollHeight;
      const data = {
        type: "text",
        sentMessage: sentMessage,
        name: name,
      };
      socket.emit("sent", data);
      setSentMessage("");
    }
  };

  const handleExit = () => {
    window.localStorage.removeItem("username");
    router.replace("/");
  };

  return (
    <section className={styles.App}>
      <div className={styles.header}>
        <div className={styles.headerWrapper}>
          <div className={styles.profile_img}>
            <img src="https://picsum.photos/200" alt="profile" />
          </div>
          <p className={styles.username}>{name}</p>
        </div>
        <div className={styles.exitIcon}>
          <i className="fas fa-sign-out-alt" onClick={handleExit}></i>
        </div>
      </div>
      <div className={styles.chat_area} id="chat_area"></div>
      <div className={styles.inputDiv}>
        <form
          autoComplete="off"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div className={styles.msg_box}>
            <textarea
              name="msg"
              cols="10"
              rows="5"
              value={sentMessage}
              onChange={(e) => setSentMessage(e.target.value)}
            ></textarea>
          </div>
          <div className={styles.send}>
            <button type="submit">
              <i className="fas fa-paper-plane fa-2x"></i>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Chat;
