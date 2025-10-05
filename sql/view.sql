create table public.views (
  id uuid primary key default extensions.uuid_generate_v4 (),
  template_id uuid not null references public.templates (id) on delete cascade,
  viewer_id uuid null references auth.users (id) on delete set null,
  viewed_at timestamp default now()
);


-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.card (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  user_id uuid NOT NULL,
  pic text,
  is_public boolean NOT NULL DEFAULT false,
  bg_image text,
  CONSTRAINT card_pkey PRIMARY KEY (id),
  CONSTRAINT card_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  username text NOT NULL UNIQUE,
  pic text DEFAULT 'https://png.pngtree.com/element_our/20190528/ourmid/pngtree-purple-game-icon-design-image_1168962.jpg'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.template_code_blocks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid,
  description text,
  code text NOT NULL,
  corrected_code text,
  language text,
  is_generated boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT template_code_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT template_code_blocks_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)
);
CREATE TABLE public.template_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid,
  user_id uuid,
  comment text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT template_comments_pkey PRIMARY KEY (id),
  CONSTRAINT template_comments_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id),
  CONSTRAINT template_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.template_saves (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid,
  user_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT template_saves_pkey PRIMARY KEY (id),
  CONSTRAINT template_saves_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id),
  CONSTRAINT template_saves_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  cover_image text NOT NULL,
  title text NOT NULL,
  subtitle text,
  visibility text NOT NULL DEFAULT 'private'::text CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text])),
  created_at timestamp without time zone DEFAULT now(),
  like_count integer NOT NULL DEFAULT 0,
  CONSTRAINT templates_pkey PRIMARY KEY (id),
  CONSTRAINT templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.url_store (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  url text,
  tags text,
  CONSTRAINT url_store_pkey PRIMARY KEY (id),
  CONSTRAINT url_store_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.card(id)
);
CREATE TABLE public.views (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid NOT NULL,
  viewer_id uuid,
  viewed_at timestamp without time zone DEFAULT now(),
  CONSTRAINT views_pkey PRIMARY KEY (id),
  CONSTRAINT views_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id),
  CONSTRAINT views_viewer_id_fkey FOREIGN KEY (viewer_id) REFERENCES auth.users(id)
);