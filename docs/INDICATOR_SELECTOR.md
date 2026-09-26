# IndicatorSelector Component

A reusable React component for creating a clean, tabbed indicator/metric selector with icons, labels, and formatted values. Built specifically for the Regierungspage but designed for maximum reusability.

## Features

- 🎨 **Clean Underline Style**: Smooth active state indicator with underline accent
- 🎯 **TypeScript Generics**: Fully typed with support for any string-keyed metric type
- ♿ **Accessible**: Semantic button elements with proper event handling
- 🔄 **Reusable**: Generic design works with any data structure
- 📱 **Responsive**: Auto-fit grid columns that adapt to container width
- ✨ **Smooth Transitions**: CSS transitions for color and border changes
- 🎭 **Hover Effects**: Visual feedback for interactivity

## Installation

The component is exported from `/src/components/controls/IndicatorSelector.tsx` and re-exported via `/src/components/controls/index.ts`.

```tsx
import { IndicatorSelector } from '@/components/controls'
// or
import { IndicatorSelector } from '@/components/controls/IndicatorSelector'
```

## Basic Usage

### Simple Example

```tsx
import { IndicatorSelector } from '@/components/controls'
import { SchoolsIcon, PupilsIcon } from '@/utils/icons'

const [selectedMetric, setSelectedMetric] = useState<'schools' | 'students'>('schools')

const indicatorOptions = [
  {
    key: 'schools' as const,
    label: 'Schulen',
    icon: <SchoolsIcon />,
    value: 1500,
  },
  {
    key: 'students' as const,
    label: 'Schüler',
    icon: <PupilsIcon />,
    value: 125000,
  },
]

function MyComponent() {
  return (
    <IndicatorSelector
      options={indicatorOptions}
      selectedKey={selectedMetric}
      onSelect={setSelectedMetric}
      formatValue={(val) => val.toLocaleString()}
    />
  )
}
```

### Advanced Example (from RegierungsPage)

```tsx
type MetricKey = 'schools' | 'students_percent' | 'avgClassSize'

const metricLabels: Record<MetricKey, string> = {
  schools: 'Schulen',
  students_percent: 'Schülerschaft',
  avgClassSize: 'Klassengröße',
}

const metricIcons: Record<MetricKey, React.ReactNode> = {
  schools: <SchoolsIcon className="bydash-mfe__grid-icon" />,
  students_percent: <PupilsIcon className="bydash-mfe__grid-icon" />,
  avgClassSize: <ClassSizeIcon className="bydash-mfe__grid-icon" />,
}

const formatMetricValue = (key: MetricKey, value: number): string => {
  if (key === 'avgClassSize') return value.toFixed(2)
  return value.toLocaleString()
}

export function RegierungsPage() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('schools')

  return (
    <IndicatorSelector<MetricKey>
      options={(Object.keys(metricLabels) as MetricKey[]).map((key) => ({
        key,
        label: metricLabels[key],
        icon: metricIcons[key],
        value: currentRegion[key],
      }))}
      selectedKey={selectedMetric}
      onSelect={setSelectedMetric}
      formatValue={(val) => formatMetricValue(selectedMetric, val as number)}
    />
  )
}
```

## Props

### IndicatorSelectorProps<T extends string = string>

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `IndicatorOption<T>[]` | ✅ | Array of metric options to display |
| `selectedKey` | `T` | ✅ | Currently selected metric key |
| `onSelect` | `(key: T) => void` | ✅ | Callback when a metric is selected |
| `formatValue` | `(value: number \| string) => string` | ❌ | Format function for the metric value display (default: `String(val)`) |
| `gridColumns` | `string` | ❌ | CSS grid-template-columns value (default: `'repeat(auto-fit, minmax(120px, 1fr))'`) |
| `containerPadding` | `string` | ❌ | Container padding (default: `'0 24px'`) |
| `containerMarginBottom` | `string` | ❌ | Container margin-bottom (default: `'24px'`) |
| `className` | `string` | ❌ | Additional CSS class for the container |
| `testId` | `string` | ❌ | data-testid for testing |

