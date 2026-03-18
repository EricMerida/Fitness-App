export default function Button({
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "btnPrimary",
    secondary: "btnSecondary",
    ghost: "btnGhost",
    danger: "btnDanger",
  };

  return (
    <button
      className={`btn ${variants[variant] || ""} ${className}`}
      {...props}
    />
  );
}
