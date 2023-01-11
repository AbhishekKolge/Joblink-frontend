import { useEffect, useState, useId } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Select from "../UI/Select/Select";
import Spinner from "../UI/Spinner/Spinner";

import styles from "./CreateJobForm.module.css";

import {
  useCreateJobMutation,
  useGetAllJobCategoriesQuery,
} from "../../store/slices/api/jobApiSlice";

const jobTypeOptions = [
  {
    id: 1,
    value: "",
    name: "Select",
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
    name: "Select",
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

const CreateJobForm = () => {
  const [jobCategories, setJobCategories] = useState([]);
  const initialCategoryOptionId = useId();
  const {
    data: jobCategoriesData,
    isSuccess: jobCategoriesSuccess,
    isError: jobCategoriesIsError,
    error: jobCategoriesError,
  } = useGetAllJobCategoriesQuery();
  const [
    createJob,
    {
      isSuccess: createJobSuccess,
      isError: createJobIsError,
      isLoading: createJobLoading,
      error: createJobError,
    },
  ] = useCreateJobMutation();

  useEffect(() => {
    if (jobCategoriesSuccess && jobCategoriesData.count) {
      const options = jobCategoriesData.jobCategories.map((category) => {
        return {
          id: category.id,
          value: category.id,
          name: category.name,
        };
      });
      options.unshift({
        id: initialCategoryOptionId,
        value: "",
        name: "Select",
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
    if (createJobSuccess) {
      toast.success("New job successfully created");
      formik.resetForm();
    }

    if (createJobIsError) {
      if (createJobError.data?.msg) {
        toast.error(createJobError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
  }, [createJobSuccess, createJobError, createJobIsError]);

  const formik = useFormik({
    initialValues: {
      title: "",
      location: "",
      type: "",
      description: "",
      minSalary: "",
      maxSalary: "",
      status: "",
      jobCategory: "",
    },
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
        500,
        "Must not be more than 500 characters"
      ),
      minSalary: Yup.number(),
      maxSalary: Yup.number(),
      status: Yup.string().oneOf(["open", "closed"]).required("required"),
      jobCategory: Yup.string().required("required"),
    }),
    onSubmit: async (values) => {
      await createJob(values);
    },
  });
  return jobCategoriesSuccess ? (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <h1 className={styles.heading}>Create a job</h1>
      <Card className={styles.card}>
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
        <Button
          disabled={createJobLoading}
          type="submit"
          className={styles.submitBtn}
        >
          Create
        </Button>
      </Card>
    </form>
  ) : (
    <div className={styles.loadingContainer}>
      <Spinner />
    </div>
  );
};

export default CreateJobForm;
