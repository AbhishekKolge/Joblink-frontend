import Container from "../UI/Container/Container";
import Spinner from "../UI/Spinner/Spinner";

import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <Spinner loading={true} />
      </Container>
    </section>
  );
};

export default Loading;
