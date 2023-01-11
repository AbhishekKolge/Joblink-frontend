import Container from "../../components/UI/Container/Container";
import ForgotPasswordForm from "../../components/ForgotPasswordForm/ForgotPasswordForm";

import Link from "next/link";

import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <ForgotPasswordForm />
        <ul className={styles.linkContainer}>
          <li>
            <Link className={`link ${styles.link}`} href="/login">
              Go back to sign in
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      loggedInProtected: true,
    },
  };
}

export default ForgotPassword;
