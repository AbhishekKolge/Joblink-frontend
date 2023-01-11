import { useRouter } from "next/router";
import { useEffect } from "react";

import styles from "./NotFound.module.css";

import Container from "../components/UI/Container/Container";

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectionTimeout = setTimeout(() => {
      router.push({
        pathname: "/",
      });
    }, 2000);

    return () => clearTimeout(redirectionTimeout);
  }, []);

  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <h1>Not Found. Redirecting to home page...</h1>
      </Container>
    </section>
  );
};

export default NotFoundPage;
