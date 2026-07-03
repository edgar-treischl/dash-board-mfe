# Controls Component Library

Self-contained UI control components designed for extraction and reuse across projects. Each component includes its own styles and dependencies.

## Components

### YearSelect

A dropdown selector for choosing a school year. Fully self-contained with integrated styles and icon.

#### Features
- Accessible dropdown with ARIA support
- Customizable label
- Optional disabled state
- Responsive design with focus states
- Uses CSS custom properties for theming

#### Usage

```tsx
import { YearSelect } from './components/controls'

function MyComponent() {
  const [year, setYear] = useState<SchoolYear>('2023/24')
  
  return (
    <YearSelect 
      selectedYear={year}
      onYearChange={setYear}
      label="Select academic year:"
      disabled={false}
    />
  )
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedYear` | `SchoolYear` | required | Currently selected year value |
| `onYearChange` | `(year: SchoolYear) => void` | required | Callback fired when selection changes |
| `label` | `string` | `"Wählen Sie ein Schuljahr:"` | Display label for the control |
| `disabled` | `boolean` | `false` | Whether the select is disabled |

#### Styling with CSS Variables

The component uses CSS custom properties for theming. Define these in your app's CSS:

```css
:root {
  /* Text color for labels */
  --class-retention-heading: #333;
  
  /* Accent color for focus states */
  --class-retention-accent: #008dc9;
  
  /* Border color for form elements */
  --class-retention-border: #e5e7eb;
  
  /* Background color for form elements */
  --class-retention-bg: #f9fafb;
  
  /* Secondary text color */
  --class-retention-text: #666;
}
```

All variables include fallback defaults, so the component works without custom theme variables.

## File Structure

```
controls/
├── index.ts                 # Main export file
├── YearSelect.tsx           # Component implementation
├── YearSelect.css           # Component styles
├── SelectIcon.tsx           # Icon subcomponent
├── SelectIcon.css           # Icon styles
└── README.md               # This file
```

## Extracting to a Component Library

### Step 1: Prepare for Export

The components are already structured for library extraction:

```bash
# Verify the controls folder is self-contained
ls -la src/components/controls/
```

### Step 2: Create Library Package

Create a new package for your component library:

```bash
# Create new library package
mkdir packages/component-library
cd packages/component-library
npm init -y
```

### Step 3: Copy Components

Copy the controls folder to your library package:

```bash
cp -r src/components/controls/* packages/component-library/src/
```

### Step 4: Update Package Configuration

**package.json**:

```json
{
  "name": "@your-org/controls",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./YearSelect": "./dist/YearSelect.js",
    "./styles": "./dist/styles.css"
  },
  "files": ["dist"],
  "dependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "peerDependencies": {
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  }
}
```

### Step 5: Build and Publish

```bash
# Build the library
npm run build

# Publish to npm
npm publish
```

### Step 6: Use in Other Projects

Install and use the component library:

```bash
npm install @your-org/controls
```

```tsx
import { YearSelect } from '@your-org/controls'

// Use in your component
<YearSelect 
  selectedYear={year}
  onYearChange={setYear}
/>
```

## Design Principles

1. **Self-Contained**: Each component includes all necessary styles and sub-components
2. **No External Dependencies**: Only requires React
3. **Type-Safe**: Full TypeScript support with exported types
4. **Accessible**: Semantic HTML and ARIA attributes
5. **Themeable**: CSS custom properties for customization
6. **Portable**: Easy to extract and move between projects

## Adding New Controls

To add a new control component:

1. Create `NewControl.tsx` in the controls folder
2. Create corresponding `NewControl.css` with all styles
3. Include any required sub-components (keep them local)
4. Export from `index.ts`
5. Add documentation to this README

Example:

```tsx
// NewControl.tsx
import './NewControl.css'

export function NewControl(props) {
  // Implementation
}
```

```ts
// index.ts
export { NewControl } from './NewControl'
export type { NewControlProps } from './NewControl'
```

## Removing Controls from Main App

Once extracted to a library, you can exclude controls from the main app:

1. Import from the library instead of local path:
   ```tsx
   // Before
   import { YearSelect } from '../components/controls'
   
   // After
   import { YearSelect } from '@your-org/controls'
   ```

2. Remove the `src/components/controls` folder from main app (if needed)

3. Update any build configurations to exclude the controls path

## Dependencies

- **React**: ^19.2.5
- **React DOM**: ^19.2.5 (for host application)

No other runtime dependencies.

## License

Same as parent project
