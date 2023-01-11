import Container from "../../components/UI/Container/Container";
import CreateJobForm from "../../components/CreateJobForm/CreateJobForm";

import styles from "./CreateJob.module.css";

const CreateJobPage = () => {
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <CreateJobForm />
      </Container>
    </section>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      employerProtected: true,
      userProtected: true,
    },
  };
}

export default CreateJobPage;