### IndicatorOption<T extends string = string>

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `T` | ✅ | Unique identifier for the option |
| `label` | `string` | ✅ | Display label (e.g., "Schulen") |
| `icon` | `React.ReactNode` | ✅ | Icon component/element to display |
| `value` | `number \| string` | ✅ | The value to be formatted and displayed |
| `description` | `string` | ❌ | Optional description (reserved for future use) |

## Styling

The component uses inline styles and CSS variables from your design system. No external CSS is required.

### CSS Variables Used

- `--bydash-border`: Border color for the bottom separator line
- `--bydash-text`: Default text color for unselected options
- `--bydash-heading`: Hover text color for unselected options
- `--bydash-accent`: Active state color for selected option

### Custom Styling

To customize styling, use the `className` prop or override CSS variables:

```css
:root {
  --bydash-border: #e5e7eb;
  --bydash-text: #6b7280;
  --bydash-heading: #1f2937;
  --bydash-accent: #008dc9;
}
```

## TypeScript Generic Support

The component uses TypeScript generics for type safety:

```tsx
// Define your metric type
type MyMetricKey = 'option1' | 'option2' | 'option3'

// Component automatically infers the type
const [selected, setSelected] = useState<MyMetricKey>('option1')

// Usage with explicit type parameter for better type inference
<IndicatorSelector<MyMetricKey>
  options={/* ... */}
  selectedKey={selected}
  onSelect={setSelected}
/>
```

## Behavior

### Active State
- The selected metric shows:
  - Accent-colored text
  - 2px solid underline in accent color
  - Bold label text (600 weight)

### Hover State (Unselected)
- Unselected metrics show on hover:
  - Heading-colored text
  - 0.3 opacity accent underline
  - Smooth color transition

### Grid Layout
- Uses CSS Grid with auto-fit columns
- Default minimum column width: 120px
- Responsive and adapts to container width
- Adjustable via `gridColumns` prop

## Testing

The component provides test hooks via the `testId` prop:

```tsx
<IndicatorSelector
  options={options}
  selectedKey={selected}
  onSelect={setSelected}
  testId="my-selector"
/>
```

Individual buttons can be targeted with `data-testid={`indicator-${key}`}`:

```tsx
// Test example
cy.get('[data-testid="my-selector"]').should('exist')
cy.get('[data-testid="indicator-schools"]').click()
```

## Migration from Inline Component

If you have an existing inline indicator selector component, you can easily migrate to the reusable component:

### Before
```tsx
// Lots of inline JSX and styling
<div style={{ padding: '0 24px', marginBottom: '24px' }}>
  <div style={{ /* many styles */ }}>
    {options.map((key) => (
      <button
        key={key}
        onClick={() => setSelected(key)}
        style={{ /* many inline styles */ }}
      >
        {/* content */}
      </button>
    ))}
  </div>
</div>
```

### After
```tsx
<IndicatorSelector
  options={options}
  selectedKey={selected}
  onSelect={setSelected}
  formatValue={formatFn}
/>
```

## Performance

- Component uses function declaration (not memoized) for maximum generics support
- No unnecessary re-renders due to minimal internal state
- Inline event handlers are optimized with early returns
- Grid layout is efficient and CSS-driven

## Browser Support

- Modern browsers with ES2020+ support
- React 18+
- TypeScript 4.5+

## Related Components

- `ViewSwitcher`: Similar component for view/tab switching
- `RegierungsTabNavigation`: Tab navigation for region selection

## Files Modified

1. Created: `/src/components/controls/IndicatorSelector.tsx` - New reusable component
2. Updated: `/src/components/controls/index.ts` - Added exports
3. Updated: `/src/components/RegierungsPage.tsx` - Migrated to use new component

## Future Enhancements

- Add support for sub-labels/descriptions
- Add animation variants (slide, fade, etc.)
- Add size variants (small, medium, large)
- Add orientation variants (horizontal, vertical)
- Add multi-select variant
