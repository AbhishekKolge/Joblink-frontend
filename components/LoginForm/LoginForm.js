import { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

import styles from "./LoginForm.module.css";

import { useLoginMutation } from "../../store/slices/api/authApiSlice";
import { loginHandler } from "../../store/actions/auth/authActions";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [
    login,
    {
      data: loginData,
      isSuccess: loginSuccess,
      isError: loginIsError,
      isLoading: loginLoading,
      error: loginError,
    },
  ] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: credentials.email,
      password: credentials.password,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
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
      await login(values);
    },
  });

  useEffect(() => {
    if (loginIsError) {
      if (loginError.data?.msg) {
        toast.error(loginError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (loginSuccess) {
      const { accessToken, refreshToken, role, userId } = loginData;
      dispatch(
        loginHandler({
          accessToken,
          refreshToken,
          role,
          userId,
        })
      );

      formik.resetForm();

      toast.success("Logged in successfully");
    }
  }, [loginIsError, loginData, loginSuccess, loginError]);

  const testEmployerLoginHandler = (e) => {
    e.preventDefault();
    setCredentials({
      email: "test-employer@gmail.com",
      password: "Test@123",
    });
  };

  const testUserLoginHandler = (e) => {
    e.preventDefault();
    setCredentials({
      email: "test-user@gmail.com",
      password: "Test@123",
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className={styles.card}>
        <Input
          label="Email address"
          errorText={formik.touched.email && formik.errors.email}
          invalid={formik.touched.email && formik.errors.email}
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
          disabled={loginLoading || loginSuccess}
          type="submit"
          className={styles.submitBtn}
        >
          Login
        </Button>
        <div className={styles.testLoginContainer}>
          <Button
            disabled={loginLoading || loginSuccess}
            className={styles.submitBtn}
            onClick={testUserLoginHandler}
          >
            Login As Test User
          </Button>
          <Button
            disabled={loginLoading || loginSuccess}
            className={styles.submitBtn}
            onClick={testEmployerLoginHandler}
          >
            Login As Test Employer
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default LoginForm;
