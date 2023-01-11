import MoonLoader from "react-spinners/MoonLoader";

const Spinner = ({ loading, size = 60 }) => {
  return (
    <MoonLoader
      color={"#0070f3"}
      loading={loading}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
