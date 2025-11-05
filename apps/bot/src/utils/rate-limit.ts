/**
 * Get the maximum rate of a request
 * @param remaining - The remaining requests
 * @param resetAfter - The time until the rate limit resets (in seconds)
 * @returns The maximum rate of the request (in seconds)
 */
export const getMaxRate = (remaining: number, resetAfter: number) => {
  return remaining / resetAfter;
};
