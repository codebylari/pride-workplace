-- Criar políticas RLS para o bucket profile-photos (apenas as que faltam)

-- Permitir que usuários autenticados façam upload de fotos
CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Permitir que usuários autenticados atualizem fotos (upsert)
CREATE POLICY "Authenticated users can update profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos');