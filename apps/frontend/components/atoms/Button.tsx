'use client'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      type={props.type || 'button'}
      className={`cursor-pointer rounded px-4 py-2 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
