export interface Book {
  id: string;
  title: string;
  publicationYear: number;
  price?: number;
  averageRating?: number;
  author: {
    id: string;
    name: string;
  };
}
