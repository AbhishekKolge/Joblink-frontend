import { useEffect, useState, useId } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Select from "../UI/Select/Select";
import Modal from "../UI/Modal/Modal";

import styles from "./UpdateJob.module.css";

import {
  useGetAllJobCategoriesQuery,
  useGetMyJobQuery,
  useUpdateJobMutation,
} from "../../store/slices/api/jobApiSlice";

const jobTypeOptions = [
  {
    id: 1,
    value: "full-time",
    name: "Full-time",
  },
  {
    id: 2,
    value: "part-time",
    name: "Part-time",
  },
  {
    id: 3,
    value: "contract",
    name: "Contract",
  },
  {
    id: 4,
    value: "internship",
    name: "Internship",
  },
];
const jobStatusOptions = [
  {
    id: 1,
    value: "open",
    name: "Open",
  },
  {
    id: 2,
    value: "closed",
    name: "Closed",
  },
];

const UpdateJobForm = (props) => {
  const { isOpen, onClose, jobId, onEdit } = props;
  const [jobCategories, setJobCategories] = useState([]);
  const {
    data: jobCategoriesData,
    isSuccess: jobCategoriesSuccess,
    isError: jobCategoriesIsError,
    error: jobCategoriesError,
  } = useGetAllJobCategoriesQuery();

  const [
    updateJob,
    {
      isSuccess: updateJobSuccess,
      isError: updateJobIsError,
      error: updateJobError,
    },
  ] = useUpdateJobMutation();

  const {
    data: myJobData,
    isSuccess: myJobSuccess,
    isError: myJobIsError,
    error: myJobError,
  } = useGetMyJobQuery(jobId, { skip: isOpen && jobId ? false : true });

  useEffect(() => {
    if (jobCategoriesSuccess && jobCategoriesData.count) {
      const options = jobCategoriesData.jobCategories.map((category) => {
        return {
          id: category.id,
          value: category.id,
          name: category.name,
        };
      });

      setJobCategories(options);
    }

    if (jobCategoriesIsError) {
      if (jobCategoriesError.data?.msg) {
        toast.error(jobCategoriesError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
  }, [
    jobCategoriesData,
    jobCategoriesSuccess,
    jobCategoriesError,
    jobCategoriesIsError,
  ]);

  useEffect(() => {
    if (myJobIsError) {
      if (myJobError.data?.msg) {
        toast.error(myJobError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
  }, [myJobError, myJobIsError]);

  useEffect(() => {
    if (updateJobIsError) {
      if (updateJobError.data?.msg) {
        toast.error(updateJobError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }

    if (updateJobSuccess) {
      toast.success("Job updated successfully");
      (async () => {
        await onEdit();
      })();
    }
  }, [updateJobSuccess, updateJobIsError, updateJobError]);

  const formik = useFormik({
    initialValues: {
      title: myJobData?.job?.title || "",
      location: myJobData?.job?.location || "",
      type: myJobData?.job?.type || "",
      description: myJobData?.job?.description || "",
      minSalary: myJobData?.job?.minSalary || "",
      maxSalary: myJobData?.job?.maxSalary || "",
      status: myJobData?.job?.status || "",
      jobCategory: myJobData?.job?.jobCategory._id || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string()
        .trim()
        .min(3, "Must be minimum 3 characters")
        .max(40, "Must not be more than 40 characters")
        .required("Required"),
      location: Yup.string()
        .trim()
        .min(3, "Must be minimum 3 characters")
        .max(40, "Must not be more than 40 characters")
        .required("Required"),
      type: Yup.string()
        .oneOf(["full-time", "part-time", "contract", "internship"])
        .required("Required"),
      description: Yup.string().max(
        1000,
        "Must not be more than 1000 characters"
      ),
      minSalary: Yup.number(),
      maxSalary: Yup.number(),
      status: Yup.string().oneOf(["open", "closed"]).required("required"),
      jobCategory: Yup.string().required("required"),
    }),
    onSubmit: async (values) => {
      formik.resetForm();
      await updateJob({ jobDetails: values, jobId });
    },
  });
  return (
    <Modal className={styles.modal} isOpen={isOpen} onClose={onClose}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <h1 className={styles.heading}>Update a job</h1>
        <div className={styles.inputContainer}>
          <Input
            label="Title"
            errorText={formik.touched.title && formik.errors.title}
            invalid={formik.touched.title && formik.errors.title}
            inputProps={{
              required: true,
              name: "title",
              id: "title",
              placeholder: "Title",
              value: formik.values.title,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Input
            label="Location"
            errorText={formik.touched.location && formik.errors.location}
            invalid={formik.touched.location && formik.errors.location}
            inputProps={{
              required: true,
              name: "location",
              id: "location",
              placeholder: "Location",
              value: formik.values.location,
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
              required: true,
              value: formik.values.type,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobTypeOptions}
          />

          <Input
            label="Minimum salary (annually)"
            errorText={formik.touched.minSalary && formik.errors.minSalary}
            invalid={formik.touched.minSalary && formik.errors.minSalary}
            inputProps={{
              type: "number",
              name: "minSalary",
              id: "minSalary",
              value: formik.values.minSalary,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Input
            label="Maximum salary (annually)"
            errorText={formik.touched.maxSalary && formik.errors.maxSalary}
            invalid={formik.touched.maxSalary && formik.errors.maxSalary}
            inputProps={{
              type: "number",
              name: "maxSalary",
              id: "maxSalary",
              value: formik.values.maxSalary,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Select
            label="Status"
            errorText={formik.touched.status && formik.errors.status}
            invalid={formik.touched.status && formik.errors.status}
            selectProps={{
              name: "status",
              id: "status",
              required: true,
              value: formik.values.status,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobStatusOptions}
          />
          <Input
            className={styles.description}
            isTextarea={true}
            label="Description"
            errorText={formik.touched.description && formik.errors.description}
            invalid={formik.touched.description && formik.errors.description}
            inputProps={{
              name: "description",
              id: "description",
              placeholder: "Description",
              value: formik.values.description,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
              rows: 7,
            }}
          />
          <Select
            label="Category"
            errorText={formik.touched.jobCategory && formik.errors.jobCategory}
            invalid={formik.touched.jobCategory && formik.errors.jobCategory}
            selectProps={{
              name: "jobCategory",
              id: "jobCategory",
              required: true,
              value: formik.values.jobCategory,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={jobCategories}
          />
        </div>
        <div className={styles.submitBtnContainer}>
          <Button type="submit" className={styles.submitBtn}>
            Update
          </Button>
          <Button onClick={onClose} className={styles.submitBtn}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateJobForm;
