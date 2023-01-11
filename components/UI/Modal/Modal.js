import { createPortal } from "react-dom";
import { FaRegTimesCircle } from "react-icons/fa";

import styles from "./Modal.module.css";

const Modal = (props) => {
  const { children, isOpen, onClose, className } = props;
  return isOpen
    ? createPortal(
        <div className={styles.overlay}>
          <div className={`${styles.card} ${className}`}>
            <button onClick={onClose} className={styles.closeBtn}>
              <FaRegTimesCircle />
            </button>
            {children}
          </div>
        </div>,
        document.getElementById("root-modal")
      )
    : null;
};

export default Modal;
