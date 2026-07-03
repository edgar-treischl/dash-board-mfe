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
    <div className="class-retention-mfe__story-card class-retention-mfe__story-card--tall">
      <div className="class-retention-mfe__story-header">
        <h3 className="class-retention-mfe__story-heading">{title}</h3>
      </div>
      
      {/* Tab Navigation */}
      <div className="class-retention-mfe__story-tabs">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            className={`class-retention-mfe__story-tab ${activeTab === tab ? 'class-retention-mfe__story-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tabs[tab].label}
          </button>
        ))}
      </div>
      
      <div className="class-retention-mfe__story-content">
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

export const InterpretationBox = memo(InterpretationBoxComponent)
