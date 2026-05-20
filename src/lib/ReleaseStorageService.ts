export interface StoreRelease {
  id: string;
  version: string;
  title: string;
  summary: string;
  content: string; // rich text content
  author: string;
  audience?: 'All Users' | 'Internal' | 'Partners' | 'External';
  publishedDate: string; // YYYY-MM-DD
  status: 'Published' | 'Draft' | 'Scheduled';
  heroStyle: string; // 'preset' | 'custom'
  heroColor: string;
  heroImage: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'releasehub_releases';

const DEFAULT_SEED_DATA: StoreRelease[] = [
  {
    id: '1',
    version: '2026.05.15',
    title: 'WYSIWYG Editor Improvements',
    summary: 'A newly overhauled rich-text editor experience featuring faster initialization, streamlined bullet handling, and seamless layout transitions.',
    content: `<h3>A Major Overhaul for Developers & Technical Writers</h3>
<p>We are thrilled to launch our new rich-text editor engine. Written from the ground up to integrate natively with standard content grids, it eliminates common input lags and provides clean, compliant semantic HTML markup.</p>
<ul>
  <li>🎯 <strong>Upgraded Rendering Engine</strong>: Offers instant feedback loops and eliminates micro-stutters during typing.</li>
  <li>⚡ <strong>Auto-Saves Progress</strong>: Guarantees draft persistence in temporary caches to prevent content loss.</li>
  <li>🔒 <strong>Safety Validation Filters</strong>: Automatically strips potentially malicious script blocks before indexing.</li>
</ul>
<p>Explore this editor today under the Release Note administration portal!</p>`,
    author: 'Sarah Jenkins',
    audience: 'All Users',
    publishedDate: '2026-05-15',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#006578',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-15T08:00:00Z',
    updatedAt: '2026-05-15T09:30:00Z'
  },
  {
    id: '2',
    version: '2026.05.14',
    title: 'Print to PDF Support',
    summary: 'Export beautiful, print-ready document layouts with a brand new rendering backend suited for offscreen reports.',
    content: `<h3>Export Masterclass Documentation</h3>
<p>Ensure that partners and offline clients receive pristine, professional documents. Our new <em>Print to PDF</em> backend supports custom landscape views, CSS page breaks, and embedded imagery.</p>
<ul>
  <li>📄 <strong>Optimized Page Boundaries</strong>: Automated margins handle table spacing elegantly.</li>
  <li>🎨 <strong>Pruned Assets Size</strong>: High-resolution images are intelligently compressed to save storage size.</li>
  <li>🔍 <strong>Clickable Outlines</strong>: Generated PDF embeds document outline structures into index trees automatically.</li>
</ul>`,
    author: 'Alex Rivera',
    audience: 'Partners',
    publishedDate: '2026-05-14',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#0b1c30',
    heroImage: 'https://images.unsplash.com/photo-1618005198143-e5283464303b?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-14T10:15:00Z',
    updatedAt: '2026-05-14T11:00:00Z'
  },
  {
    id: '3',
    version: '2026.05.13',
    title: 'Dashboard Performance Optimization',
    summary: 'Supercharge screen responsiveness and reduce load latencies by over 40% with Brotli compression and intelligent cache prefetching.',
    content: `<h3>Speeding up Enterprise Views</h3>
<p>We optimized backend query paths and set up static cache hydration to improve dashboard paints. Users can expect near-instantaneous page routing even under heavy concurrent workloads.</p>
<ul>
  <li>⚡ <strong>Response Compaction</strong>: Enabled Gzip & Brotli compression protocols by default.</li>
  <li>🌀 <strong>Incremental Caching</strong>: Serves precompiled modules from global CDNs.</li>
  <li>🔌 <strong>Enhanced WS Handshake</strong>: Improved websocket routing of high-volume feeds.</li>
</ul>`,
    author: 'Marcus Chen',
    audience: 'Internal',
    publishedDate: '2026-05-13',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#1b4d3e',
    heroImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-13T09:00:00Z',
    updatedAt: '2026-05-13T10:45:00Z'
  },
  {
    id: '4',
    version: '2026.05.12',
    title: 'Notification Center Enhancements',
    summary: 'Keep teams aligned with customizable real-time event alerts, granular subscription toggles, and persistent logs.',
    content: `<h3>Stay Connected Effortlessly</h3>
<p>The centralized notification panel makes it simple to track software changes, user comments, and direct integrations without cluttering your main active workspace.</p>
<ul>
  <li>🔔 <strong>Targeted Badging</strong>: High-priority statuses display warning icons instantly.</li>
  <li>🎛️ <strong>Granular Controls</strong>: Toggle distinct feed streams individually to filter secondary noise.</li>
  <li>📜 <strong>Rolling Logs</strong>: Access archived system notifications history up to 30 days.</li>
</ul>`,
    author: 'Elena Rostova',
    audience: 'External',
    publishedDate: '2026-05-12',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#7b1fa2',
    heroImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-12T14:30:00Z',
    updatedAt: '2026-05-12T15:00:00Z'
  },
  {
    id: '5',
    version: '2026.05.11',
    title: 'Release Notes Sharing',
    summary: 'Instantly share formatted release bulletins across corporate Slack channels, custom help desks, or external clients.',
    content: `<h3>Publishing with Single Clicks</h3>
<p>Sharing is caring! You can now syndicate individual bulletins onto third-party systems using public tokenized sharing links.</p>
<ul>
  <li>🔗 <strong>Tokenized Hyperlinks</strong>: Create temporary, secured URLs for external verification boards.</li>
  <li>💬 <strong>Slack & Teams Ingress</strong>: Integrates with incoming corporate webhook streams.</li>
  <li>📧 <strong>Newsletter Dispatch</strong>: Supports rich text formatting in email clients.</li>
</ul>`,
    author: 'Danielle Carter',
    audience: 'All Users',
    publishedDate: '2026-05-11',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#8a4d00',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-11T11:00:00Z',
    updatedAt: '2026-05-11T11:30:00Z'
  },
  {
    id: '6',
    version: '2026.05.10',
    title: 'Authentication Improvements',
    summary: 'Tighter, faster session validation, multi-factor login patterns, and enterprise active-directory capabilities.',
    content: `<h3>Fortifying Security Gateways</h3>
<p>We prioritized security hardening. Authors and administrators are prompted with clean login check points while backend JWT tokens are signed through robust hardware security modules.</p>
<ul>
  <li>🔒 <strong>SAML 2.0 / AD Support</strong>: Authenticate with company active directories natively.</li>
  <li>⏱️ <strong>Dynamic Expiry</strong>: Active sessions are monitored for idle states to avoid security leaks.</li>
  <li>🔑 <strong>Hardware Keys</strong>: Fully supports physical FIDO2 authentication keys.</li>
</ul>`,
    author: 'Sarah Jenkins',
    audience: 'Internal',
    publishedDate: '2026-05-10',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#ba1a1a',
    heroImage: 'https://images.unsplash.com/photo-1618005198143-e5283464303b?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-10T10:15:00Z'
  },
  {
    id: '7',
    version: '2026.05.09',
    title: 'Search Experience Upgrade',
    summary: 'Locate technical specs, metadata details, and user-facing change categories with full-text indexing and instant autocomplete.',
    content: `<h3>Find Anything Under Milliseconds</h3>
<p>We integrated client-side indexing and search matches to power our local help center databases and release grids.</p>
<ul>
  <li>🔍 <strong>Fuzzy Text Matching</strong>: Tolerates minor spelling errors to find documentation fast.</li>
  <li>🧠 <strong>AI Auto-Tags</strong>: Automatically recommends search phrases based on recent edits.</li>
  <li>🏷️ <strong>Category Filtering</strong>: Pivot through tags, versions, authors, or status options natively.</li>
</ul>`,
    author: 'Alex Rivera',
    audience: 'Partners',
    publishedDate: '2026-05-09',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#006578',
    heroImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-09T08:00:00Z',
    updatedAt: '2026-05-09T08:45:00Z'
  },
  {
    id: '8',
    version: '2026.05.08',
    title: 'Accessibility Improvements',
    summary: 'Guaranteed WCAG 2.1 AA compliance across all components, focus ring highlights, and complete screen reader compatibility.',
    content: `<h3>An Inclusive Workflow Platform</h3>
<p>We audited our entire viewport to achieve top-tier accessibility benchmarks. Custom tools and public release feeds are now completely navigable by keyboard.</p>
<ul>
  <li>♿ <strong>WCAG 2.1 Compliance</strong>: Satisfies rigorous contrast and typography sizing constraints.</li>
  <li>🗣️ <strong>Full Screen-Reader Support</strong>: Built ARIA attributes directly into panels and rows.</li>
  <li>🎹 <strong>Keyboard Traps Eliminated</strong>: Seamlessly navigate form dialogs and lists using keyboard indicators.</li>
</ul>`,
    author: 'Marcus Chen',
    audience: 'All Users',
    publishedDate: '2026-05-08',
    status: 'Published',
    heroStyle: 'preset',
    heroColor: '#0b1c30',
    heroImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-05-08T15:00:00Z',
    updatedAt: '2026-05-08T15:45:00Z'
  }
];

export const ReleaseStorageService = {
  getAll: (): StoreRelease[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Automatically seed sample data if empty
        ReleaseStorageService.saveAll(DEFAULT_SEED_DATA);
        return DEFAULT_SEED_DATA;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load releases from localStorage:', e);
      return DEFAULT_SEED_DATA;
    }
  },

  saveAll: (releases: StoreRelease[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(releases));
    } catch (e) {
      console.error('Failed to save releases to localStorage:', e);
    }
  },

  getById: (id: string): StoreRelease | null => {
    const list = ReleaseStorageService.getAll();
    return list.find((rel) => rel.id === id) || null;
  },

  create: (release: Omit<StoreRelease, 'id' | 'createdAt' | 'updatedAt'>): StoreRelease => {
    const list = ReleaseStorageService.getAll();
    // Generate new unique ID
    const newId = (Math.max(0, ...list.map((r) => parseInt(r.id) || 0)) + 1).toString();
    const nowStr = new Date().toISOString();
    const newRelease: StoreRelease = {
      ...release,
      id: newId,
      createdAt: nowStr,
      updatedAt: nowStr,
    };
    list.unshift(newRelease); // Keep recent ones at the top or according to chronological sorting
    ReleaseStorageService.saveAll(list);
    return newRelease;
  },

  update: (id: string, updatedFields: Partial<Omit<StoreRelease, 'id' | 'createdAt'>>): StoreRelease | null => {
    const list = ReleaseStorageService.getAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const updatedRelease: StoreRelease = {
      ...list[idx],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updatedRelease;
    ReleaseStorageService.saveAll(list);
    return updatedRelease;
  },

  delete: (id: string): boolean => {
    const list = ReleaseStorageService.getAll();
    const filtered = list.filter((r) => r.id !== id);
    if (filtered.length === list.length) return false;
    ReleaseStorageService.saveAll(filtered);
    return true;
  },

  resetToDefault: (): StoreRelease[] => {
    ReleaseStorageService.saveAll(DEFAULT_SEED_DATA);
    return DEFAULT_SEED_DATA;
  }
};
