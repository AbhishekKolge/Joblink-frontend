import { useSelector } from "react-redux";

import Container from "../../../components/UI/Container/Container";
import UserJobs from "../../../components/UserJobs/UserJobs";
import EmployerJobs from "../../../components/EmployerJobs/EmployerJobs";

import { useId } from "react";

import styles from "./MyJobs.module.css";

const MyJobsPage = (props) => {
  const { role } = useSelector((state) => state.auth);

  const initialCategoryOptionId = useId();
  const { jobCategories } = props;

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
        <h1 className={styles.heading}>
          {role === "employer" ? "Posted Jobs" : "Job Applications"}
        </h1>
        {role === "employer" ? (
          <EmployerJobs jobCategories={categories} />
        ) : (
          <UserJobs />
        )}
      </Container>
    </section>
  );
};

export async function getStaticProps(context) {
  const categoriesJsonData = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/job-categories`
  );

  const categoriesData = await categoriesJsonData.json();

  return {
    props: {
      ...categoriesData,
      userProtected: true,
    },
    revalidate: 10,
  };
}

export default MyJobsPage;
