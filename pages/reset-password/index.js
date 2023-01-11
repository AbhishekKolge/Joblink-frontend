import Container from "../../components/UI/Container/Container";
import ResetPasswordForm from "../../components/ResetPasswordForm/ResetPasswordForm";

import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <ResetPasswordForm />
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

export default ResetPassword;
