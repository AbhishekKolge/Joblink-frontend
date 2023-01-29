import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import styles from "./Layout.module.css";

import Container from "../UI/Container/Container";
import Burger from "../UI/Burger/Burger";

import { useLogoutMutation } from "../../store/slices/api/authApiSlice";
import { logoutHandler } from "../../store/actions/auth/authActions";

const Layout = (props) => {
  const { children } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const settingsBtnRef = useRef();
  const [toggleSettings, setToggleSettings] = useState(false);
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const [openMenu, setOpenMenu] = useState(false);
  const [height, setHeight] = useState("100vh");

  const [
    logout,
    {
      isSuccess: logoutSuccess,
      isError: logoutIsError,
      isLoading: logoutLoading,
      error: logoutError,
    },
  ] = useLogoutMutation();

  const onLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (logoutIsError) {
      if (logoutError.data?.msg) {
        toast.error(logoutError.data.msg.split(",")[0]);
      } else {
        toast.error("Something went wrong!, please try again");
      }
    }

    if (logoutSuccess) {
      dispatch(logoutHandler());
      toast.success("Logout successfully");
      router.push({
        pathname: "/",
      });
    }
  }, [logoutIsError, logoutError, logoutSuccess]);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    const windowHeight = vh * 100;
    setHeight(`${windowHeight}px`);
  }, []);

  const settingsHandler = () => {
    setToggleSettings((prevState) => !prevState);
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [router.asPath]);

  useEffect(() => {
    settingsBtnRef.current &&
      document.addEventListener("click", (e) => {
        if (e.path[0] !== settingsBtnRef.current) {
          setToggleSettings(false);
        }
      });
  }, [settingsBtnRef]);

  return (
    <div className={styles.container} style={{ minHeight: height }}>
      <header className={styles.header}>
        <Container className={styles.navContainer}>
          <nav className={styles.nav}>
            <Link href="/">
              <Image
                priority={true}
                className={styles.logo}
                src="/logo-light.png"
                alt="joblink logo"
                width={100}
                height={80}
              />
            </Link>
            <ul className={styles.linksContainer}>
              <li>
                <Link
                  className={`${router.pathname == "/" ? styles.active : ""} ${
                    styles.link
                  }`}
                  href="/"
                >
                  Jobs
                </Link>
              </li>
              {isLoggedIn && role === "employer" && (
                <li>
                  <Link
                    className={`${
                      router.pathname == "/jobs/create" ? styles.active : ""
                    } ${styles.link}`}
                    href="/jobs/create"
                  >
                    Create job
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link
                    className={`${
                      router.pathname == "/jobs/my" ? styles.active : ""
                    } ${styles.link}`}
                    href="/jobs/my"
                  >
                    My jobs
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link
                    className={`${
                      router.pathname == "/login" ? styles.active : ""
                    } ${styles.link}`}
                    href="/login"
                  >
                    Login
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li className={styles.settingsContainer}>
                  <button
                    ref={settingsBtnRef}
                    onClick={settingsHandler}
                    className={`${styles.linkBtn} ${
                      toggleSettings ? styles.activeLink : ""
                    }`}
                  >
                    Settings
                  </button>

                  {toggleSettings ? (
                    <div className={styles.menuCard}>
                      <ul>
                        <li>
                          <Link
                            className={styles.settingsOption}
                            href="/profile"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={onLogout}
                            className={styles.settingsOption}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </li>
              )}
            </ul>
            <Burger
              open={openMenu}
              setOpen={setOpenMenu}
              className={styles.menuIcon}
            />
            <ul
              className={`${styles.sideMenu} ${openMenu ? styles.open : ""}`}
              style={{ minHeight: height }}
            >
              <li>
                <Link className={styles.mobileLink} href="/">
                  Jobs
                </Link>
              </li>
              {isLoggedIn && role === "employer" && (
                <li>
                  <Link className={styles.mobileLink} href="/jobs/create">
                    Create job
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <Link className={styles.mobileLink} href="/jobs/my">
                    My jobs
                  </Link>
                </li>
              )}
              {!isLoggedIn && (
                <li>
                  <Link className={styles.mobileLink} href="/login">
                    Login
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <>
                  <li>
                    <Link className={styles.mobileLink} href="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={onLogout} className={styles.mobileLink}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </Container>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <Container className={styles.footerContainer}>
          <div className={styles.infoContainer}>
            <Image
              priority={true}
              alt="joblink logo"
              src="/logo-dark.png"
              width={80}
              height={40}
              className={styles.footerLogo}
            />
            <span className={styles.info}>
              Copyright &#169; 2023 Joblink, PVT. LTD. All rights reserved
            </span>
          </div>
          <span className={styles.credit}>
            Created and designed by Abhishek Mohan Kolge
          </span>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
