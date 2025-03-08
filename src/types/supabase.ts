export type Database = {
  public: {
    Tables: {
      seo_approvals: {
        Row: {
          id: string;
          video_id: string;
          editor_id: string;
          submitted_at: string;
          status: "pending" | "approved" | "rejected";
          original_content: {
            title: string;
            description: string;
            keywords: string;
            categories: Array<{ key: string; name: string }>;
          };
          proposed_content: {
            title: string;
            description: string;
            keywords: string;
            categories: Array<{ key: string; name: string }>;
          };
          editor_notes?: string;
          admin_feedback?: string;
          created_at: string;
          updated_at: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "editor" | "translator";
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          status: string;
        };
      };
    };
  };
};
