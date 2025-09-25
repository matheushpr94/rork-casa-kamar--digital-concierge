export type ManualItem = {
  id: string;
  title: string;
  content: string;      // markdown or plain text
  category?: string | null;
  tags?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ManualListParams = {
  search?: string;
  onlyActive?: boolean; // default true
  limit?: number;       // default 20
};

export interface ManualPort {
  list(params?: ManualListParams): Promise<ManualItem[]>;
  getById(id: string): Promise<ManualItem | null>;
  create(input: Omit<ManualItem,'id'|'createdAt'|'updatedAt'>): Promise<string>;
  update(id: string, patch: Partial<Omit<ManualItem,'id'|'createdAt'|'updatedAt'>>): Promise<void>;
}