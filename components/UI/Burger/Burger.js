import styles from "./Burger.module.css";

const Burger = (props) => {
  const { open, setOpen, className } = props;
  const closeHandler = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <button
      className={`${styles.btn} ${className}`}
      open={open}
      onClick={closeHandler}
    >
      <div className={`${styles.menuIcon} ${open ? styles.open : ""}`} />
      <div className={`${styles.menuIcon} ${open ? styles.open : ""}`} />
      <div className={`${styles.menuIcon} ${open ? styles.open : ""}`} />
    </button>
  );
};

export default Burger;
