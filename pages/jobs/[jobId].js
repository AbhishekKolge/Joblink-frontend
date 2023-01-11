import styles from "./JobDetails.module.css";

import JobDetails from "../../components/JobDetails/JobDetails";
import Container from "../../components/UI/Container/Container";

const JobDetailsPage = (props) => {
  const { job } = props;

  return (
    <section className="fullHeight">
      <Container>
        <JobDetails job={job} />
      </Container>
    </section>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const { jobId } = params;

  const jobJsonData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/jobs/${jobId}`
  );

  const jobData = await jobJsonData.json();

  if (!jobData.job) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...jobData,
      opened: true,
    },
  };
}

export default JobDetailsPage;
