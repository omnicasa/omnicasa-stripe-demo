type Props = {
    children: React.ReactNode
    containerClassName?: string
    hasContainer?: boolean
    tag?: keyof JSX.IntrinsicElements
} & React.HTMLAttributes<HTMLOrSVGElement>

const UiWrapper = ({ tag: Wrapper = 'section', children, hasContainer = true, containerClassName, ...rest }: Props) => {
    const wrapperClass = `bg-slate-50 min-h-screen w-full p-8${rest.className ? ` ${rest.className}` : ''}`
    const newRest = { ...rest, className: wrapperClass }

    const renderContainer = () => {
        if (hasContainer) {
            return (
                <div className={`container mx-auto${containerClassName ? ` ${containerClassName}` : ''}`}>
                    {children}
                </div>
            )
        }

        return children
    }
    return (
        <Wrapper {...newRest}>
            {renderContainer()}
        </Wrapper>
    )
}

export { UiWrapper }