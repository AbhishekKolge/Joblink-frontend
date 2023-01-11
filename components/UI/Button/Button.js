const Button = (props) => {
  const { children, className } = props;
  return (
    <button {...props} className={`btn ${className}`}>
      {children}
    </button>
  );
};

export default Button;
