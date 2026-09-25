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
        id: 'bydash-dashboard',
        title: 'ByDash Dashboard',
        description: 'Bayern State Control Dashboard - Main overview and KPIs',
        category: 'feature' as const,
        keywords: ['dashboard', 'bydash', 'Schülerschaft', 'Migrationshintergrund', 'Schüler-Lehrer-Relation'],
        appName: 'DashBoardApp',
        icon: 'chart-line',
      },
      {
        id: 'bydash-analytics',
        title: 'ByDash Analytics',
        description: 'Detailed analytics and data insights for Bavaria state operations',
        category: 'feature' as const,
        keywords: ['analytics', 'data', 'insights', 'reports', 'bydash'],
        appName: 'DashBoardApp',
        icon: 'bar-chart',
      },
      {
        id: 'bydash-settings',
        title: 'ByDash Settings',
        description: 'Configuration and preferences for ByDash dashboard: StMUK',
        category: 'feature' as const,
        keywords: ['settings', 'configuration', 'preferences', 'bydash'],
        appName: 'DashBoardApp',
        icon: 'sliders',
      },
    ];
  },
};
