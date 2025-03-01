const Button = ({ variant = "primary", children, className = "", ...props }) => {
  const baseClass = variant === "primary" ? "btn-primary" : "btn-secondary"
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button 