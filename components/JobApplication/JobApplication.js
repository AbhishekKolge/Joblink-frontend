import Image from "next/image";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Card from "../UI/Card/Card";
import Select from "../UI/Select/Select";
import Button from "../UI/Button/Button";

import { formatDate } from "../../helpers/numberFormat";

import { useUpdateApplicationMutation } from "../../store/slices/api/applicationApiSlice";

import styles from "./JobApplication.module.css";

const options = [
  {
    id: 1,
    value: "pending",
    name: "Pending",
  },
  {
    id: 2,
    value: "interview",
    name: "Interview",
  },
  {
    id: 3,
    value: "selected",
    name: "Selected",
  },
  {
    id: 4,
    value: "declined",
    name: "Declined",
  },
];

const Application = (props) => {
  const {
    application: { status, user, _id },
  } = props;

  const [
    updateApplication,
    {
      isSuccess: updateApplicationSuccess,
      isError: updateApplicationIsError,
      isLoading: updateApplicationLoading,
      error: updateApplicationError,
    },
  ] = useUpdateApplicationMutation();

  const formik = useFormik({
    initialValues: {
      status: status,
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .oneOf(["pending", "interview", "selected", "declined"])
        .required("required"),
    }),
    onSubmit: async (values) => {
      await updateApplication({ applicationId: _id, status: values.status });
    },
  });

  useEffect(() => {
    if (updateApplicationIsError) {
      if (updateApplicationError.data?.msg) {
        toast.error(updateApplicationError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (updateApplicationSuccess) {
      toast.success("Application updated successfully");
    }
  }, [
    updateApplicationSuccess,
    updateApplicationIsError,
    updateApplicationError,
  ]);

  return (
    <Card className={styles.card}>
      <div className={styles.headerContainer}>
        <Image
          priority={true}
          className={styles.jobImage}
          alt="employer profile image"
          src={
            !user.profileImage
              ? user.gender === "male"
                ? "/male-dummy-profile.jpg"
                : "/female-dummy-profile.jpg"
              : user.profileImage
          }
          width={80}
          height={80}
        />
        <div className={styles.headerDetails}>
          <strong className={styles.title}>{`${user.firstName}${
            user.lastName && ` ${user.lastName}`
          }`}</strong>
          <span>
            <strong>Email</strong>: {user.email}
          </span>
          <span>
            <strong>Contact No.</strong>: {user.contactNo || "Not mentioned"}
          </span>
        </div>
      </div>

      <div className={styles.footerContainer}>
        <span>
          <strong>Status</strong>: {user.status}
        </span>
        <span>
          <strong>Designation</strong>: {user.designation || "Not mentioned"}
        </span>
        <span>
          <strong>D.O.B.</strong>:{" "}
          {user.dob ? formatDate(user.dob) : "Not mentioned"}
        </span>
        <span>
          <strong>Gender</strong>: {user.gender}
        </span>
        <span>
          <strong>Company</strong>: {user.companyName || "Not mentioned"}
        </span>
        <span>
          <strong>City</strong>: {user.city || "Not mentioned"}
        </span>
      </div>

      {user.jobCategories.length ? (
        <div className={styles.tagContainer}>
          {user.jobCategories.map((category) => (
            <span className={styles.tag} key={category._id}>
              {category.name}
            </span>
          ))}
        </div>
      ) : null}

      {user.resume ? (
        <a className={`link`} href={user.resume} target="_blank">
          Download Resume
        </a>
      ) : null}

      <form onSubmit={formik.handleSubmit} className={styles.updateForm}>
        <Select
          label="Application status"
          errorText={formik.touched.status && formik.errors.status}
          invalid={formik.touched.status && formik.errors.status}
          selectProps={{
            name: "status",
            id: "status",
            value: formik.values.status,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
          options={options}
        />
        <Button disabled={updateApplicationLoading} type="submit">
          Update
        </Button>
      </form>
    </Card>
  );
};

export default Application;
