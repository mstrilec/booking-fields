export const convertRating = (rating: any): number | undefined => {
  if (rating === null || rating === undefined) {
    return undefined;
  }
  const converted =
    typeof rating === 'string' ? parseFloat(rating) : Number(rating);
  return isNaN(converted) ? undefined : converted;
};

export const convertUserRatingTotal = (total: any): number | undefined => {
  if (total === null || total === undefined) {
    return undefined;
  }
  const converted =
    typeof total === 'string' ? parseInt(total, 10) : Number(total);
  return isNaN(converted) ? undefined : converted;
};
