import Container from "../../components/UI/Container/Container";
import ProfileForm from "../../components/ProfileForm/ProfileForm";

import styles from "./Profile.module.css";

const ProfilePage = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <ProfileForm />
      </Container>
    </section>
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
