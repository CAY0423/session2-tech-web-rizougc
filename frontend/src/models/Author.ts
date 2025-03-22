export interface Author {
  id: string;
  name: string;
  bio?: string;

  photo?: string;
  bookCount: number;
  weightedAverageRating?: number;
}
