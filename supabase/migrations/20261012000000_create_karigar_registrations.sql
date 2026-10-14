-- Karigar Vijay Sammelan 2026 registrations.
-- Apply only to the approved Supabase project. Service-role API writes; no public policies.

CREATE TABLE IF NOT EXISTS public.karigar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_no text NOT NULL UNIQUE,
  idempotency_key uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  mobile text NOT NULL,
  mobile_normalized text NOT NULL,
  address_locality text NOT NULL,
  address_post_office text,
  address_police_station text,
  address_district text NOT NULL,
  address_pin text,
  work_categories text[] NOT NULL,
  work_description text,
  team_name text,
  team_unknown boolean NOT NULL DEFAULT false,
  sardar_name text,
  sardar_unknown boolean NOT NULL DEFAULT false,
  sardar_mobile text,
  sardar_mobile_normalized text,
  attendance_status text NOT NULL,
  photo_storage_path text,
  photo_follow_up boolean NOT NULL DEFAULT false,
  data_use_consent_at timestamptz NOT NULL,
  consent_version text NOT NULL,
  photo_publicity_consent boolean NOT NULL DEFAULT false,
  photo_publicity_consent_at timestamptz,
  status text NOT NULL DEFAULT 'pending_verification',
  verification_note text,
  possible_duplicate boolean NOT NULL DEFAULT false,
  assisted boolean NOT NULL DEFAULT false,
  assisted_by text,
  locale text,
  submitter_ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT karigar_work_categories_allowed CHECK (
    cardinality(work_categories) >= 1
    AND work_categories <@ ARRAY[
      'structure_bamboo',
      'fabrication',
      'decoration_draping',
      'painting_finishing',
      'lighting_installation',
      'other_pandal_work'
    ]::text[]
  ),
  CONSTRAINT karigar_attendance_check CHECK (
    attendance_status IN ('yes', 'unsure', 'no', 'attended', 'absent')
  ),
  CONSTRAINT karigar_status_check CHECK (
    status IN (
      'pending_verification',
      'needs_correction',
      'verified',
      'confirmed',
      'waitlisted',
      'cancelled'
    )
  ),
  CONSTRAINT karigar_photo_or_followup CHECK (
    photo_storage_path IS NOT NULL OR photo_follow_up = true
  )
);

CREATE INDEX IF NOT EXISTS karigar_registrations_mobile_idx
  ON public.karigar_registrations (mobile_normalized);

CREATE INDEX IF NOT EXISTS karigar_registrations_created_idx
  ON public.karigar_registrations (created_at DESC);

CREATE INDEX IF NOT EXISTS karigar_registrations_status_idx
  ON public.karigar_registrations (status);

CREATE TABLE IF NOT EXISTS public.karigar_registration_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.karigar_registrations (id),
  actor_role text NOT NULL,
  action text NOT NULL,
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.karigar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karigar_registration_audit ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.karigar_registrations FROM anon, authenticated;
REVOKE ALL ON public.karigar_registration_audit FROM anon, authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'karigar-photos',
  'karigar-photos',
  false,
  2621440,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.karigar_registrations IS
  'Private Karigar Vijay Sammelan 2026 registrations. Not a public gallery.';
