import Container from "../../components/UI/Container/Container";
import SignupForm from "../../components/SignupForm/SignupForm";

import Link from "next/link";

import styles from "./SignUp.module.css";

const SignUpPage = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <SignupForm />
        <ul className={styles.linkContainer}>
          <li>
            <Link className={`link ${styles.link}`} href="/login">
              <span>Already have an account ?</span> sign in
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

export default SignUpPage;
