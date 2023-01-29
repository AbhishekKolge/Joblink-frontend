import Head from "next/head";

import Container from "../../components/UI/Container/Container";
import LoginForm from "../../components/LoginForm/LoginForm";

import Link from "next/link";

import styles from "./Login.module.css";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <section className="fullHeight">
        <Container className={styles.container}>
          <div>
            <h1 className={styles.heading}>
              Log in to <span>Joblink</span>
            </h1>
            <h2>Your partner for job searching</h2>
          </div>
          <LoginForm />
          <ul className={styles.linkContainer}>
            <li>
              <Link className={`link ${styles.link}`} href="/sign-up">
                <span>Don&apos;t have an account ?</span> Sign up now
              </Link>
            </li>
            <li>
              <Link className={`link ${styles.link}`} href="/forgot-password">
                Forgot password
              </Link>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      loggedInProtected: true,
    },
  };
}

export default LoginPage;
