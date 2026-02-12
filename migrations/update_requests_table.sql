-- Add status column to requests table
ALTER TABLE requests 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'found', 'unavailable'));

-- Create index for status for faster filtering usually
CREATE INDEX idx_requests_status ON requests(status);
