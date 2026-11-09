type TestSelectorProps = {
  tests: { id: string; label: string }[]
  active: string
  onChange: (testId: string) => void
}

export function TestSelector({ tests, active, onChange }: TestSelectorProps) {
  return (
    <div className="test-selector">
      <div className="test-selector-group">
        {tests.map((test) => (
          <button
            key={test.id}
            className={`test-selector-button ${active === test.id ? 'is-active' : ''}`}
            onClick={() => onChange(test.id)}
            aria-pressed={active === test.id}
          >
            {test.label}
          </button>
        ))}
      </div>
    </div>
  )
}
