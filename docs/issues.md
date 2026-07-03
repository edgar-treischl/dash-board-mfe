 🔴 Critical Issues

   1. Type Definition Duplication (SexPage.tsx, MigrationPage.tsx)
   - SexDatum and MigrationDatum should be exported from retention.ts, not defined locally
   2. Data Processing Duplication (retention.ts)
   - getSexData() and getMigrationData() have ~99% identical code—same filtering & mapping logic repeated
   3. Component Structure Duplication (SexPage.tsx vs MigrationPage.tsx)
   - Nearly identical component structure (~100+ lines) — candidate for extraction into reusable component

  🟠 Major Issues

   4. Inline Color Schemes & Legends (SexPage, MigrationPage)
   - Color definitions defined inline rather than centralized
   5. Hard-coded Styling Objects
   - Repeated inline style objects like { listStyle: 'disc', paddingLeft: '1.5rem', margin: 0 } across multiple components
   6. Inline Interpretation Content
   - Large JSX blocks with hardcoded German text in every component—should be externalized for i18n

  🟡 Minor Issues

   7. Complex Logic in RetentionPage (lines 43-49)
   - generateFindings() has complex calculation logic that should be extracted
   8. Year Calculation Logic (retention.ts lines 265-276)
   - Year formatting with .padStart() is error-prone
   9. Fragile Stats Calculation
   - buildBarChartStats() assumes non-empty data and first element validity
   10. Validation Pattern Duplication
   - Same null/undefined checks repeated in data transformers

  ✅ Good Practices Already in Place

   - ✅ No ESLint errors
   - ✅ TypeScript strict mode
   - ✅ Builds without issues  
   - ✅ Good use of memoization
   - ✅ Centralized data layer

  📊 Refactoring Priority

  Quick Wins (Tier 1):

   - Export SexDatum/MigrationDatum from retention.ts
   - Create shared data transformation function

  Medium Effort (Tier 2):

   - Extract DimensionalDataView component to replace SexPage/MigrationPage duplication
   - Centralize color schemes and styling constants

  Design Decisions (Tier 3):

   - Consider i18n for interpretation content
   - Add error boundaries
