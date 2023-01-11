import { forwardRef } from "react";

import styles from "./Input.module.css";

const Input = forwardRef((props, ref) => {
  const {
    label,
    helperText,
    errorText,
    inputProps,
    invalid,
    className,
    isTextarea,
  } = props;
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <label
        htmlFor={inputProps?.id}
        className={`label ${invalid ? "invalid" : ""} ${
          inputProps?.required ? "required" : ""
        }`}
      >
        {label}
      </label>
      {!isTextarea ? (
        <input
          ref={ref}
          {...inputProps}
          className={`${styles.input} ${invalid ? "invalid" : ""}`}
        />
      ) : (
        <textarea
          ref={ref}
          {...inputProps}
          className={`${styles.input} ${invalid ? "invalid" : ""}`}
        />
      )}
      {helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
      {errorText ? <span className={styles.errorText}>{errorText}</span> : null}
    </div>
  );
});

export default Input;
