export interface List {
  _id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListDTO {
  title: string;
}

export interface UpdateListDTO {
  title?: string;
}

