import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Head from "next/head";

import styles from "./VerifyEmail.module.css";

import Container from "../../components/UI/Container/Container.js";
import Spinner from "../../components/UI/Spinner/Spinner";

import { useVerifyEmailMutation } from "../../store/slices/api/authApiSlice";

const VerifyEmail = () => {
  const router = useRouter();

  const { token, email } = router.query;

  const [
    verifyEmail,
    {
      isSuccess: verifyEmailSuccess,
      isError: verifyEmailIsError,
      isLoading: verifyEmailLoading,
      error: verifyEmailError,
    },
  ] = useVerifyEmailMutation();

  useEffect(() => {
    if (email && token) {
      (async () => {
        await verifyEmail({ email, token });
      })();
    } else {
      toast.error("Verification failed");
      router.push({
        pathname: "/login",
      });
    }
  }, [token, email]);

  useEffect(() => {
    if (verifyEmailIsError) {
      if (verifyEmailError.data?.msg) {
        toast.error(verifyEmailError.data.msg.split(",")[0]);
        router.push({
          pathname: "/login",
        });
      } else {
        toast.error("Verification failed");
        router.push({
          pathname: "/login",
        });
      }
    }
    if (verifyEmailSuccess) {
      toast.success("Verification successful");
      router.push({
        pathname: "/login",
      });
    }
  }, [verifyEmailSuccess, verifyEmailIsError, verifyEmailError]);

  return (
    <>
      <Head>
        <title>Verify Email</title>
      </Head>
      <section className="fullHeight">
        <Container className={styles.container}>
          <div className={styles.spinner}>
            <Spinner loading={true} />
          </div>
          <h4 className={styles.heading}>Verifying Your Email...!!!</h4>
          <p className={styles.helperText}>
            Sit back and relax, we are verifying your email address
          </p>
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

export default VerifyEmail;
