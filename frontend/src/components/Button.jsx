const Button = ({ variant = "primary", children, ...props }) => {
  const className = variant === "primary" ? "btn-primary" : "btn-secondary"
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

export default Button 