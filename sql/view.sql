create table public.views (
  id uuid primary key default extensions.uuid_generate_v4 (),
  template_id uuid not null references public.templates (id) on delete cascade,
  viewer_id uuid null references auth.users (id) on delete set null,
  viewed_at timestamp default now()
);
