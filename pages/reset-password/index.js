import Head from "next/head";

import Container from "../../components/UI/Container/Container";
import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <section className="fullHeight">
        <Container className={styles.container}>
          <ResetPasswordForm />
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

export default ResetPassword;
