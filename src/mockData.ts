import { ReleaseNote, HelpCategory } from './types';

export const mockReleases: ReleaseNote[] = [
  {
    id: '1',
    version: '2026.05.15',
    title: 'WYSIWYG Editor Improvements',
    date: 'May 15, 2026',
    readTime: '2 min read',
    isNew: true,
    summary: 'This update introduces our brand-new WYSIWYG editor, providing a more intuitive and powerful way to create content within the platform.',
    category: 'Editor',
    author: 'Sarah Jenkins',
    detailedNotes: [
      'Fast and lightweight interface optimized for high-volume content entry.',
      'Semantic markup generation to ensure SEO and accessibility compliance.',
      'Standardized HTML output that maintains visual consistency across all browsers.'
    ],
    features: [
      { name: 'Rich Text Engine', status: 'STABLE' },
      { name: 'Image Hotlinking', status: 'STABLE' },
      { name: 'Markdown Support', status: 'BETA' }
    ]
  },
  {
    id: '2',
    version: '2026.05.14',
    title: 'Print to PDF Feature',
    date: 'May 14, 2026',
    readTime: '1 min read',
    summary: 'Generate pristine PDF exports of project schemas, Release Notes lists, and API structures for offline validation and client delivery.',
    category: 'Reporting',
    author: 'Alex Rivera',
    detailedNotes: [
      'High-fidelity PDF engine rendering perfectly on any typical system configuration.',
      'Added responsive options to customize margins, orientation, and landscape page breaks.',
      'Integrated automatic visual compression to yield lightweight, shareable files.'
    ],
    features: [
      { name: 'PDF Rendering Engine', status: 'STABLE' },
      { name: 'Multi-page Break Handler', status: 'BETA' },
      { name: 'Offscreen Table Formatter', status: 'ALPHA' }
    ]
  },
  {
    id: '3',
    version: '2026.05.13',
    title: 'Release Notes for May 13th 2026',
    date: 'May 13, 2026',
    readTime: '1 min read',
    summary: 'Performance tuning across our real-time synchronization pipelines, caching layers, and internal API endpoints.',
    category: 'Core Service',
    author: 'Marcus Chen',
    detailedNotes: [
      'Reduced initial Webhook delivery and websocket handshake delays under heavy concurrent loads.',
      'Added Brotli and Gzip response compression to public feeds, speeding up paint times by 40%.',
      'Enhanced security validation parameters across admin action endpoints.'
    ],
    features: [
      { name: 'WebSockets Middleware', status: 'STABLE' },
      { name: 'GZIP Base Compactor', status: 'STABLE' },
      { name: 'Handshake Throttler', status: 'BETA' }
    ]
  },
  {
    id: '4',
    version: '2026.04.28',
    title: 'Role Based Access Control (RBAC)',
    date: 'April 28, 2026',
    readTime: '3 min read',
    summary: 'Enforce strict security guardrails with modular access rules across staging, development, and production channels.',
    category: 'Security',
    author: 'Sarah Jenkins',
    detailedNotes: [
      'Define specialized Creator, Viewer, Contributor, and Administrator permissions seamlessly.',
      'Audit logs for checking critical administrative action records.',
      'Granular read/write keys for external workflow tools.'
    ],
    features: [
      { name: 'Authorization Engine', status: 'STABLE' },
      { name: 'OAuth Role Scopes', status: 'STABLE' },
      { name: 'Audit Log Archiver', status: 'BETA' }
    ]
  },
  {
    id: '5',
    version: '2026.04.12',
    title: 'Custom Branding & Live Settings',
    date: 'April 12, 2026',
    readTime: '2 min read',
    summary: 'Configure logos, status colors, support links, and platform configurations directly from your administrative workspace.',
    category: 'Customization',
    author: 'Danielle Carter',
    detailedNotes: [
      'Allows adding custom persistent portal links inside the top header and footer navigation.',
      'Integrated live template customization workspace preview panel.',
      'Added dark/light adaptive asset managers.'
    ],
    features: [
      { name: 'Themes Provider', status: 'STABLE' },
      { name: 'Logo Asset Manager', status: 'STABLE' }
    ]
  }
];

