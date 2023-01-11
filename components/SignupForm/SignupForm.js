import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Select from "../UI/Select/Select";

import styles from "./SignupForm.module.css";

import { useRegisterMutation } from "../../store/slices/api/authApiSlice";

const options = [
  {
    id: 1,
    value: "",
    name: "Select",
  },
  {
    id: 2,
    value: "user",
    name: "Job Seeker",
  },
  {
    id: 3,
    value: "employer",
    name: "Employer",
  },
];

const SignupForm = () => {
  const [
    register,
    {
      isSuccess: registerSuccess,
      isError: registerIsError,
      isLoading: registerLoading,
      error: registerError,
    },
  ] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      role: "",
      companyName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(3, "Must be minimum 3 characters")
        .max(20, "Must not be more than 20 characters")
        .required("Required"),
      lastName: Yup.string()
        .trim()
        .max(20, "Must not be more than 20 characters"),
      role: Yup.string().oneOf(["user", "employer"]).required("required"),
      companyName: Yup.string().when("role", {
        is: "employer",
        then: Yup.string()
          .trim()
          .max(40, "Must not be more than 40 characters")
          .required("required"),
      }),
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .required("required"),
      password: Yup.string()
        .trim()
        .password()
        .min(8, "Must be minimum 8 characters")
        .minLowercase(1, "Must include 1 lowercase letter")
        .minUppercase(1, "Must include 1 uppercase letter")
        .minSymbols(1, "Must include 1 special letter")
        .minNumbers(1, "Must include 1 number letter")
        .required("required"),
    }),
    onSubmit: async (values) => {
      await register(values);
    },
  });

  useEffect(() => {
    if (registerIsError) {
      if (registerError.data?.msg) {
        toast.error(registerError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (registerSuccess) {
      toast.success("Verification email sent");
      formik.resetForm();
    }
  }, [registerIsError, registerSuccess, registerError]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className={styles.card}>
        <Input
          label="First Name"
          invalid={formik.touched.firstName && formik.errors.firstName}
          errorText={formik.touched.firstName && formik.errors.firstName}
          inputProps={{
            required: true,
            name: "firstName",
            id: "firstName",
            placeholder: "First Name",
            value: formik.values.firstName,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
        />
        <Input
          label="Last Name"
          invalid={formik.touched.lastName && formik.errors.lastName}
          errorText={formik.touched.lastName && formik.errors.lastName}
          inputProps={{
            name: "lastName",
            id: "lastName",
            placeholder: "Last Name",
            value: formik.values.lastName,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
        />
        <Select
          label="Role"
          invalid={formik.touched.role && formik.errors.role}
          selectProps={{
            name: "role",
            id: "role",
            required: true,
            value: formik.values.role,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
          options={options}
          errorText={formik.touched.role && formik.errors.role}
        />
        {formik.values.role === "employer" && (
          <Input
            label="Company Name"
            invalid={formik.touched.companyName && formik.errors.companyName}
            errorText={formik.touched.companyName && formik.errors.companyName}
            inputProps={{
              required: true,
              name: "companyName",
              id: "companyName",
              placeholder: "Company Name",
              value: formik.values.companyName,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
        )}
        <Input
          label="Email address"
          invalid={formik.touched.email && formik.errors.email}
          errorText={formik.touched.email && formik.errors.email}
          inputProps={{
            type: "email",
            required: true,
            name: "email",
            id: "email",
            placeholder: "Email Address",
            value: formik.values.email,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
        />
        <Input
          label="Password"
          invalid={formik.touched.password && formik.errors.password}
          errorText={formik.touched.password && formik.errors.password}
          inputProps={{
            type: "password",
            required: true,
            name: "password",
            id: "password",
            placeholder: "Password",
            value: formik.values.password,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
        />
        <Button
          disabled={registerLoading}
          type="submit"
          className={styles.submitBtn}
        >
          Sign Up
        </Button>
      </Card>
    </form>
  );
};

export default SignupForm;
