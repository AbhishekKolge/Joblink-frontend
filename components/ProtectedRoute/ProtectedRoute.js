import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { checkLoginStatus } from "../../store/actions/auth/authActions";
import Loading from "../Loading/Loading";

const ProtectedRoute = (pageProps) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, []);

  useEffect(() => {
    if (isLoggedIn && pageProps?.loggedInProtected) {
      router.push({
        pathname: "/",
      });
    }

    if (isLoggedIn === false && pageProps.userProtected) {
      router.push({
        pathname: "/",
      });
    }

    if (isLoggedIn && role !== "employer" && pageProps?.employerProtected) {
      router.push({
        pathname: "/",
      });
    }
  }, [
    isLoggedIn,
    pageProps.loggedInProtected,
    pageProps.userProtected,
    pageProps.employerProtected,
    role,
  ]);

  if (isLoggedIn === null && !pageProps.opened) {
    return <Loading />;
  }

  return pageProps.children;
};

export default ProtectedRoute;
