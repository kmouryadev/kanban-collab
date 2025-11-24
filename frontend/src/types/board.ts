export interface Board {
  _id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Boards {
  boards: Board[]
}