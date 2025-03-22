import { useState } from 'react';
import { createReview } from '../services/reviewService';
import { Button, TextField, Rating } from '@mui/material';

interface ReviewFormProps {
  bookId: string;
  onReviewSubmit: () => void;
}

export default function ReviewForm({
  bookId,
  onReviewSubmit,
}: ReviewFormProps): JSX.Element {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = async (): Promise<void> => {
    if (rating) {
      await createReview(bookId, { rating, comment });
      setRating(null);
      setComment('');
      onReviewSubmit();
    } else {
      alert('Please provide a rating');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Add a Review</h3>
      <Rating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        max={5}
      />
      <TextField
        label="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
        className="my-2"
      />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        fullWidth
      >
        Submit Review
      </Button>
    </div>
  );
}