export const mockHelpCategories: HelpCategory[] = [
  {
    id: 'cat_1',
    title: 'Getting Started',
    description: 'Learn how to configure ReleaseHub and onboard your team members.',
    icon: 'rocket',
    articles: [
      {
        id: 'art_1',
        title: 'ReleaseHub Platform Overview',
        category: 'Getting Started',
        summary: 'Explore core paradigms, roles, and feed layouts on our enterprise application.',
        content: `Welcome to ReleaseHub! ReleaseHub is our enterprise internal and external release communication platform. It connects engineering schedules, legal compliance summaries, and user adoption resources into a single source of truth.

### Dynamic Role Assignment
By default, the workspace assigns a Viewer permissions level. Administrators can promote developers, product leads, and technical writers to Contributors or Authors to write drafts or manage channels directly of multiple projects.

### Standard Structure
A release note page consists of headers, structured lists, and sub-attributes (like Features and Status). Users can search details, expand elements, or jump to recent logs instantaneously.`,
        readTime: '3 min read'
      },
      {
        id: 'art_2',
        title: 'Linking Your First Team Space',
        category: 'Getting Started',
        summary: 'Step-by-step setup to bundle different project templates into standard team screens.',
        content: `Team spaces gather related feeds. To initiate:
        
1. Open **SYSTEM > Configuration** from the left-side navigation rail.
2. Select the **Team Spaces** configuration tab.
3. Click "Create New Space", type an enterprise space title (e.g., 'Finance Systems' or 'myChron Project').
4. Assign default team leads. This updates the sidebar context and custom feeds instantly.`,
        readTime: '2 min read'
      },
      {
        id: 'art_3',
        title: 'Managing User Permissions and Roles',
        category: 'Getting Started',
        summary: 'Enforce security guardrails through standard access tokens and user profile restrictions.',
        content: `ReleaseHub enforces standard access control constraints:

* **Administrator**: Full config access, can modify categories, themes, status pages, and add team members.
* **Author**: Can compile drafts, attach technical metadata, publish notes, and manage FAQs.
* **Viewer**: Read-only access to published feeds and help databases. Useful for cross-functional business stakeholders.`,
        readTime: '4 min read'
      }
    ]
  },
  {
    id: 'cat_2',
    title: 'API & Integrations',
    description: 'Automate release note synthesis and push directly from CD loops.',
    icon: 'code',
    articles: [
      {
        id: 'art_4',
        title: 'Automating Releases via CI/CD Webhooks',
        category: 'API & Integrations',
        summary: 'Trigger draft preparation automatically upon tagging release builds in GitHub or GitLab.',
        content: `Integrate ReleaseHub directly with your software pipelines:

### Webhook Configuration
To register webhooks:
- Issue a POST to \`/hooks/trigger-note\` with header \`X-Hub-Token\`.
- Payload body must pass:
  \`\`\`json
  {
    "version": "2026.06.01",
    "title": "Build Title",
    "summary": "Brief summary",
    "features": [{"name": "Auth Integration", "status": "STABLE"}]
  }
  \`\`\`
- This automatically queues a draft on the release content manager workspace under strict security regulations.`,
        readTime: '4 min read'
      },
      {
        id: 'art_5',
        title: 'Fetching Release Notes Programmatically with API Keys',
        category: 'API & Integrations',
        summary: 'Query published release notes directly to render inside custom portals or main product sidebars.',
        content: `You can access public endpoints to load releases using standard GET parameters:
        
\`\`\`bash
curl -H "Authorization: Bearer <TOKEN>" \\
  "https://api.releasehub.internal/v1/releases?limit=10"
\`\`\`

The query payload responds with high-fidelity JSON arrays detailing dates, features, status badges, and details content.`,
        readTime: '3 min read'
      }
    ]
  },
  {
    id: 'cat_3',
    title: 'Theme Customization',
    description: 'Style your workspace portal for perfect visual synergy with your parent brand.',
    icon: 'palette',
    articles: [
      {
        id: 'art_6',
        title: 'White-labeling your Help Docs Portal',
        category: 'Theme Customization',
        summary: 'Configure company assets, colors, and layout widths seamlessly with simple forms.',
        content: `Tailor layout schemes to match your branding guides:
        
- **Sidebar Backgrounds**: Set from off-whites to dark midnight slate canvases.
- **Top Headers**: Upload transparent high-resolution enterprise logos.
- **Brand Colors**: Configure custom color accents corresponding to your brand palette. Changes sync instantly on client render loops.`,
        readTime: '2 min read'
      }
    ]
  }
];
