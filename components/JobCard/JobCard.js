import Image from "next/image";

import styles from "./JobCard.module.css";

import Card from "../UI/Card/Card";

import { formatCurrency } from "../../helpers/numberFormat";

const JobCard = (props) => {
  const { job } = props;

  return (
    <Card className={styles.card}>
      <div className={styles.headerContainer}>
        <Image
          priority={true}
          className={styles.jobImage}
          alt="employer profile image"
          src={
            !job.employer.profileImage
              ? job.employer.gender === "male"
                ? "/male-dummy-profile.jpg"
                : "/female-dummy-profile.jpg"
              : job.employer.profileImage
          }
          width={80}
          height={80}
        />
        <div className={styles.headerDetails}>
          <strong className={styles.title}>{job.title}</strong>
          <span className={styles.company}>
            {job.employer.companyName || "Anonymous"}
          </span>
          <span className={styles.category}>{job.jobCategory.name}</span>
        </div>
        <span className={styles.tag}>{job.type}</span>
        <span className={job.status === "open" ? styles.open : styles.closed}>
          {job.status}
        </span>
      </div>
      <div className={styles.footerContainer}>
        <span>
          Location: <strong>{job.location}</strong>
        </span>

        <span>
          Salary:{" "}
          <strong>
            {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
          </strong>{" "}
          a year
        </span>
      </div>
    </Card>
  );
};

export default JobCard;
