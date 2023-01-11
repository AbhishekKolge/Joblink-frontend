import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

import styles from "./ResetPasswordForm.module.css";

import { useResetPasswordMutation } from "../../store/slices/api/authApiSlice";

const ResetPasswordForm = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [
    resetPassword,
    {
      isSuccess: resetPasswordSuccess,
      isError: resetPasswordIsError,
      isLoading: resetPasswordLoading,
      error: resetPasswordError,
    },
  ] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .trim()
        .password()
        .min(8, "Must be minimum 8 characters")
        .minLowercase(1, "Must include 1 lowercase letter")
        .minUppercase(1, "Must include 1 uppercase letter")
        .minSymbols(1, "Must include 1 special letter")
        .minNumbers(1, "Must include 1 number letter")
        .required("required"),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      await resetPassword({
        password: values.password,
        token,
        email,
      });
    },
  });

  useEffect(() => {
    if (!token || !email) {
      toast.error("Verification failed");
      router.push({
        pathname: "/login",
      });
    }
  }, [token, email]);

  useEffect(() => {
    if (resetPasswordIsError) {
      if (resetPasswordError.data?.msg) {
        toast.error(resetPasswordError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (resetPasswordSuccess) {
      formik.resetForm();
      toast.success("Password changed successfully");
      router.push({
        pathname: "/login",
      });
    }
  }, [resetPasswordIsError, resetPasswordSuccess, resetPasswordError]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className={styles.card}>
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
        <Input
          label="Confirm Password"
          invalid={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          errorText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          inputProps={{
            type: "password",
            required: true,
            name: "confirmPassword",
            id: "confirmPassword",
            placeholder: "confirm Password",
            value: formik.values.confirmPassword,
            onBlur: formik.handleBlur,
            onChange: formik.handleChange,
          }}
        />
        <Button
          disabled={resetPasswordLoading || resetPasswordSuccess}
          type="submit"
          className={styles.submitBtn}
        >
          Reset Password
        </Button>
      </Card>
    </form>
  );
};

export default ResetPasswordForm;
