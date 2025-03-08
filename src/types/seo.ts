export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ApprovalData {
  id: string;
  proposedContent: {
    title: string;
    description: string;
    keywords: string;
    categories: { key: string; name: string }[];
  };
}

export interface FeedbackSubmitEvent {
  videoId: string;
  feedback: string;
}
