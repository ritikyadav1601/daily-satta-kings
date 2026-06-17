const LoadingSpinner = ({ className = "h-10 w-10" }) => {
  return (
    <span
      aria-label="Waiting for result"
      role="status"
      className={`loading-spinner ${className}`}
    />
  );
};

export default LoadingSpinner;
