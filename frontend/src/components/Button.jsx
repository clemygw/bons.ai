const Button = ({ variant = "primary", children, className = "", ...props }) => {
  const baseClass = variant === "primary" 
    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
    : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
  
  return (
    <button className={`px-4 py-2 rounded-lg transition-colors ${baseClass} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button

