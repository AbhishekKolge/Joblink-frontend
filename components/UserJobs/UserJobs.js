import { useEffect, useState } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import Spinner from "../UI/Spinner/Spinner";
import Card from "../UI/Card/Card";
import Select from "../UI/Select/Select";
import Button from "../UI/Button/Button";
import Application from "../Application/Application";

import styles from "./UserJobs.module.css";

import { useGetUserApplicationsMutation } from "../../store/slices/api/applicationApiSlice";

const statusOptions = [
  {
    id: 1,
    value: "",
    name: "All",
  },
  {
    id: 2,
    value: "pending",
    name: "Pending",
  },
  {
    id: 3,
    value: "interview",
    name: "Interview",
  },
  {
    id: 4,
    value: "selected",
    name: "Selected",
  },
  {
    id: 5,
    value: "declined",
    name: "Declined",
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
];

const UserJobs = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const [
    getUserApplications,
    {
      data: userApplicationData,
      isSuccess: userApplicationSuccess,
      isError: userApplicationIsError,
      isLoading: userApplicationLoading,
      error: userApplicationError,
    },
  ] = useGetUserApplicationsMutation();

  useEffect(() => {
    if (isLoggedIn && role === "user") {
      (async () => {
        await getUserApplications();
      })();
    }
  }, [isLoggedIn, role]);

  const formik = useFormik({
    initialValues: {
      status: "",
      sort: "latest",
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(["pending", "interview", "selected", "declined"])
        .optional(),
      sort: Yup.string().oneOf(["latest", "oldest", "a-z", "z-a"]).optional(),
    }),
    onSubmit: async (values) => {
      await getUserApplications(values);
    },
  });

  useEffect(() => {
    if (userApplicationIsError) {
      if (userApplicationError.data?.msg) {
        toast.error(userApplicationError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (userApplicationSuccess) {
      const { totalApplications } = userApplicationData;
      if (!totalApplications) {
        toast.error("No applications found");
      } else {
        toast.success("Applications listed");
      }
    }
  }, [
    userApplicationData,
    userApplicationSuccess,
    userApplicationIsError,
    userApplicationError,
  ]);

  const pageHandler = async (event) => {
    setCurrentPage(event.selected);
    const page = event.selected + 1;
    await getUserApplications({ ...formik.values, page });
  };

  return userApplicationSuccess ? (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit}>
        <Card className={styles.card}>
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
            options={statusOptions}
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
            disabled={userApplicationLoading}
            type="submit"
            className={styles.submitBtn}
          >
            Submit
          </Button>
        </Card>
      </form>
      {userApplicationData.totalApplications ? (
        <>
          <h3>{`${userApplicationData.totalApplications} application${
            userApplicationData.totalApplications > 1 ? "s" : ""
          } found`}</h3>
          <ul className={styles.jobList}>
            {userApplicationData.applications.map((application) => {
              return (
                <li key={application._id}>
                  <Application application={application} />
                </li>
              );
            })}
          </ul>
          {userApplicationData.numOfPages > 1 && (
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={pageHandler}
              pageRangeDisplayed={5}
              pageCount={userApplicationData.numOfPages}
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
        <h3>No applications found...!!!</h3>
      )}
    </div>
  ) : (
    <div className={styles.loadingContainer}>
      <Spinner />
    </div>
  );
};

export default UserJobs;
