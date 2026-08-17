-- PostgreSQL schema for the incremental Japanese document-learning workspace.
-- Apply to the anhmedia tenant database after reviewing table ownership.
BEGIN;

CREATE TABLE IF NOT EXISTS public.japanese_learning_document (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.usertb(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    source_file_name VARCHAR(500),
    source_file_key VARCHAR(1000),
    mime_type VARCHAR(100),
    extracted_text TEXT NOT NULL DEFAULT '',
    editor_html TEXT NOT NULL DEFAULT '',
    extraction_language VARCHAR(16) NOT NULL DEFAULT 'jpn',
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT japanese_learning_document_status_ck CHECK (status IN ('extracting','draft','ready','archived'))
);

CREATE INDEX IF NOT EXISTS japanese_learning_document_user_updated_idx
    ON public.japanese_learning_document (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.japanese_learning_passage (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES public.japanese_learning_document(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.usertb(id) ON DELETE CASCADE,
    source_text TEXT NOT NULL,
    start_offset INTEGER,
    end_offset INTEGER,
    annotated_html TEXT,
    hiragana TEXT,
    romaji_breakdown JSONB NOT NULL DEFAULT '[]'::JSONB,
    translation_en TEXT,
    grammar_notes JSONB NOT NULL DEFAULT '[]'::JSONB,
    ai_model VARCHAR(100),
    ai_prompt_version VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT japanese_learning_passage_offsets_ck CHECK (
        (start_offset IS NULL AND end_offset IS NULL) OR
        (start_offset >= 0 AND end_offset >= start_offset)
    )
);

CREATE INDEX IF NOT EXISTS japanese_learning_passage_user_created_idx
    ON public.japanese_learning_passage (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.japanese_learning_vocabulary (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.usertb(id) ON DELETE CASCADE,
    passage_id BIGINT REFERENCES public.japanese_learning_passage(id) ON DELETE SET NULL,
    surface VARCHAR(255) NOT NULL,
    reading_hiragana VARCHAR(255),
    romaji VARCHAR(255),
    meaning_en TEXT,
    context_sentence TEXT,
    note_html TEXT,
    highlight_color VARCHAR(20),
    ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
    interval_days INTEGER NOT NULL DEFAULT 1,
    repetition_count INTEGER NOT NULL DEFAULT 0,
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, surface, reading_hiragana)
);

CREATE INDEX IF NOT EXISTS japanese_learning_vocabulary_review_idx
    ON public.japanese_learning_vocabulary (user_id, next_review_at);

CREATE TABLE IF NOT EXISTS public.japanese_learning_review_log (
    id BIGSERIAL PRIMARY KEY,
    vocabulary_id BIGINT NOT NULL REFERENCES public.japanese_learning_vocabulary(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.usertb(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL,
    previous_interval_days INTEGER NOT NULL,
    next_interval_days INTEGER NOT NULL,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT japanese_learning_review_rating_ck CHECK (rating BETWEEN 0 AND 5)
);

CREATE INDEX IF NOT EXISTS japanese_learning_review_log_user_idx
    ON public.japanese_learning_review_log (user_id, reviewed_at DESC);

COMMIT;

-- Recommended authenticated endpoints (server-side OpenAI key only):
-- POST /api/japanese-learning/documents
-- GET  /api/japanese-learning/documents
-- PUT  /api/japanese-learning/documents/{id}
-- POST /api/japanese-learning/analyze     (selected text only; max 1,200 chars)
-- POST /api/japanese-learning/passages/{id}/remember
-- GET  /api/japanese-learning/reviews/due
