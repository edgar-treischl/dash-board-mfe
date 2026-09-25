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
  navigate: () => void;
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
        navigate: () => {
          window.location.href = new URL('app/bydash', document.baseURI).href;
        },
        icon: 'chart-line',
      },
      {
        id: 'bydash-analytics',
        title: 'ByDash Analytics',
        description: 'Detailed analytics and data insights for Bavaria state operations',
        category: 'feature' as const,
        keywords: ['analytics', 'data', 'insights', 'reports', 'bydash'],
        navigate: () => {
          window.location.href = new URL('app/bydash', document.baseURI).href;
        },
        icon: 'bar-chart',
      },
      {
        id: 'bydash-settings',
        title: 'ByDash Settings',
        description: 'Configuration and preferences for ByDash dashboard: StMUK',
        category: 'feature' as const,
        keywords: ['settings', 'configuration', 'preferences', 'bydash'],
        navigate: () => {
          window.location.href = new URL('app/bydash', document.baseURI).href;
        },
        icon: 'sliders',
      },
    ];
  },
};
