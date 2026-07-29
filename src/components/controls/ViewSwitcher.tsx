interface ViewSwitcherOption {
  key: string
  label: string
}

interface ViewSwitcherProps {
  options: ViewSwitcherOption[]
  activeKey: string
  onSelect: (key: string) => void
  ariaLabel?: string
  variant?: 'pill' | 'underline'
}

export function ViewSwitcher({
  options,
  activeKey,
  onSelect,
  ariaLabel = 'View selector',
  variant = 'pill',
}: ViewSwitcherProps) {
  const navClassName = variant === 'underline' 
    ? 'bydash-mfe__story-tabs' 
    : 'bydash-mfe__view-switcher'
  
  const tabClassName = variant === 'underline' 
    ? 'bydash-mfe__story-tab'
    : 'bydash-mfe__view-tab'
  
  const activeClassName = variant === 'underline'
    ? 'bydash-mfe__story-tab--active'
    : 'is-active'
  
  return (
    <nav className={navClassName} aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`${tabClassName} ${
            option.key === activeKey ? activeClassName : ''
          }`}
          onClick={() => onSelect(option.key)}
        >
          {option.label}
        </button>
      ))}
    </nav>
  )
}
