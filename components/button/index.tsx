type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    className?: string
}

const btnClass = "bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50"

const Button = ({ children, onClick, disabled, className }: ButtonProps) => {
    const customClass = className ? ` ${className}` : ''
    return (
        <button className={`${btnClass}${customClass}`} disabled={disabled} onClick={onClick}>{children}</button>
    )
}


export { Button }