import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../../styles/index-styles/landing.module.css";

const Landing = ({ dummyUsers }) => {
  const [username, setUserName] = useState("");
  const [modalOpen, setMoadalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      setMoadalOpen(true);
    }, 1000 * 5);
  }, []);
  const handleUsername = (e) => {
    setUserName(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const axiosRes = await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-user`,
      method: "POST",
      data: { username },
    });
    if (axiosRes.statusText === "OK") {
      console.log("user created : ", axiosRes.data);
      window.localStorage.setItem("username", axiosRes.data);
      router.replace("/chat-room");
    }
  };

  const handleModalClose = () => {
    setMoadalOpen(false);
  };

  return (
    <section className={styles.landingContainer}>
      <div className={styles.box}>
        <div className={styles.formContainer}>
          <form onSubmit={handleFormSubmit} autoComplete="off">
            <div className={styles.formGroup}>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={handleUsername}
                required
              />
              <label htmlFor="username">username</label>
            </div>
            <div className={styles.btnGroup}>
              <button type="submit">enter chat room</button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.welcomeImage}>
        <img src="/images/undraw_Celebrating_rtuv.svg" alt="welcome image" />
      </div>
      <div className={styles.welcomeText}>
        <h1>
          welcome
          <br />
          to our chat application
        </h1>
      </div>
      {modalOpen && (
        <div className={`${styles.userModal}`}>
          <div className={styles.wrapper}>
            <div className={styles.colLeft}>
              <h1>our users</h1>
            </div>
            <div className={styles.closeBtn}>
              <span onClick={handleModalClose}>&times;</span>
            </div>
          </div>
          <hr />
          <ul className={styles.users}>
            {dummyUsers.data.map((user, index) => {
              return (
                <li key={index}>
                  <div className={styles.avatar}>
                    <img src={user.avatar} alt="avatar img" />
                  </div>
                  <div className={styles.userDetails}>
                    <p>
                      <span>name:</span> {user.first_name} {user.last_name}
                    </p>
                    <p>
                      <span>email:</span> {user.email}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

export default Landing;
