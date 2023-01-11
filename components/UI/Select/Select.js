import styles from "./Select.module.css";

const Select = (props) => {
  const { options, label, helperText, errorText, selectProps, invalid } = props;
  return (
    <div className={styles.inputContainer}>
      <label
        htmlFor={selectProps?.id}
        className={`${styles.label} ${invalid ? styles.invalid : ""} ${
          selectProps?.required ? "required" : ""
        }`}
      >
        {label}
      </label>
      <select className={styles.select} {...selectProps}>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.value}>
              {option.name}
            </option>
          );
        })}
      </select>
      <span className={styles.helperText}>{helperText}</span>
      <span className={styles.errorText}>{errorText}</span>
    </div>
  );
};

export default Select;
