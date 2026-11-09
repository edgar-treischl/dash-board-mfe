import { memo, useState } from 'react'
import type { ReactNode } from 'react'

type TabKey = string

type TabConfig = {
  label: string
  content: ReactNode
}

type InterpretationBoxProps = {
  tabs: Record<TabKey, TabConfig>
  defaultTab?: TabKey
  title?: string
}

function InterpretationBoxComponent({
  tabs,
  defaultTab,
  title = 'Interpretation',
}: InterpretationBoxProps) {
  const tabKeys = Object.keys(tabs) as TabKey[]
  const initialTab = defaultTab && tabKeys.includes(defaultTab) ? defaultTab : tabKeys[0]
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab)

  return (
    <div className="bydash-mfe__story-card bydash-mfe__story-card--tall">
      <div className="bydash-mfe__story-header">
        <h3 className="bydash-mfe__story-heading">{title}</h3>
      </div>
      
      {/* Tab Navigation */}
      <div className="bydash-mfe__story-tabs">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            className={`bydash-mfe__story-tab ${activeTab === tab ? 'bydash-mfe__story-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tabs[tab].label}
          </button>
        ))}
      </div>
      
      <div className="bydash-mfe__story-content">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

export const InterpretationBox = memo(InterpretationBoxComponent)
