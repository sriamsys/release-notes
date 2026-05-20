export interface FeatureStatus {
  name: string;
  status: 'STABLE' | 'BETA' | 'ALPHA' | 'DEPRECATED';
}

export interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  date: string;
  readTime: string;
  isNew?: boolean;
  summary: string;
  detailedNotes: string[];
  features: FeatureStatus[];
  category: string;
  author: string;
  isExpanded?: boolean;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
}

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
}
