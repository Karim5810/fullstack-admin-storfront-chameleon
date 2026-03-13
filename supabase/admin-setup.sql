-- Replace the email below with an existing auth user email after the user registers.
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
