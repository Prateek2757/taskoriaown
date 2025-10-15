-- Enable required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- provides gen_random_uuid()

/*
  Converted schema from MS SQL -> PostgreSQL
  Timestamps use timestamptz (with timezone). UUID generated with gen_random_uuid().
*/

-----------------------------
-- Roles
-----------------------------
CREATE TABLE roles (
  role_id serial PRIMARY KEY,
  role_name text NOT NULL UNIQUE,
  description text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

-----------------------------
-- Users
-----------------------------
CREATE TABLE users (
  user_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  public_id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NULL,
  phone text NULL,
  is_phone_verified boolean NOT NULL DEFAULT false,
  is_email_verified boolean NOT NULL DEFAULT false,
  default_role_id int NULL REFERENCES roles(role_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz NULL
);

CREATE INDEX ix_users_public_id ON users(public_id);

-----------------------------
-- UserProfiles
-----------------------------
CREATE TABLE attachments (
  attachment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  public_id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_user_id bigint NULL REFERENCES users(user_id) ON DELETE SET NULL,
  file_name text NULL,
  mime_type text NULL,
  file_size_bytes bigint NULL,
  url text NULL,
  storage_provider text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_profiles (
  user_profile_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  display_name text NULL,
  bio text NULL,
  profile_image_id bigint NULL REFERENCES attachments(attachment_id),
  location_id int NULL, -- references cities.city_id later
  latitude double precision NULL,
  longitude double precision NULL,
  avg_rating numeric(3,2) NOT NULL DEFAULT 0.00,
  total_reviews int NOT NULL DEFAULT 0,
  is_provider boolean NOT NULL DEFAULT false,
  provider_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

-----------------------------
-- Locations: Countries, States, Cities
-----------------------------
CREATE TABLE countries (
  country_id serial PRIMARY KEY,
  iso_code text NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE states (
  state_id serial PRIMARY KEY,
  country_id int NOT NULL REFERENCES countries(country_id) ON DELETE CASCADE,
  name text NOT NULL
);

CREATE TABLE cities (
  city_id serial PRIMARY KEY,
  state_id int NULL REFERENCES states(state_id) ON DELETE SET NULL,
  country_id int NOT NULL REFERENCES countries(country_id) ON DELETE CASCADE,
  name text NOT NULL,
  latitude double precision NULL,
  longitude double precision NULL
);

-----------------------------
-- Service Categories
-----------------------------
CREATE TABLE service_categories (
  category_id serial PRIMARY KEY,
  parent_category_id int NULL REFERENCES service_categories(category_id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NULL,
  description text NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

CREATE INDEX ix_service_categories_name ON service_categories(name);

CREATE TABLE category_questions (
  category_question_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id int NOT NULL REFERENCES service_categories(category_id) ON DELETE CASCADE,
  question text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  options jsonb NULL,
  is_required boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-----------------------------
-- Tasks / Jobs
-----------------------------
CREATE TABLE tasks (
  task_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  public_id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id bigint NOT NULL REFERENCES users(user_id),
  category_id int NOT NULL REFERENCES service_categories(category_id),
  title text NOT NULL,
  description text NULL,
  budget_min numeric(12,2) NULL,
  budget_max numeric(12,2) NULL,
  location_id int NULL REFERENCES cities(city_id),
  address_line text NULL,
  status text NOT NULL DEFAULT 'Open',
  preferred_date_start timestamptz NULL,
  preferred_date_end timestamptz NULL,
  is_remote_allowed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz NULL
);

CREATE INDEX ix_tasks_status ON tasks(status);
CREATE INDEX ix_tasks_categoryid_status ON tasks(category_id, status);

CREATE TABLE task_tags (
  task_tag_id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE task_tag_map (
  task_id bigint NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
  task_tag_id int NOT NULL REFERENCES task_tags(task_tag_id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, task_tag_id)
);

CREATE TABLE task_attachments (
  task_attachment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id bigint NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
  attachment_id bigint NOT NULL REFERENCES attachments(attachment_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-----------------------------
-- Task Quotes
-----------------------------
CREATE TABLE task_quotes (
  task_quote_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  public_id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id bigint NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
  provider_id bigint NOT NULL REFERENCES users(user_id),
  amount numeric(12,2) NOT NULL,
  message text NULL,
  estimated_duration_hours int NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

CREATE INDEX ix_taskquotes_taskid_status ON task_quotes(task_id, status);

-----------------------------
-- Assignments & Booking
-----------------------------
CREATE TABLE task_assignments (
  assignment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id bigint NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
  quote_id bigint NULL REFERENCES task_quotes(task_quote_id) ON DELETE SET NULL,
  provider_id bigint NOT NULL REFERENCES users(user_id),
  assigned_by_user_id bigint NOT NULL REFERENCES users(user_id),
  status text NOT NULL DEFAULT 'Assigned',
  started_at timestamptz NULL,
  completed_at timestamptz NULL,
  canceled_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

CREATE INDEX ix_taskassignments_taskid ON task_assignments(task_id);
CREATE INDEX ix_taskassignments_providerid ON task_assignments(provider_id);

-----------------------------
-- Messaging
-----------------------------
CREATE TABLE message_threads (
  thread_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subject text NULL,
  last_message_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE thread_participants (
  thread_id bigint NOT NULL REFERENCES message_threads(thread_id) ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  is_muted boolean NOT NULL DEFAULT false,
  last_seen_at timestamptz NULL,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE messages (
  message_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  thread_id bigint NOT NULL REFERENCES message_threads(thread_id) ON DELETE CASCADE,
  sender_id bigint NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  body text NULL,
  is_system_message boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

CREATE TABLE message_attachments (
  message_attachment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_id bigint NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
  attachment_id bigint NOT NULL REFERENCES attachments(attachment_id) ON DELETE CASCADE
);

CREATE INDEX ix_messages_threadid_createdat ON messages(thread_id, created_at DESC);

-----------------------------
-- Ratings & Reviews
-----------------------------
CREATE TABLE ratings (
  rating_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id bigint NULL REFERENCES tasks(task_id) ON DELETE SET NULL,
  from_user_id bigint NOT NULL REFERENCES users(user_id),
  to_user_id bigint NOT NULL REFERENCES users(user_id),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_ratings_touserid ON ratings(to_user_id);

-----------------------------
-- Payments & Transactions (simplified)
-----------------------------
CREATE TABLE payments (
  payment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  public_id uuid NOT NULL DEFAULT gen_random_uuid(),
  task_id bigint NULL REFERENCES tasks(task_id) ON DELETE SET NULL,
  payer_user_id bigint NOT NULL REFERENCES users(user_id),
  payee_user_id bigint NULL REFERENCES users(user_id),
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  payment_provider text NULL,
  provider_transaction_id text NULL,
  status text NOT NULL DEFAULT 'Initiated',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NULL
);

CREATE TABLE transactions (
  transaction_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  payment_id bigint NULL REFERENCES payments(payment_id) ON DELETE SET NULL,
  type text NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  metadata jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payouts (
  payout_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  provider_id bigint NOT NULL REFERENCES users(user_id),
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  provider_account_ref text NULL,
  status text NOT NULL DEFAULT 'Pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz NULL
);

-----------------------------
-- Notifications
-----------------------------
CREATE TABLE notifications (
  notification_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title text NULL,
  body text NULL,
  channel text NOT NULL DEFAULT 'inapp',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_notifications_userid_createdat ON notifications(user_id, created_at DESC);

-----------------------------
-- Admins, Activity Logs, Disputes
-----------------------------
CREATE TABLE admin_users (
  admin_user_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  is_super_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_logs (
  activity_log_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NULL REFERENCES users(user_id) ON DELETE SET NULL,
  action text NOT NULL,
  object_type text NULL,
  object_id text NULL,
  details text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE disputes (
  dispute_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_id bigint NOT NULL REFERENCES tasks(task_id),
  raised_by_user_id bigint NOT NULL REFERENCES users(user_id),
  assigned_admin_user_id bigint NULL REFERENCES admin_users(admin_user_id),
  reason text NULL,
  status text NOT NULL DEFAULT 'Open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz NULL
);

-----------------------------
-- Indexing suggestions
-----------------------------
CREATE INDEX ix_tasks_category_location_status ON tasks(category_id, location_id, status);

-----------------------------
-- Functions / Stored Procedures (converted)
-----------------------------

-- 1) Get open tasks by category with pagination
CREATE OR REPLACE FUNCTION sp_get_open_tasks_by_category(
  p_category_id int DEFAULT NULL,
  p_location_id int DEFAULT NULL,
  p_status text DEFAULT 'Open',
  p_page_number int DEFAULT 1,
  p_page_size int DEFAULT 20
)
RETURNS TABLE(
  task_id bigint,
  public_id uuid,
  title text,
  description text,
  budget_min numeric,
  budget_max numeric,
  preferred_date_start timestamptz,
  status text,
  created_at timestamptz,
  category_name text,
  city_name text
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT t.task_id, t.public_id, t.title, t.description, t.budget_min, t.budget_max,
         t.preferred_date_start, t.status, t.created_at, c.name AS category_name, ct.name AS city_name
  FROM tasks t
  JOIN service_categories c ON t.category_id = c.category_id
  LEFT JOIN cities ct ON t.location_id = ct.city_id
  WHERE (p_category_id IS NULL OR t.category_id = p_category_id)
    AND (p_location_id IS NULL OR t.location_id = p_location_id)
    AND (t.status = p_status)
    AND t.is_deleted = false
  ORDER BY t.created_at DESC
  OFFSET (p_page_number - 1) * p_page_size
  LIMIT p_page_size;
END;
$$;

-- 2) Submit a quote (returns new quote id)
CREATE OR REPLACE FUNCTION sp_submit_quote(
  p_task_id bigint,
  p_provider_id bigint,
  p_amount numeric,
  p_message text,
  p_estimated_duration_hours int DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  new_id bigint;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM tasks WHERE task_id = p_task_id AND is_deleted = false) THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  INSERT INTO task_quotes (task_id, provider_id, amount, message, estimated_duration_hours, status, created_at)
  VALUES (p_task_id, p_provider_id, p_amount, p_message, p_estimated_duration_hours, 'Pending', now())
  RETURNING task_quote_id INTO new_id;

  RETURN new_id;
END;
$$;

-----------------------------
-- View for provider dashboard
-----------------------------
CREATE OR REPLACE VIEW vw_provider_open_quotes AS
SELECT q.task_quote_id, q.task_id, q.provider_id, q.amount, q.status, q.created_at, t.title, t.customer_id
FROM task_quotes q
JOIN tasks t ON q.task_id = t.task_id
WHERE q.status = 'Pending' AND t.is_deleted = false;

-----------------------------
-- Trigger: update Tasks.updated_at when a TaskQuote is inserted
-----------------------------
CREATE OR REPLACE FUNCTION trg_taskquote_after_insert_fn()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Update the task's updated_at for the affected TaskId
  UPDATE tasks SET updated_at = now()
  WHERE task_id = NEW.task_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_taskquote_after_insert ON task_quotes;
CREATE TRIGGER trg_taskquote_after_insert
AFTER INSERT ON task_quotes
FOR EACH ROW
EXECUTE FUNCTION trg_taskquote_after_insert_fn();

-----------------------------
-- Final notes
-----------------------------
-- Consider replacing latitude/longitude with PostGIS geography POINT + spatial indexes for radius queries.
-- For production, add more CHECK constraints, unique constraints and appropriate FK ON DELETE behavior as needed.
-- For large tables, consider partitioning (e.g., by created_at or status).
-- Use connection pooling and proper transaction handling in application code when calling functions above.
