# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_04_135304) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "unaccent"

  create_table "activities", id: :serial, force: :cascade do |t|
    t.boolean "archived", default: false
    t.integer "bible_book_id"
    t.string "category"
    t.datetime "created_at", precision: nil, null: false
    t.string "film"
    t.bigint "language_id"
    t.text "note"
    t.integer "program_id"
    t.string "scripture"
    t.string "title"
    t.string "type"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["bible_book_id"], name: "index_activities_on_bible_book_id"
    t.index ["language_id"], name: "index_activities_on_language_id"
    t.index ["program_id"], name: "index_activities_on_program_id"
  end

  create_table "activities_bible_books", id: :serial, force: :cascade do |t|
    t.integer "bible_book_id"
    t.integer "media_activity_id"
    t.index ["bible_book_id"], name: "index_activities_bible_books_on_bible_book_id"
    t.index ["media_activity_id"], name: "index_activities_bible_books_on_media_activity_id"
  end

  create_table "activities_participants", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.integer "participant_id"
    t.index ["activity_id"], name: "index_activities_participants_on_activity_id"
    t.index ["participant_id"], name: "index_activities_participants_on_participant_id"
  end

  create_table "audits", id: :serial, force: :cascade do |t|
    t.string "action"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "auditable_id"
    t.string "auditable_type"
    t.jsonb "audited_changes"
    t.string "comment"
    t.datetime "created_at", precision: nil
    t.string "remote_address"
    t.string "request_uuid"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.integer "version", default: 0
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "bible_books", id: :serial, force: :cascade do |t|
    t.string "english_name"
    t.string "french_name"
    t.integer "number_of_chapters"
    t.integer "number_of_verses"
    t.integer "usfm_number"
  end

  create_table "bible_books_domain_status_items", id: false, force: :cascade do |t|
    t.bigint "bible_book_id", null: false
    t.bigint "domain_status_item_id", null: false
  end

  create_table "clusters", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.integer "region_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["region_id"], name: "index_clusters_on_region_id"
  end

  create_table "clusters_events", id: false, force: :cascade do |t|
    t.integer "cluster_id", null: false
    t.integer "event_id", null: false
  end

  create_table "countries", id: :serial, force: :cascade do |t|
    t.string "code"
    t.datetime "created_at", precision: nil, null: false
    t.string "english_name"
    t.string "french_name"
    t.integer "people_count"
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "countries_languages", force: :cascade do |t|
    t.bigint "country_id"
    t.bigint "language_id"
    t.index ["country_id"], name: "index_countries_languages_on_country_id"
    t.index ["language_id"], name: "index_countries_languages_on_language_id"
  end

  create_table "country_regions", id: :serial, force: :cascade do |t|
    t.integer "country_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "english_name"
    t.string "french_name"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["country_id"], name: "index_country_regions_on_country_id"
  end

  create_table "country_regions_languages", force: :cascade do |t|
    t.bigint "country_region_id"
    t.bigint "language_id"
    t.index ["country_region_id"], name: "index_country_regions_languages_on_country_region_id"
    t.index ["language_id"], name: "index_country_regions_languages_on_language_id"
  end

  create_table "delayed_jobs", id: :serial, force: :cascade do |t|
    t.integer "attempts", default: 0, null: false
    t.datetime "created_at", precision: nil
    t.datetime "failed_at", precision: nil
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "locked_at", precision: nil
    t.string "locked_by"
    t.integer "priority", default: 0, null: false
    t.string "queue"
    t.datetime "run_at", precision: nil
    t.datetime "updated_at", precision: nil
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "domain_status_items", force: :cascade do |t|
    t.string "category"
    t.string "completeness", default: ""
    t.integer "count", default: 0
    t.integer "creator_id"
    t.string "description", default: ""
    t.json "details", default: {}
    t.bigint "dsi_location_id"
    t.bigint "language_id"
    t.string "link", default: ""
    t.bigint "organization_id"
    t.bigint "person_id"
    t.string "platforms", default: ""
    t.string "subcategory"
    t.string "title", default: ""
    t.integer "year"
    t.index ["dsi_location_id"], name: "index_domain_status_items_on_dsi_location_id"
    t.index ["language_id"], name: "index_domain_status_items_on_language_id"
    t.index ["organization_id"], name: "index_domain_status_items_on_organization_id"
    t.index ["person_id"], name: "index_domain_status_items_on_person_id"
  end

  create_table "domain_status_items_organizations", force: :cascade do |t|
    t.bigint "domain_status_item_id"
    t.bigint "organization_id"
    t.index ["domain_status_item_id"], name: "index_dsi_organizations_on_dsi_id"
    t.index ["organization_id"], name: "index_domain_status_items_organizations_on_organization_id"
  end

  create_table "domain_status_items_people", force: :cascade do |t|
    t.bigint "domain_status_item_id"
    t.bigint "person_id"
    t.index ["domain_status_item_id"], name: "index_domain_status_items_people_on_domain_status_item_id"
    t.index ["person_id"], name: "index_domain_status_items_people_on_person_id"
  end

  create_table "domain_updates", id: :serial, force: :cascade do |t|
    t.integer "author_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "date"
    t.string "domain"
    t.bigint "language_id"
    t.text "note"
    t.float "number"
    t.integer "program_id"
    t.string "status"
    t.integer "status_parameter_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["language_id"], name: "index_domain_updates_on_language_id"
    t.index ["program_id"], name: "index_domain_updates_on_program_id"
    t.index ["status_parameter_id"], name: "index_domain_updates_on_status_parameter_id"
  end

  create_table "dsi_locations", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "event_locations", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "event_participants", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "event_id"
    t.integer "person_id"
    t.string "roles_field"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["event_id"], name: "index_event_participants_on_event_id"
    t.index ["person_id"], name: "index_event_participants_on_person_id"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.string "category", default: ""
    t.datetime "created_at", precision: nil, null: false
    t.integer "creator_id"
    t.string "domain"
    t.string "end_date"
    t.bigint "event_location_id"
    t.string "name"
    t.text "note"
    t.string "start_date"
    t.string "subcategory", default: ""
    t.datetime "updated_at", precision: nil, null: false
    t.index ["event_location_id"], name: "index_events_on_event_location_id"
  end

  create_table "events_languages", id: :serial, force: :cascade do |t|
    t.integer "event_id"
    t.bigint "language_id"
    t.integer "program_id"
    t.index ["event_id"], name: "index_events_languages_on_event_id"
    t.index ["language_id"], name: "index_events_languages_on_language_id"
    t.index ["program_id"], name: "index_events_languages_on_program_id"
  end

  create_table "language_statuses", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.text "description"
    t.string "label"
    t.string "level"
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "languages", id: :serial, force: :cascade do |t|
    t.string "alt_names"
    t.string "category"
    t.string "classification"
    t.integer "cluster_id"
    t.string "code"
    t.integer "country_id"
    t.integer "country_region_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "international_language"
    t.integer "language_status_id"
    t.string "name"
    t.text "notes"
    t.integer "parent_id"
    t.integer "population"
    t.string "population_description"
    t.integer "program_id"
    t.integer "region_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["cluster_id"], name: "index_languages_on_cluster_id"
    t.index ["country_id"], name: "index_languages_on_country_id"
    t.index ["country_region_id"], name: "index_languages_on_country_region_id"
    t.index ["language_status_id"], name: "index_languages_on_language_status_id"
    t.index ["parent_id"], name: "index_languages_on_parent_id"
  end

  create_table "notes", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "for_id"
    t.string "for_type"
    t.bigint "person_id"
    t.string "text"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["person_id"], name: "index_notes_on_person_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "channels", default: ""
    t.datetime "created_at", precision: nil, null: false
    t.integer "creator_id"
    t.string "english", default: ""
    t.string "french", default: ""
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "old_notifications", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.boolean "emailed", default: false
    t.string "kind"
    t.json "links_json"
    t.integer "person_id"
    t.boolean "read", default: false
    t.datetime "updated_at", precision: nil, null: false
    t.json "vars_json"
    t.index ["person_id"], name: "index_old_notifications_on_person_id"
  end

  create_table "organization_people", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "end_date"
    t.bigint "organization_id"
    t.bigint "person_id"
    t.string "position"
    t.string "start_date"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["organization_id"], name: "index_organization_people_on_organization_id"
    t.index ["person_id"], name: "index_organization_people_on_person_id"
  end

  create_table "organizations", id: :serial, force: :cascade do |t|
    t.bigint "country_id"
    t.datetime "created_at", precision: nil, null: false
    t.text "description"
    t.string "long_name"
    t.integer "parent_id"
    t.string "short_name"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["country_id"], name: "index_organizations_on_country_id"
  end

  create_table "participants", id: :serial, force: :cascade do |t|
    t.integer "cluster_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "end_date"
    t.bigint "language_id"
    t.integer "person_id"
    t.integer "program_id"
    t.string "roles_field"
    t.string "start_date"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["cluster_id"], name: "index_participants_on_cluster_id"
    t.index ["language_id"], name: "index_participants_on_language_id"
    t.index ["person_id"], name: "index_participants_on_person_id"
    t.index ["program_id"], name: "index_participants_on_program_id"
  end

  create_table "people", id: :serial, force: :cascade do |t|
    t.date "birth_date"
    t.integer "country_id"
    t.datetime "created_at", precision: nil, null: false
    t.text "cv_text"
    t.string "email"
    t.integer "email_pref", default: 0
    t.string "first_name"
    t.string "former_last_name"
    t.string "gender", limit: 1
    t.boolean "has_login", default: false
    t.date "last_access"
    t.string "last_name"
    t.string "notification_channels", default: ""
    t.integer "organization_id"
    t.string "password"
    t.string "roles_field"
    t.string "ui_language"
    t.datetime "updated_at", precision: nil, null: false
    t.json "view_prefs", default: {}
    t.index ["country_id"], name: "index_people_on_country_id"
    t.index ["organization_id"], name: "index_people_on_organization_id"
  end

  create_table "person_notifications", force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.boolean "emailed", default: false
    t.bigint "notification_id"
    t.bigint "person_id"
    t.boolean "read", default: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["notification_id"], name: "index_person_notifications_on_notification_id"
    t.index ["person_id"], name: "index_person_notifications_on_person_id"
  end

  create_table "person_roles", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.date "end_date"
    t.integer "person_id"
    t.string "role"
    t.date "start_date"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["person_id"], name: "index_person_roles_on_person_id"
  end

  create_table "programs", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "language_id"
    t.integer "lpf_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["language_id"], name: "index_programs_on_language_id"
    t.index ["lpf_id"], name: "index_programs_on_lpf_id"
  end

  create_table "publications", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "english_name"
    t.string "film_kind"
    t.string "french_name"
    t.string "kind"
    t.bigint "language_id"
    t.string "media_kind"
    t.string "nl_name"
    t.integer "program_id"
    t.string "scripture_kind"
    t.datetime "updated_at", precision: nil, null: false
    t.integer "year"
    t.index ["language_id"], name: "index_publications_on_language_id"
    t.index ["program_id"], name: "index_publications_on_program_id"
  end

  create_table "regions", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "lpf_id"
    t.string "name"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["lpf_id"], name: "index_regions_on_lpf_id"
  end

  create_table "reports", id: :serial, force: :cascade do |t|
    t.integer "author_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.jsonb "params"
    t.jsonb "report", default: {}
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "stages", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.datetime "created_at", precision: nil, null: false
    t.boolean "current", default: false
    t.string "kind"
    t.string "name"
    t.string "start_date"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["activity_id"], name: "index_stages_on_activity_id"
  end

  create_table "status_parameters", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "domain"
    t.boolean "number_field"
    t.string "number_unit"
    t.integer "order"
    t.string "prompt"
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "status_parameters_surveys", id: :serial, force: :cascade do |t|
    t.integer "status_parameter_id"
    t.integer "survey_id"
    t.index ["status_parameter_id"], name: "index_status_parameters_surveys_on_status_parameter_id"
    t.index ["survey_id"], name: "index_status_parameters_surveys_on_survey_id"
  end

  create_table "survey_completions", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.bigint "language_id"
    t.integer "person_id"
    t.integer "program_id"
    t.integer "survey_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["language_id"], name: "index_survey_completions_on_language_id"
    t.index ["person_id"], name: "index_survey_completions_on_person_id"
    t.index ["program_id"], name: "index_survey_completions_on_program_id"
    t.index ["survey_id"], name: "index_survey_completions_on_survey_id"
  end

  create_table "surveys", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.boolean "open", default: false
    t.datetime "updated_at", precision: nil, null: false
  end

  create_table "territories", id: :serial, force: :cascade do |t|
    t.integer "country_region_id"
    t.datetime "created_at", precision: nil, null: false
    t.string "name"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["country_region_id"], name: "index_territories_on_country_region_id"
  end

  create_table "viewed_reports", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "person_id"
    t.integer "report_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["person_id"], name: "index_viewed_reports_on_person_id"
    t.index ["report_id"], name: "index_viewed_reports_on_report_id"
  end

  create_table "workshops", id: :serial, force: :cascade do |t|
    t.datetime "created_at", precision: nil, null: false
    t.integer "event_id"
    t.integer "linguistic_activity_id"
    t.string "name"
    t.integer "number"
    t.integer "stage_id"
    t.datetime "updated_at", precision: nil, null: false
    t.index ["event_id"], name: "index_workshops_on_event_id"
    t.index ["linguistic_activity_id"], name: "index_workshops_on_linguistic_activity_id"
    t.index ["stage_id"], name: "index_workshops_on_stage_id"
  end
end
