// app/ui/marketplace/review-form.tsx
'use client';

import { useActionState, useRef, useEffect } from 'react';
import { createProductReview, ReviewState } from '@/app/lib/actions';

export default function ReviewForm({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const initialState: ReviewState = {};
  
  const createReviewWithId = createProductReview.bind(null, productId);
  const [state, formAction] = useActionState(async (prevState: ReviewState, formData: FormData) => {
    return createReviewWithId(prevState, formData);
  }, initialState);

  // Clear form automatically when successful
  useEffect(() => {
    if (state.message === 'Review added successfully!') {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
      <h3 className="font-bold text-gray-900 text-sm">Write a Product Review</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">Your Name</label>
          <input name="userName" type="text" required className="w-full text-sm p-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Rating Stars</label>
          <select name="rating" required className="w-full text-sm p-2 border border-gray-300 rounded-md bg-white">
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700">Review text</label>
        <textarea name="comment" rows={2} required className="w-full text-sm p-2 border border-gray-300 rounded-md" placeholder="Share your experience with this item..." />
      </div>

      {state.message && (
        <p className={`text-xs font-semibold ${state.message.includes('successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
          {state.message}
        </p>
      )}

      <button type="submit" className="bg-gray-900 text-white font-medium text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition">
        Submit Feedback
      </button>
    </form>
  );
}