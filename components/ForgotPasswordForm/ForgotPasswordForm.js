import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";

import styles from "./ForgotPasswordForm.module.css";

import { useForgotPasswordMutation } from "../../store/slices/api/authApiSlice";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [
    forgotPassword,
    {
      isSuccess: forgotPasswordSuccess,
      isError: forgotPasswordIsError,
      isLoading: forgotPasswordLoading,
      error: forgotPasswordError,
    },
  ] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Email is not valid")
        .required("required"),
    }),
    onSubmit: async (values) => {
      await forgotPassword(values);
    },
  });

  useEffect(() => {
    if (forgotPasswordIsError) {
      if (forgotPasswordError.data?.msg) {
        toast.error(forgotPasswordError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (forgotPasswordSuccess) {
      toast.success("Password reset link sent");

      formik.resetForm();
      router.push({
        pathname: "/login",
      });
    }
  }, [forgotPasswordIsError, forgotPasswordSuccess, forgotPasswordError]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className={styles.card}>
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
        <Button
          disabled={forgotPasswordLoading || forgotPasswordSuccess}
          type="submit"
          className={styles.submitBtn}
        >
          Submit
        </Button>
      </Card>
    </form>
  );
};

export default ForgotPasswordForm;
