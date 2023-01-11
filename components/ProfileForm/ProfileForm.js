import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import Select from "react-select";
import * as Yup from "yup";
import "yup-phone";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import CustomSelect from "../UI/Select/Select";
import Spinner from "../UI/Spinner/Spinner";
import Modal from "../UI/Modal/Modal";

import styles from "./ProfileForm.module.css";

import {
  useShowMeQuery,
  useUploadMutation,
  useUploadResumeMutation,
  useUpdateProfileMutation,
  useRemoveFileMutation,
  useDeleteAccountMutation,
} from "../../store/slices/api/userApiSlice";

import { logoutHandler } from "../../store/actions/auth/authActions";

const options = [
  {
    id: 1,
    value: "active",
    name: "Active",
  },
  {
    id: 2,
    value: "inactive",
    name: "Inactive",
  },
];

const optionsGender = [
  {
    id: 1,
    value: "male",
    name: "Male",
  },
  {
    id: 2,
    value: "female",
    name: "Female",
  },
];

const ProfileForm = () => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [selectedJobCategories, setSelectedJobCategories] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const imageInputRef = useRef(null);
  const {
    data: profileData,
    isLoading: profileLoading,
    isSuccess: profileSuccess,
    isError: profileIsError,
    error: profileError,
  } = useShowMeQuery(
    {},
    {
      skip: isLoggedIn ? false : true,
    }
  );

  const [
    upload,
    {
      isSuccess: uploadSuccess,
      isError: uploadIsError,
      error: uploadError,
      isLoading: uploadIsLoading,
    },
  ] = useUploadMutation();

  const [
    deleteAccount,
    {
      isSuccess: deleteAccountSuccess,
      isError: deleteAccountIsError,
      error: deleteAccountError,
    },
  ] = useDeleteAccountMutation();

  const [
    uploadResume,
    {
      isSuccess: uploadResumeSuccess,
      error: uploadResumeError,
      isError: uploadResumeIsError,
      isLoading: uploadResumeIsLoading,
    },
  ] = useUploadResumeMutation();

  const [
    updateProfile,
    {
      isSuccess: updateProfileSuccess,
      isError: updateProfileIsError,
      isLoading: updateProfileLoading,
      error: updateProfileError,
    },
  ] = useUpdateProfileMutation();
  const [
    removeFile,
    {
      isSuccess: removeFileSuccess,
      isError: removeFileIsError,
      isLoading: removeFileLoading,
      error: removeFileError,
    },
  ] = useRemoveFileMutation();

  const profileImageClickHandler = () => {
    imageInputRef.current.click();
  };
  const uploadProfileImageHandler = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    await upload(formData);
  };
  const uploadResumeHandler = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("resume", file);
    await uploadResume(formData);
  };

  const formik = useFormik({
    initialValues: {
      firstName: profileData?.user?.firstName || "",
      lastName: profileData?.user?.lastName || "",
      designation: profileData?.user?.designation || "",
      contactNo: profileData?.user?.contactNo || "",
      dob: profileData?.user?.dob || "",
      city: profileData?.user?.city || "",
      status: profileData?.user?.status || "",
      companyName: profileData?.user?.companyName || "",
      gender: profileData?.user?.gender || "",
      email: profileData?.user?.email || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(3, "Must be minimum 3 characters")
        .max(20, "Must not be more than 20 characters")
        .required("Required"),
      lastName: Yup.string()
        .trim()
        .max(20, "Must not be more than 20 characters"),
      designation: Yup.string()
        .trim()
        .max(40, "Must not be more than 40 characters"),
      contactNo: Yup.string()
        .trim()
        .phone("IN", "Please enter a valid contact no"),
      dob: Yup.date(),
      city: Yup.string().trim().max(20, "Must not be more than 20 characters"),
      status: Yup.string().oneOf(["active", "inactive"]).required("required"),
      companyName:
        role === "employer"
          ? Yup.string()
              .trim()
              .max(40, "Must not be more than 40 characters")
              .required("required")
          : Yup.string().optional(),

      gender: Yup.string().oneOf(["male", "female"]).required("required"),
    }),
    onSubmit: async (values) => {
      values.jobCategories = selectedJobCategories.map(
        (category) => category.value
      );
      await updateProfile(values);
    },
  });

  const selectJobCategoriesHandler = (selectedOption) => {
    setSelectedJobCategories(selectedOption);
  };

  useEffect(() => {
    let uploadingToast;
    if (uploadIsLoading) {
      uploadingToast = toast.loading(
        "Uploading profile image, please be patient"
      );
    }
    if (uploadIsError) {
      toast.dismiss(uploadingToast);
      if (uploadError.data?.msg) {
        toast.error(uploadError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (uploadSuccess) {
      toast.dismiss(uploadingToast);
      toast.success("Profile photo uploaded successfully");
    }
  }, [uploadSuccess, uploadError, uploadIsError, uploadIsLoading]);

  useEffect(() => {
    let uploadingToast;
    if (uploadResumeIsLoading) {
      uploadingToast = toast.loading("Uploading resume, please be patient");
    }
    if (uploadResumeIsError) {
      toast.dismiss(uploadingToast);
      if (uploadResumeError.data?.msg) {
        toast.error(uploadResumeError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (uploadResumeSuccess) {
      toast.dismiss(uploadingToast);
      toast.success("Resume uploaded successfully");
    }
  }, [
    uploadResumeSuccess,
    uploadResumeError,
    uploadResumeIsError,
    uploadResumeIsLoading,
  ]);

  useEffect(() => {
    if (updateProfileIsError) {
      if (updateProfileError.data?.msg) {
        toast.error(updateProfileError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (updateProfileSuccess) {
      toast.success("Profile updated successfully");
    }
  }, [updateProfileSuccess, updateProfileError, updateProfileIsError]);

  useEffect(() => {
    let removingToast;
    if (removeFileLoading) {
      removingToast = toast.loading("Removing file, please be patient");
    }
    if (removeFileIsError) {
      toast.dismiss(removingToast);
      if (removeFileError.data?.msg) {
        toast.error(removeFileError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (removeFileSuccess) {
      toast.dismiss(removingToast);
      toast.success("File deleted successfully");
    }
  }, [
    removeFileIsError,
    removeFileError,
    removeFileSuccess,
    removeFileLoading,
  ]);

  useEffect(() => {
    if (profileIsError) {
      if (profileError.data?.msg) {
        toast.error(profileError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (profileSuccess) {
      setProfileImage(profileData?.user?.profileImage);
      const options = profileData.jobCategories.map((category) => {
        return {
          value: category._id,
          label: category.name,
        };
      });
      setJobCategoryOptions(options);

      const defaultOptions = options.filter((option) => {
        let item;
        profileData?.user?.jobCategories.forEach((category) => {
          if (category === option.value) {
            item = option;
          }
        });
        return item;
      });

      setSelectedJobCategories(defaultOptions);
    }
  }, [profileData, profileSuccess, profileError, profileIsError]);

  useEffect(() => {
    if (deleteAccountIsError) {
      if (deleteAccountError.data?.msg) {
        toast.error(deleteAccountError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }
    if (deleteAccountSuccess) {
      router.push({
        pathname: "/",
      });
      dispatch(logoutHandler());
      toast.success("Account deleted successfully");
    }
  }, [deleteAccountSuccess, deleteAccountError, deleteAccountIsError]);

  const toggleDeleteModal = () => {
    setShowDeleteModal((prevState) => !prevState);
  };

  const deleteAccountHandler = async () => {
    await deleteAccount();
  };

  return profileSuccess && profileData ? (
    <>
      <div>
        <Image
          priority={true}
          onClick={profileImageClickHandler}
          src={
            !profileImage
              ? profileData.user.gender === "male"
                ? "/male-dummy-profile.jpg"
                : "/female-dummy-profile.jpg"
              : profileImage
          }
          width={200}
          height={100}
          alt="profile image"
          className={styles.profileImage}
        />
        {profileImage ? (
          <Button
            onClick={async () =>
              await removeFile({
                fileId: profileData?.user?.profileImageId,
                isResume: 0,
              })
            }
            className={`${styles.removeBtn} ${styles.removeProfileImage}`}
          >
            Remove Profile Image
          </Button>
        ) : null}
      </div>

      <div>
        {role === "user" ? (
          <Input
            label="Upload Resume"
            className={styles.resumeUploader}
            inputProps={{
              type: "file",
              name: "resume",
              id: "resume",
              onChange: uploadResumeHandler,
            }}
          />
        ) : null}
        {profileData?.user?.resume ? (
          <div className={styles.resumeContainer}>
            <a
              href={profileData?.user?.resume}
              target="_blank"
              className={`link ${styles.pdfLink}`}
            >
              View Resume
            </a>
            <Button
              onClick={async () =>
                await removeFile({
                  fileId: profileData?.user?.resumeId,
                  isResume: 1,
                })
              }
              className={styles.removeBtn}
            >
              Delete Resume
            </Button>
          </div>
        ) : null}

        <input
          onChange={uploadProfileImageHandler}
          ref={imageInputRef}
          className={styles.imageInput}
          type="file"
        />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Card className={styles.card}>
          <Input
            label="First name"
            errorText={formik.touched.firstName && formik.errors.firstName}
            invalid={formik.touched.firstName && formik.errors.firstName}
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
            label="Last name"
            errorText={formik.touched.lastName && formik.errors.lastName}
            invalid={formik.touched.lastName && formik.errors.lastName}
            inputProps={{
              name: "lastName",
              id: "lastName",
              placeholder: "Last Name",
              value: formik.values.lastName,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Input
            label="Designation"
            errorText={formik.touched.designation && formik.errors.designation}
            invalid={formik.touched.designation && formik.errors.designation}
            inputProps={{
              name: "designation",
              id: "designation",
              placeholder: "Designation",
              value: formik.values.designation,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <div className={styles.selectContainer}>
            <label>Job categories</label>
            <Select
              className={styles.select}
              isMulti
              value={selectedJobCategories}
              options={jobCategoryOptions}
              onChange={selectJobCategoriesHandler}
            />
          </div>
          <Input
            label="Contact number"
            errorText={formik.touched.contactNo && formik.errors.contactNo}
            invalid={formik.touched.contactNo && formik.errors.contactNo}
            inputProps={{
              type: "number",
              name: "contactNo",
              id: "contactNo",
              value: formik.values.contactNo,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Input
            label="DOB"
            errorText={formik.touched.dob && formik.errors.dob}
            invalid={formik.touched.dob && formik.errors.dob}
            inputProps={{
              type: "date",
              name: "dob",
              id: "dob",
              value:
                formik.values.dob &&
                new Date(formik.values.dob).toLocaleDateString("en-CA"),
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <Input
            label="City"
            errorText={formik.touched.city && formik.errors.city}
            invalid={formik.touched.city && formik.errors.city}
            inputProps={{
              name: "city",
              id: "city",
              placeholder: "City",
              value: formik.values.city,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
          />
          <CustomSelect
            errorText={formik.touched.status && formik.errors.status}
            invalid={formik.touched.status && formik.errors.status}
            label="Status"
            selectProps={{
              name: "status",
              id: "status",
              value: formik.values.status,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={options}
          />
          {role === "employer" && (
            <Input
              label="Company name"
              errorText={
                formik.touched.companyName && formik.errors.companyName
              }
              invalid={formik.touched.companyName && formik.errors.companyName}
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
              readOnly: true,
            }}
          />
          <CustomSelect
            label="Gender"
            errorText={formik.touched.gender && formik.errors.gender}
            invalid={formik.touched.gender && formik.errors.gender}
            selectProps={{
              name: "gender",
              id: "gender",
              value: formik.values.gender,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
            }}
            options={optionsGender}
          />
          <Button
            disabled={updateProfileLoading || profileLoading}
            type="submit"
            className={styles.submitBtn}
          >
            Update
          </Button>
        </Card>
      </form>
      <Button onClick={toggleDeleteModal} className={styles.deleteBtn}>
        Delete Account
      </Button>
      <Modal isOpen={showDeleteModal} onClose={toggleDeleteModal}>
        <div className={styles.modal}>
          <h4>Are you sure to delete?</h4>
          <p>
            All the information related to this account will be deleted
            permanently
          </p>
          <div className={styles.actionBtnContainer}>
            <Button onClick={deleteAccountHandler}>Confirm</Button>
            <Button onClick={toggleDeleteModal}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  ) : (
    <Spinner />
  );
};

export default ProfileForm;
