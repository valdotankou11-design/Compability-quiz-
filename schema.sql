-- ============================================================================
-- Schéma complet à exécuter dans Supabase → SQL Editor, sur le NOUVEAU projet
-- dédié à ce site. À exécuter en une seule fois, dans l'ordre.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Table des profils (1 ligne par utilisateur inscrit, en plus de auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Statut de compte : séparé de "profiles" exprès, pour que SEUL le serveur
-- (clé service_role, via /api/admin-*.js) puisse écrire dedans. Aucune
-- politique d'écriture n'est donnée aux utilisateurs normaux.
-- ---------------------------------------------------------------------------
create table public.account_status (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  is_banned boolean not null default false,
  pro_until timestamptz
);

-- ---------------------------------------------------------------------------
-- Un quiz par utilisateur
-- ---------------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  title text not null default 'Mon quiz de compatibilité',
  created_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  text text not null,
  options jsonb not null,
  correct_index int not null,
  position int not null default 0
);

-- Réponses "de base" (toujours visibles gratuitement par le propriétaire) :
-- volontairement SANS le détail des réponses.
create table public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  respondent_name text not null,
  score int not null,
  created_at timestamptz not null default now()
);

-- Détail des réponses, dans une table séparée : c'est cette séparation qui
-- permet de réserver le détail aux comptes Pro via une politique RLS dédiée,
-- sans jamais avoir besoin d'un appel serveur pour le lire.
create table public.quiz_response_answers (
  response_id uuid primary key references public.quiz_responses(id) on delete cascade,
  answers jsonb not null
);

-- ---------------------------------------------------------------------------
-- Trigger : à l'inscription (auth.users), crée automatiquement la ligne
-- "profiles" (avec le username fourni au signup) et la ligne "account_status"
-- par défaut (non banni, pas encore Pro).
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));

  insert into public.account_status (user_id, is_banned, pro_until)
  values (new.id, false, null);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.account_status enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_responses enable row level security;
alter table public.quiz_response_answers enable row level security;

-- profiles : chacun voit/édite uniquement son propre profil.
create policy "select own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- account_status : lecture de son propre statut uniquement.
-- Aucune politique d'écriture : seule la clé service_role (donc les
-- fonctions /api/admin-*.js) peut modifier is_banned / pro_until.
create policy "select own status" on public.account_status
  for select using (auth.uid() = user_id);

-- quizzes : lisibles par tout le monde (nécessaire pour que la page publique
-- du quiz fonctionne sans connexion), modifiables uniquement par leur
-- propriétaire.
create policy "quizzes are publicly readable" on public.quizzes
  for select using (true);
create policy "owner can insert own quiz" on public.quizzes
  for insert with check (auth.uid() = owner_id);
create policy "owner can update own quiz" on public.quizzes
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner can delete own quiz" on public.quizzes
  for delete using (auth.uid() = owner_id);

-- quiz_questions : lisibles par tout le monde, gérées uniquement par le
-- propriétaire du quiz auquel elles appartiennent.
create policy "questions are publicly readable" on public.quiz_questions
  for select using (true);
create policy "owner can manage own questions" on public.quiz_questions
  for all using (
    exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and q.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and q.owner_id = auth.uid())
  );

-- quiz_responses : n'importe qui peut en créer une (un visiteur anonyme qui
-- répond au quiz) ; seul le propriétaire du quiz peut les lire (score, nom,
-- date — jamais les réponses détaillées, qui sont dans une autre table) et
-- les supprimer (suppression manuelle, ou nettoyage automatique après la
-- période de rétention gratuite/Pro).
create policy "anyone can submit a response" on public.quiz_responses
  for insert with check (true);
create policy "owner can read own quiz responses" on public.quiz_responses
  for select using (
    exists (select 1 from public.quizzes q where q.id = quiz_responses.quiz_id and q.owner_id = auth.uid())
  );
create policy "owner can delete own quiz responses" on public.quiz_responses
  for delete using (
    exists (select 1 from public.quizzes q where q.id = quiz_responses.quiz_id and q.owner_id = auth.uid())
  );

-- quiz_response_answers : n'importe qui peut soumettre le détail de ses
-- réponses ; seul le propriétaire ET SEULEMENT s'il est actuellement Pro
-- peut les lire. C'est cette politique qui applique réellement le
-- paywall, au niveau de la base de données.
create policy "anyone can submit answer detail" on public.quiz_response_answers
  for insert with check (true);
create policy "pro owner can read answer detail" on public.quiz_response_answers
  for select using (
    exists (
      select 1
      from public.quiz_responses r
      join public.quizzes q on q.id = r.quiz_id
      join public.account_status s on s.user_id = q.owner_id
      where r.id = quiz_response_answers.response_id
        and q.owner_id = auth.uid()
        and s.pro_until is not null
        and s.pro_until > now()
    )
  );
