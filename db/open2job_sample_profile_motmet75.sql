-- Open2Job sample profile for motmet75@gmail.com.
-- This script is idempotent for this owner: it updates or creates the profile,
-- replaces that profile's memories/collaborators, and publishes a fresh snapshot.

BEGIN;

DO $$
DECLARE
    v_owner text := 'motmet75@gmail.com';
    v_profile_id bigint;
    v_memory_id bigint;
    v_skill_id bigint;
    v_collaborator_id bigint;
    v_memory jsonb;
    v_media jsonb;
    v_person jsonb;
    v_skill text;
    v_order integer := 0;
    v_media_order integer;
    v_person_order integer;
    v_person_name text;
    v_person_key text;
    v_profile jsonb := $profile$
{
  "slug": "motmet75-open2job-sample",
  "name": "Mot Met",
  "role": "Product Operations and Digital Service Builder",
  "location": "Ho Chi Minh City - Remote",
  "headline": "I turn field experience into practical digital services.",
  "intro": "A sample Open2Job presentation showing how one profile can be explored by timeline, achievement, and cooperated people. It includes text, images, YouTube video, and a PDF/document slide.",
  "portraitUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
  "reelUrl": "https://www.youtube.com/watch?v=UAinLaT42xY",
  "availability": "Available for product operations, workflow automation, and service design projects.",
  "nodes": [
    {
      "id": "live-portal-preview",
      "year": 2026,
      "date": "2026-08-23",
      "type": "project",
      "title": "Open2Job presentation preview",
      "org": "Anh Media Portal",
      "summary": "Redesigned the candidate preview into a fullscreen remote-control presentation that can show text, images, YouTube video, and PDF or Google Drive documents.",
      "metric": "7-slide media deck",
      "impact": 96,
      "tone": "mint",
      "skills": ["Presentation UX", "Media publishing", "Frontend QA", "Product thinking"],
      "people": [
        {"name": "Linh Tran", "role": "Frontend reviewer"},
        {"name": "Quang Pham", "role": "Portal operator"}
      ],
      "mediaGallery": [
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85",
          "thumbnail": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=75",
          "caption": "Presentation planning workshop"
        },
        {
          "type": "video",
          "src": "https://www.youtube.com/watch?v=UAinLaT42xY",
          "thumbnail": "https://img.youtube.com/vi/UAinLaT42xY/hqdefault.jpg",
          "caption": "Public YouTube design thinking reference"
        },
        {
          "type": "document",
          "src": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          "thumbnail": "",
          "caption": "Sample PDF document"
        }
      ]
    },
    {
      "id": "workflow-automation",
      "year": 2025,
      "date": "2025-11-14",
      "type": "achievement",
      "title": "Operations workflow automation",
      "org": "Local Commerce Team",
      "summary": "Mapped manual order, inventory, and confirmation work into one repeatable workflow so the team could reduce back-and-forth status checks.",
      "metric": "42% faster handoff",
      "impact": 91,
      "tone": "blue",
      "skills": ["Workflow mapping", "Automation", "Team enablement", "Reporting"],
      "people": [
        {"name": "Mai Nguyen", "role": "Operations lead"},
        {"name": "Huy Vo", "role": "Data support"}
      ],
      "mediaGallery": [
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=85",
          "thumbnail": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=75",
          "caption": "Workflow dashboard review"
        }
      ]
    },
    {
      "id": "field-research",
      "year": 2024,
      "date": "2024-06-20",
      "type": "research",
      "title": "Small business field research",
      "org": "Independent Study",
      "summary": "Interviewed shop owners and staff to understand how they record orders, solve customer issues, and decide what information matters during busy hours.",
      "metric": "28 interviews",
      "impact": 84,
      "tone": "coral",
      "skills": ["Interviewing", "Synthesis", "Service design", "Customer empathy"],
      "people": [
        {"name": "Linh Tran", "role": "Research partner"},
        {"name": "An Bui", "role": "Shop owner"}
      ],
      "mediaGallery": [
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85",
          "thumbnail": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=75",
          "caption": "Interview synthesis session"
        }
      ]
    },
    {
      "id": "community-workshop",
      "year": 2023,
      "date": "2023-09-09",
      "type": "volunteer",
      "title": "Community digital skills workshop",
      "org": "Open Learning Club",
      "summary": "Helped students and early-career workers build a simple digital profile, organize project evidence, and present their work with confidence.",
      "metric": "18 workshop sessions",
      "impact": 78,
      "tone": "gold",
      "skills": ["Mentoring", "Storytelling", "Training", "Career support"],
      "people": [
        {"name": "Quang Pham", "role": "Workshop coordinator"},
        {"name": "Mai Nguyen", "role": "Mentor"}
      ],
      "mediaGallery": [
        {
          "type": "video",
          "src": "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
          "thumbnail": "https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg",
          "caption": "Public inspiration video for career storytelling"
        }
      ]
    }
  ]
}
$profile$::jsonb;
BEGIN
    SELECT id INTO v_profile_id
    FROM open2job_candidate_profile
    WHERE lower(owner_key) = lower(v_owner);

    IF v_profile_id IS NULL THEN
        INSERT INTO open2job_candidate_profile (
            owner_key, slug, display_name, professional_role, location_name, headline,
            introduction, portrait_url, reel_url, availability_text, visibility,
            publication_status, review_status, discover_rank
        ) VALUES (
            v_owner, v_profile->>'slug', v_profile->>'name', v_profile->>'role',
            v_profile->>'location', v_profile->>'headline', v_profile->>'intro',
            v_profile->>'portraitUrl', v_profile->>'reelUrl', v_profile->>'availability',
            'private', 'draft', 'not_submitted', 2026082301
        ) RETURNING id INTO v_profile_id;
    ELSE
        UPDATE open2job_candidate_profile
        SET slug = v_profile->>'slug',
            display_name = v_profile->>'name',
            professional_role = v_profile->>'role',
            location_name = v_profile->>'location',
            headline = v_profile->>'headline',
            introduction = v_profile->>'intro',
            portrait_url = v_profile->>'portraitUrl',
            reel_url = v_profile->>'reelUrl',
            availability_text = v_profile->>'availability',
            visibility = 'private',
            publication_status = 'draft',
            review_status = 'not_submitted',
            review_requested_at = NULL,
            preview_token_hash = NULL,
            preview_created_at = NULL,
            published_snapshot = NULL,
            discover_rank = 2026082301,
            updated_at = now(),
            row_version = row_version + 1
        WHERE id = v_profile_id;

        DELETE FROM open2job_profile_review_request WHERE profile_id = v_profile_id;
        DELETE FROM open2job_candidate_memory WHERE profile_id = v_profile_id;
        DELETE FROM open2job_collaborator WHERE profile_id = v_profile_id;
    END IF;

    FOR v_memory IN SELECT value FROM jsonb_array_elements(v_profile->'nodes')
    LOOP
        INSERT INTO open2job_candidate_memory (
            profile_id, public_key, memory_type, title, organization, summary,
            metric, occurred_on, display_year, impact_score, tone, display_order
        ) VALUES (
            v_profile_id,
            v_memory->>'id',
            v_memory->>'type',
            v_memory->>'title',
            v_memory->>'org',
            v_memory->>'summary',
            v_memory->>'metric',
            NULLIF(v_memory->>'date', '')::date,
            NULLIF(v_memory->>'year', '')::integer,
            NULLIF(v_memory->>'impact', '')::integer,
            COALESCE(NULLIF(v_memory->>'tone', ''), 'mint'),
            v_order
        ) RETURNING id INTO v_memory_id;

        FOR v_skill IN SELECT value FROM jsonb_array_elements_text(coalesce(v_memory->'skills', '[]'::jsonb))
        LOOP
            INSERT INTO open2job_skill(name, category)
            VALUES (v_skill, 'Sample profile')
            ON CONFLICT (lower(name)) DO UPDATE SET name = EXCLUDED.name
            RETURNING id INTO v_skill_id;

            INSERT INTO open2job_memory_skill(memory_id, skill_id)
            VALUES (v_memory_id, v_skill_id)
            ON CONFLICT DO NOTHING;
        END LOOP;

        v_media_order := 0;
        FOR v_media IN SELECT value FROM jsonb_array_elements(coalesce(v_memory->'mediaGallery', '[]'::jsonb))
        LOOP
            INSERT INTO open2job_memory_media (
                memory_id, media_type, source_url, thumbnail_url, caption, display_order
            ) VALUES (
                v_memory_id,
                v_media->>'type',
                v_media->>'src',
                COALESCE(v_media->>'thumbnail', ''),
                COALESCE(v_media->>'caption', ''),
                v_media_order
            );
            v_media_order := v_media_order + 1;
        END LOOP;

        v_person_order := 0;
        FOR v_person IN SELECT value FROM jsonb_array_elements(coalesce(v_memory->'people', '[]'::jsonb))
        LOOP
            v_person_name := v_person->>'name';
            v_person_key := trim(both '-' from lower(regexp_replace(v_person_name, '[^a-zA-Z0-9]+', '-', 'g')));

            INSERT INTO open2job_collaborator (
                profile_id, public_key, display_name, role_label, avatar_url, profile_url
            ) VALUES (
                v_profile_id,
                v_person_key,
                v_person_name,
                COALESCE(v_person->>'role', ''),
                '',
                ''
            )
            ON CONFLICT (profile_id, public_key) DO UPDATE
            SET display_name = EXCLUDED.display_name,
                role_label = EXCLUDED.role_label
            RETURNING id INTO v_collaborator_id;

            INSERT INTO open2job_memory_collaborator(memory_id, collaborator_id, display_order)
            VALUES (v_memory_id, v_collaborator_id, v_person_order)
            ON CONFLICT DO NOTHING;

            v_person_order := v_person_order + 1;
        END LOOP;

        v_order := v_order + 1;
    END LOOP;

    PERFORM open2job_rebuild_profile_snapshot(v_profile_id);
    RAISE NOTICE 'Seeded Open2Job sample profile for %, slug=%', v_owner, v_profile->>'slug';
END;
$$;

COMMIT;
