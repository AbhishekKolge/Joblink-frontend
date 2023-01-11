import { useId } from "react";

import styles from "./HomePage.module.css";

import Container from "../components/UI/Container/Container";
import JobList from "../components/JobList/JobList";

const HomePage = (props) => {
  const initialCategoryOptionId = useId();
  const { jobs, totalJobs, numOfPages, jobCategories } = props;

  const categories = jobCategories.map((category) => {
    return {
      id: category.id,
      value: category.id,
      name: category.name,
    };
  });
  categories.unshift({
    id: initialCategoryOptionId,
    value: "",
    name: "All",
  });
  return (
    <section className="fullHeight">
      <Container className={styles.container}>
        <h1 className={styles.heading}>All Jobs</h1>
        <JobList
          jobs={jobs}
          count={totalJobs}
          numOfPages={numOfPages}
          jobCategories={categories}
        />
      </Container>
    </section>
  );
};

export async function getStaticProps(context) {
  const jobsJsonData = await fetch(`${process.env.NEXT_PUBLIC_URL}/jobs`);
  const categoriesJsonData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/job-categories`
  );
  const jobsData = await jobsJsonData.json();
  const categoriesData = await categoriesJsonData.json();

  return {
    props: {
      ...jobsData,
      ...categoriesData,
      opened: true,
    },
    revalidate: 10,
  };
}

export default HomePage;
