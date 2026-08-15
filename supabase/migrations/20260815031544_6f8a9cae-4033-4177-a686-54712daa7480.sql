DELETE FROM public.partner_leads WHERE email IN ('test.partner@example.com','partner@example.com');
DELETE FROM public.newsletter_subscribers WHERE email = 'news@example.com';
DELETE FROM public.email_outbox;