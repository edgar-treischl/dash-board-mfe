/**
 * SearchProvider for DashBoardApp
 * Exports searchable entries for the dash-board-mfe application
 * To be loaded by the shell via Module Federation
 */

/**
 * Search Entry interface (duplicated here for remote app - future: extract to shared pkg)
 */
interface SearchEntry {
  id: string;
  title: string;
  description?: string;
  category: 'app' | 'feature' | 'report' | 'admin';
  keywords?: string[];
  /**
   * Name of a shell-registered app (matches this app's `appRegistry` entry `name` field,
   * i.e. 'DashBoardApp' — NOT the Module Federation remote key 'bydash') to open when this
   * entry is selected. The shell owns navigation: it opens the app via its own router, so
   * this works regardless of the shell's deployment base path and never triggers a full
   * page reload.
   */
  appName?: string;
  icon?: string;
}

/**
 * Search Provider interface
 */
interface SearchProvider {
  getEntries(context?: { userRoles?: string[] }): SearchEntry[] | Promise<SearchEntry[]>;
}

export const searchProvider: SearchProvider = {
  async getEntries(context?: { userRoles?: string[] }) {
    // Only StMUK and admin can access DashBoardApp
    const userRoles = context?.userRoles || [];
    const hasAccess = userRoles.includes('stmuk') || userRoles.includes('admin');
    
    if (!hasAccess) {
      return [];
    }

    return [
      {
        id: 'bydash-app',
        title: 'ByDash App',
        description: 'ByDash ist eine Demo-App dass ein Steuerungstool für den Freistaat Bayern erprobt.',
        category: 'feature' as const,
        keywords: ['bayern', 'Zahlen'],
        appName: 'DashBoardApp',
        icon: 'chart-line',
      },
      {
        id: 'bydash-bayern',
        title: 'ByDash Bayern',
        description: 'Bayerns Schulen im Überblick',
        category: 'feature' as const,
        keywords: ['bayern', 'Schülerschaft', 'Migrationshintergrund', 'Schüler-Lehrer-Relation', 'Klassengröße', 'Schulen'],
        appName: 'DashBoardApp',
        icon: 'bar-chart',
      },
      {
        id: 'bydash-regierungsbezirke',
        title: 'ByDash Regierungsbezirke',
        description: 'Bayerns Regierungsbezirke im Überblick',
        category: 'feature' as const,
        keywords: ['Regierungsbezirke', 'Migrationshintergrund', 'Schüler-Lehrer-Relation', 'Schulen'],
        appName: 'DashBoardApp',
        icon: 'sliders',
      },
    ];
  },
};
