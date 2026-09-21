import { memo } from 'react'

type TabType = 'regierungsbezirke' | 'mittelfranken'

interface RegierungsTabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

function RegierungsTabNavigationComponent({ activeTab, onTabChange }: RegierungsTabNavigationProps) {
  const tabs: Array<{ key: TabType; label: string }> = [
    { key: 'regierungsbezirke', label: 'Regierungsbezirke' },
    { key: 'mittelfranken', label: 'Schulämter in Mittelfranken' },
  ]

  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      borderBottom: '2px solid var(--bydash-border)',
      padding: '0 24px',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          style={{
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === tab.key ? '3px solid var(--bydash-primary)' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === tab.key ? '600' : '500',
            fontSize: '0.95rem',
            color: activeTab === tab.key ? 'var(--bydash-primary)' : 'var(--bydash-text)',
            transition: 'all 0.2s ease',
            marginBottom: '-2px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export const RegierungsTabNavigation = memo(RegierungsTabNavigationComponent)
