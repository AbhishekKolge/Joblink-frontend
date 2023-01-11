import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import styles from "./JobDetails.module.css";

import Button from "../UI/Button/Button";

import { useCreateApplicationMutation } from "../../store/slices/api/applicationApiSlice";

import { formatCurrency, formatDate } from "../../helpers/numberFormat";

const JobDetails = (props) => {
  const { job } = props;
  const { isLoggedIn, role, userId } = useSelector((state) => state.auth);
  const [applied, setApplied] = useState(false);

  const [
    createApplication,
    {
      isSuccess: applyJobSuccess,
      isError: applyJobIsError,
      isLoading: applyJobLoading,
      error: applyJobError,
    },
  ] = useCreateApplicationMutation();

  useEffect(() => {
    if (job) {
      const ifApplied = job.applications.find((application) => {
        return application.user === userId;
      });
      ifApplied && setApplied(true);
    }
  }, [job, userId]);

  useEffect(() => {
    if (applyJobSuccess) {
      setApplied(true);
      toast.success("Applied successfully");
    }

    if (applyJobIsError) {
      if (applyJobError.data?.msg) {
        toast.error(applyJobError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
  }, [applyJobSuccess, applyJobIsError, applyJobError]);

  const applyJobHandler = async () => {
    await createApplication({
      id: job._id,
    });
  };

  return (
    <div className={styles.container}>
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
          Location: <strong>{job.location || "Not mentioned"}</strong>
        </span>
        <span>
          Salary:{" "}
          <strong>
            {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}
          </strong>{" "}
          a year
        </span>
        <span>
          Posted on: <strong>{formatDate(job.createdAt)}</strong>
        </span>
        {job.employer.contactNo ? (
          <span>
            Speak with the employer:{" "}
            <strong>
              {isLoggedIn ? job.employer.contactNo : "xxxxxxxxxx"}
            </strong>
          </span>
        ) : null}
      </div>
      <p className={styles.description}>{job.description}</p>

      {job.status === "open" ? (
        isLoggedIn ? (
          role !== "employer" && !applied ? (
            <Button
              onClick={applyJobHandler}
              disabled={applyJobLoading}
              className={styles.applyBtn}
            >
              Apply Now
            </Button>
          ) : (
            role !== "employer" && (
              <Button disabled={true} className={styles.btn}>
                Applied
              </Button>
            )
          )
        ) : (
          <Link href="/login" className={styles.btn}>
            Please Login in to apply
          </Link>
        )
      ) : (
        <Button disabled={true} className={styles.btn}>
          Application closed
        </Button>
      )}
    </div>
  );
};

export default JobDetails;
