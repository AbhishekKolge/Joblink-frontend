import ReactPaginate from "react-paginate";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

import styles from "./EmployerJobs.module.css";

import JobCard from "../JobCard/JobCard";
import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import UpdateJobForm from "../UpdateJobForm/UpdateJobForm";
import Spinner from "../UI/Spinner/Spinner";

import {
  useGetMyJobsMutation,
  useDeleteJobMutation,
} from "../../store/slices/api/jobApiSlice";

const jobTypeOptions = [
  {
    id: 1,
    value: "",
    name: "All",
  },
  {
    id: 2,
    value: "full-time",
    name: "Full-time",
  },
  {
    id: 3,
    value: "part-time",
    name: "Part-time",
  },
  {
    id: 4,
    value: "contract",
    name: "Contract",
  },
  {
    id: 5,
    value: "internship",
    name: "Internship",
  },
];
const jobStatusOptions = [
  {
    id: 1,
    value: "",
    name: "All",
  },
  {
    id: 2,
    value: "open",
    name: "Open",
  },
  {
    id: 3,
    value: "closed",
    name: "Closed",
  },
];
const sortOptions = [
  {
    id: 1,
    value: "latest",
    name: "Latest",
  },
  {
    id: 2,
    value: "oldest",
    name: "Oldest",
  },
  {
    id: 3,
    value: "a-z",
    name: "A - Z",
  },
  {
    id: 4,
    value: "z-a",
    name: "Z - A",
  },
];

