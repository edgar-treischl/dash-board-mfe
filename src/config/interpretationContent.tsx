/**
 * Interpretation content for all data dimensions
 * Externalized for easier maintenance and i18n support
 */

import { type ReactNode } from 'react'
import { COMMON_STYLES } from './chartConfig'

export type InterpretationContent = {
  befund: { label: string; content: ReactNode }
  hinweis: { label: string; content: ReactNode }
}

/**
 * Sex/Gender interpretation content
 */
export const SEX_INTERPRETATION: InterpretationContent = {
  befund: {
    label: 'Befund',
    content: (
      <div>
        <p className="class-retention-mfe__story-text">
          Wie unterscheiden sich Wiederholungsquoten zwischen Jungen und Mädchen? Das Diagramm zeigt die Geschlechterverteilung bei Wiederholungen, aufgeschlüsselt nach Schulart. 
        </p>
        <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
          <li style={COMMON_STYLES.listItem}>
            <strong>Jungen haben durchgehend höhere Wiederholungsquoten</strong> als Mädchen in allen Schultypen im Schuljahr 2024/25.
          </li>
          <li style={COMMON_STYLES.listItem}>
            Am stärksten ist dieser Unterschied in der <strong>IGS</strong> und der <strong>Mittelschule</strong> (über 60 Prozent).
          </li>
        </ul>
      </div>
    ),
  },
  hinweis: {
    label: 'Hinweis',
    content: (
      <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
        Dies deutet darauf hin, dass Jungen bei Leistungsanforderungen in der Regel stärker hinter Erwartungen zurückbleiben. Die Gründe können vielfältig sein: unterschiedliche Lernstile, unterschiedliche Entwicklungstempo oder möglicherweise auch Unterschiede in der Unterrichtsunterstützung. Diese Befunde decken sich auch mit unterschiedlichen Studien die den Bildungserfolg von Jungen in das Zentrum rücken.
      </p>
    ),
  },
}

/**
 * Migration/Citizenship interpretation content
 */
export const MIGRATION_INTERPRETATION: InterpretationContent = {
  befund: {
    label: 'Befund',
    content: (
      <div>
        <p className="class-retention-mfe__story-text">
          Wie unterscheiden sich Wiederholungsquoten zwischen deutschen und nicht-deutschen Schülerinnen und Schülern? Die Abbildung zeigt die Verteilung von Wiederholungen nach ethnischer Herkunft und Schulart.
        </p>
        <ul className="class-retention-mfe__story-text" style={COMMON_STYLES.bulletList}>
          <li style={COMMON_STYLES.listItem}>
            Deutsche Kinder haben <strong>fast durchgehend höhere Wiederholungsquoten</strong> als Kinder mit Migrationshintergrund.
          </li>
          <li style={COMMON_STYLES.listItem}>
            <strong>Ein umgekehrtes Muster existiert in der Grundschule:</strong> Hier haben Kinder mit Migrationshintergrund höhere Wiederholungsquoten, was auf unterschiedliche Ausgangsvoraussetzungen hindeutet.
          </li>
        </ul>
      </div>
    ),
  },
  hinweis: {
    label: 'Hinweis',
    content: (
      <p className="class-retention-mfe__story-text class-retention-mfe__story-text--italic">
        Die unterschiedlichen Wiederholungsquoten zwischen deutschen und nicht-deutschen Schülerinnen und Schülern reflektieren komplexe Wechselwirkungen zwischen Herkunft, Schultyp, Sprachkompetenz und Bildungschancen. Diese Daten unterstreichen die Bedeutung von sprachlicher Unterstützung und kulturell sensiblen Lernumgebungen, besonders in frühen Schuljahren.
      </p>
    ),
  },
}
