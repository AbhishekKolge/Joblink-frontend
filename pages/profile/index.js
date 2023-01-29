import Head from "next/head";

import Container from "../../components/UI/Container/Container";
import ProfileForm from "../../components/ProfileForm/ProfileForm";

import styles from "./Profile.module.css";

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <section className="fullHeight">
        <Container className={styles.container}>
          <ProfileForm />
        </Container>
      </section>
    </>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      userProtected: true,
    },
  };
}

export default ProfilePage;