const EmployerJobs = (props) => {
  const { jobCategories } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState("");
  const [updateJobId, setUpdateJobId] = useState("");
  const [{ jobs, count, numOfPages }, setJobsData] = useState({
    jobs: "",
    count: null,
    numOfPages: null,
  });
  const [currentPage, setCurrentPage] = useState(0);

  const [
    getMyJobs,
    {
      data: jobsRes,
      isSuccess: jobsSuccess,
      isError: jobsIsError,
      error: jobsError,
      isLoading: jobsIsLoading,
    },
  ] = useGetMyJobsMutation();

  const [
    deleteJob,
    {
      data: deleteJobRes,
      isSuccess: deleteJobSuccess,
      isError: deleteJobIsError,
      error: deleteJobError,
      isLoading: deleteJobIsLoading,
    },
  ] = useDeleteJobMutation();

  const formik = useFormik({
    initialValues: {
      search: "",
      type: "",
      status: "",
      category: "",
      sort: "latest",
    },
    validationSchema: Yup.object({
      search: Yup.string().trim(),
      type: Yup.string()
        .oneOf(["full-time", "part-time", "contract", "internship"])
        .optional(),
      status: Yup.string().oneOf(["open", "closed"]).optional(),
      category: Yup.string(),
      sort: Yup.string().oneOf(["latest", "oldest", "a-z", "z-a"]).optional(),
    }),
    onSubmit: async (values) => {
      await getMyJobs(values);
    },
  });

  useEffect(() => {
    if (jobsIsError) {
      if (jobsError.data?.msg) {
        toast.error(jobsError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (jobsSuccess) {
      const { jobs, totalJobs: count, numOfPages } = jobsRes;

      setJobsData({
        jobs,
        count,
        numOfPages,
      });
    }
  }, [jobsRes, jobsSuccess, jobsIsError, jobsError]);

  useEffect(() => {
    if (deleteJobIsError) {
      if (deleteJobError.data?.msg) {
        toast.error(deleteJobError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (deleteJobSuccess) {
      toast.success("Job deleted successfully");
      (async () => {
        await getMyJobs({ ...formik.values });
      })();
    }
  }, [deleteJobSuccess, deleteJobIsError, deleteJobError]);

  const pageHandler = async (event) => {
    setCurrentPage(event.selected);
    const page = event.selected + 1;
    await getMyJobs({ ...formik.values, page });
  };

  const openDeleteModal = (jobId) => {
    setDeleteJobId(jobId);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteJobId("");
    setShowDeleteModal(false);
  };

  const openEditModal = (jobId) => {
    setUpdateJobId(jobId);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setUpdateJobId("");
    setShowEditModal(false);
  };

  const deleteJobHandler = async () => {
    await deleteJob(deleteJobId);
    setShowDeleteModal(false);
  };

  const onEditJobHandler = async () => {
    setShowEditModal(false);
    await getMyJobs({ ...formik.values });
  };
  useEffect(() => {
    (async () => {
      await getMyJobs();
    })();
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <Card className={styles.card}>
          <Input
            label="Search"
            errorText={formik.touched.search && formik.errors.search}
            invalid={formik.touched.search && formik.errors.search}
            inputProps={{
              name: "search",
              id: "search",
              placeholder: "Job title",
              value: formik.values.search,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Select
            label="Type"
            errorText={formik.touched.type && formik.errors.type}
            invalid={formik.touched.type && formik.errors.type}
            selectProps={{
              name: "type",
              id: "type",
              value: formik.values.type,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobTypeOptions}
          />
          <Select
            label="Status"
            errorText={formik.touched.status && formik.errors.status}
            invalid={formik.touched.status && formik.errors.status}
            selectProps={{
              name: "status",
              id: "status",
              value: formik.values.status,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobStatusOptions}
          />
          <Select
            label="Category"
            errorText={formik.touched.category && formik.errors.category}
            invalid={formik.touched.category && formik.errors.category}
            selectProps={{
              name: "category",
              id: "category",
              value: formik.values.category,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobCategories}
          />
          <Select
            label="Sort"
            errorText={formik.touched.sort && formik.errors.sort}
            invalid={formik.touched.sort && formik.errors.sort}
            selectProps={{
              name: "sort",
              id: "sort",
              value: formik.values.sort,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={sortOptions}
          />
          <Button
            disabled={jobsIsLoading}
            type="submit"
            className={styles.submitBtn}
          >
            Submit
          </Button>
        </Card>
      </form>
      {!jobsIsLoading ? (
        count ? (
          <>
            <h3>{`${count} job${count > 1 ? "s" : ""} found`}</h3>
            <ul className={styles.jobList}>
              {jobs.map((job) => {
                return (
                  <li className={styles.linkContainer} key={job._id}>
                    <Link href={`/jobs/my/${job._id}/applications`}>
                      <JobCard job={job} />
                    </Link>
                    <div className={styles.btnContainer}>
                      <Button onClick={openDeleteModal.bind(this, job._id)}>
                        <FaRegTrashAlt />
                      </Button>
                      <Button onClick={openEditModal.bind(this, job._id)}>
                        <FaEdit />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {numOfPages > 1 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={pageHandler}
                pageRangeDisplayed={5}
                pageCount={numOfPages}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                className={styles.paginateContainer}
                pageLinkClassName={styles.paginatePage}
                activeLinkClassName={styles.activePaginatePage}
                previousLinkClassName={styles.paginateBtn}
                nextLinkClassName={styles.paginateBtn}
                forcePage={currentPage}
              />
            )}
          </>
        ) : (
          <h3>No jobs found...!!!</h3>
        )
      ) : (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      )}
      <Modal isOpen={showDeleteModal} onClose={closeDeleteModal}>
        <div className={styles.modal}>
          <h4>Are you sure to delete?</h4>
          <p>
            All the applications related to this job will be deleted as well.
          </p>
          <div className={styles.actionBtnContainer}>
            <Button onClick={deleteJobHandler}>Confirm</Button>
            <Button onClick={closeDeleteModal}>Cancel</Button>
          </div>
        </div>
      </Modal>
      <UpdateJobForm
        isOpen={showEditModal}
        onClose={closeEditModal}
        jobId={updateJobId}
        onEdit={onEditJobHandler}
      />
    </div>
  );
};

export default EmployerJobs;
