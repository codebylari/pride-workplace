-- Update ratings table to use decimal values instead of integers
ALTER TABLE public.ratings 
DROP CONSTRAINT IF EXISTS ratings_rating_check;

ALTER TABLE public.ratings 
ALTER COLUMN rating TYPE DECIMAL(2,1);

ALTER TABLE public.ratings
ADD CONSTRAINT ratings_rating_check CHECK (rating >= 0.5 AND rating <= 5.0);