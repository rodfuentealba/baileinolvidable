
INSERT INTO storage.buckets (id, name, public) VALUES ('destination-images', 'destination-images', true);

CREATE POLICY "Admins can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'destination-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view destination images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination-images');

CREATE POLICY "Admins can delete destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update destination images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'destination-images' AND
  public.has_role(auth.uid(), 'admin')
);
