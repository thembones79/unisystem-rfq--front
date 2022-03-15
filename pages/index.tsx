import { IUser } from "./users";
import axios from "axios";
import styles from "../styles/Home.module.scss";

interface HomeProps {
  currentUser: IUser;
  guiVersion: string;
  apiVersion: string;
}

const Home = ({ currentUser, guiVersion, apiVersion }: HomeProps) => {
  return (
    <div>
      <div className="full-page">
        <div className={styles.wrapper}>
          <p className={styles.floatingTitle}>Riverdi RFQ</p>

          <p className={styles.floatingTxt}>
            {currentUser
              ? `🎉 hi, ${currentUser.username.split(" ")[0]} 🍻`
              : `💩 you are not logged in 💩`}
          </p>
          <p className={styles.floatingTxt}>
            <span className={styles.fat}>
              {currentUser
                ? `❤️ it's really nice to see you ❤️`
                : `please do it now`}
            </span>
          </p>
        </div>
      </div>

      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center is-flex-wrap-wrap">
        <p>
          Changelog: GUI{" "}
          <a
            href="https://github.com/thembones79/riverdi-rfq--frontend/blob/main/CHANGELOG.md#changelog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>v{guiVersion}</b>
          </a>
          , API{" "}
          <a
            href="https://github.com/thembones79/riverdi-rfq--backend/blob/master/CHANGELOG.md#changelog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>v{apiVersion}</b>
          </a>
        </p>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ currentUser }: { currentUser: IUser }) => {
  const frontend = await axios.get(
    `https://raw.githubusercontent.com/thembones79/riverdi-rfq--frontend/main/package.json`
  );
  const backend = await axios.get(
    `https://raw.githubusercontent.com/thembones79/riverdi-rfq--backend/master/package.json`
  );

  const guiVersion = frontend.data.version;
  const apiVersion = backend.data.version;

  return { guiVersion, apiVersion, currentUser };
};

export default Home;
