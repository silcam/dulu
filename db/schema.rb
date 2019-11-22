# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20191121103210) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "activities", id: :serial, force: :cascade do |t|
    t.integer "program_id"
    t.integer "bible_book_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.text "note"
    t.string "category"
    t.string "title"
    t.string "scripture"
    t.string "film"
    t.boolean "archived", default: false
    t.bigint "language_id"
    t.index ["bible_book_id"], name: "index_activities_on_bible_book_id"
    t.index ["language_id"], name: "index_activities_on_language_id"
    t.index ["program_id"], name: "index_activities_on_program_id"
  end

  create_table "activities_bible_books", id: :serial, force: :cascade do |t|
    t.integer "media_activity_id"
    t.integer "bible_book_id"
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
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.jsonb "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_id", "associated_type"], name: "associated_index"
    t.index ["auditable_id", "auditable_type"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "bible_books", id: :serial, force: :cascade do |t|
    t.string "english_name"
    t.integer "number_of_chapters"
    t.integer "number_of_verses"
    t.string "french_name"
    t.integer "usfm_number"
  end

  create_table "bible_books_domain_status_items", id: false, force: :cascade do |t|
    t.bigint "bible_book_id", null: false
    t.bigint "domain_status_item_id", null: false
  end

  create_table "clusters", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lpf_id"
    t.index ["lpf_id"], name: "index_clusters_on_lpf_id"
  end

  create_table "clusters_events", id: false, force: :cascade do |t|
    t.integer "cluster_id", null: false
    t.integer "event_id", null: false
  end

  create_table "countries", id: :serial, force: :cascade do |t|
    t.string "code"
    t.string "english_name"
    t.string "french_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "people_count"
  end

  create_table "countries_languages", force: :cascade do |t|
    t.bigint "country_id"
    t.bigint "language_id"
    t.index ["country_id"], name: "index_countries_languages_on_country_id"
    t.index ["language_id"], name: "index_countries_languages_on_language_id"
  end

  create_table "delayed_jobs", id: :serial, force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "domain_status_items", force: :cascade do |t|
    t.string "category"
    t.string "subcategory"
    t.integer "year"
    t.string "platforms", default: ""
    t.bigint "language_id"
    t.integer "creator_id"
    t.bigint "organization_id"
    t.bigint "person_id"
    t.string "description", default: ""
    t.string "completeness", default: ""
    t.json "details", default: {}
    t.integer "count", default: 0
    t.string "title", default: ""
    t.index ["language_id"], name: "index_domain_status_items_on_language_id"
    t.index ["organization_id"], name: "index_domain_status_items_on_organization_id"
    t.index ["person_id"], name: "index_domain_status_items_on_person_id"
  end

  create_table "domain_updates", id: :serial, force: :cascade do |t|
    t.integer "program_id"
    t.integer "status_parameter_id"
    t.float "number"
    t.string "status"
    t.text "note"
    t.string "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "domain"
    t.integer "author_id"
    t.bigint "language_id"
    t.index ["language_id"], name: "index_domain_updates_on_language_id"
    t.index ["program_id"], name: "index_domain_updates_on_program_id"
    t.index ["status_parameter_id"], name: "index_domain_updates_on_status_parameter_id"
  end

  create_table "event_participants", id: :serial, force: :cascade do |t|
    t.integer "event_id"
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "roles_field"
    t.index ["event_id"], name: "index_event_participants_on_event_id"
    t.index ["person_id"], name: "index_event_participants_on_person_id"
  end

  create_table "events", id: :serial, force: :cascade do |t|
    t.string "start_date"
    t.string "end_date"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "domain"
    t.text "note"
    t.integer "creator_id"
    t.string "category", default: ""
    t.string "subcategory", default: ""
  end

  create_table "events_languages", id: :serial, force: :cascade do |t|
    t.integer "event_id"
    t.integer "program_id"
    t.bigint "language_id"
    t.index ["event_id"], name: "index_events_languages_on_event_id"
    t.index ["language_id"], name: "index_events_languages_on_language_id"
    t.index ["program_id"], name: "index_events_languages_on_program_id"
  end

  create_table "language_statuses", id: :serial, force: :cascade do |t|
    t.string "level"
    t.string "label"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "languages", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.string "code"
    t.integer "language_status_id"
    t.text "notes"
    t.integer "country_id"
    t.string "international_language"
    t.integer "population"
    t.string "population_description"
    t.string "classification"
    t.integer "region_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "alt_names"
    t.integer "parent_id"
    t.integer "cluster_id"
    t.integer "lpf_id"
    t.integer "program_id"
    t.index ["cluster_id"], name: "index_languages_on_cluster_id"
    t.index ["country_id"], name: "index_languages_on_country_id"
    t.index ["language_status_id"], name: "index_languages_on_language_status_id"
    t.index ["parent_id"], name: "index_languages_on_parent_id"
    t.index ["region_id"], name: "index_languages_on_region_id"
  end

  create_table "languages_regions", force: :cascade do |t|
    t.bigint "language_id"
    t.bigint "region_id"
    t.index ["language_id"], name: "index_languages_regions_on_language_id"
    t.index ["region_id"], name: "index_languages_regions_on_region_id"
  end

  create_table "lpfs", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_lpfs_on_person_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "english", default: ""
    t.string "french", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "old_notifications", id: :serial, force: :cascade do |t|
    t.integer "person_id"
    t.string "kind"
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "emailed", default: false
    t.json "vars_json"
    t.json "links_json"
    t.index ["person_id"], name: "index_old_notifications_on_person_id"
  end

  create_table "organization_people", force: :cascade do |t|
    t.bigint "organization_id"
    t.bigint "person_id"
    t.string "position"
    t.string "start_date"
    t.string "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_organization_people_on_organization_id"
    t.index ["person_id"], name: "index_organization_people_on_person_id"
  end

  create_table "organizations", id: :serial, force: :cascade do |t|
    t.string "long_name"
    t.string "short_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.integer "parent_id"
    t.bigint "country_id"
    t.index ["country_id"], name: "index_organizations_on_country_id"
  end

  create_table "participants", id: :serial, force: :cascade do |t|
    t.integer "person_id"
    t.integer "program_id"
    t.string "start_date"
    t.string "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cluster_id"
    t.string "roles_field"
    t.bigint "language_id"
    t.index ["cluster_id"], name: "index_participants_on_cluster_id"
    t.index ["language_id"], name: "index_participants_on_language_id"
    t.index ["person_id"], name: "index_participants_on_person_id"
    t.index ["program_id"], name: "index_participants_on_program_id"
  end

  create_table "people", id: :serial, force: :cascade do |t|
    t.string "last_name"
    t.string "first_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.string "password"
    t.integer "organization_id"
    t.date "birth_date"
    t.string "gender", limit: 1
    t.text "cv_text"
    t.string "former_last_name"
    t.integer "country_id"
    t.string "ui_language"
    t.date "last_access"
    t.string "roles_field"
    t.boolean "has_login", default: false
    t.integer "email_pref", default: 0
    t.json "view_prefs", default: {}
    t.string "notification_channels", default: ""
    t.index ["country_id"], name: "index_people_on_country_id"
    t.index ["organization_id"], name: "index_people_on_organization_id"
  end

  create_table "person_notifications", force: :cascade do |t|
    t.bigint "person_id"
    t.bigint "notification_id"
    t.boolean "read", default: false
    t.boolean "emailed", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notification_id"], name: "index_person_notifications_on_notification_id"
    t.index ["person_id"], name: "index_person_notifications_on_person_id"
  end

  create_table "person_roles", id: :serial, force: :cascade do |t|
    t.integer "person_id"
    t.string "role"
    t.date "start_date"
    t.date "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_person_roles_on_person_id"
  end

  create_table "programs", id: :serial, force: :cascade do |t|
    t.integer "language_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "lpf_id"
    t.index ["language_id"], name: "index_programs_on_language_id"
    t.index ["lpf_id"], name: "index_programs_on_lpf_id"
  end

  create_table "publications", id: :serial, force: :cascade do |t|
    t.integer "program_id"
    t.string "kind"
    t.string "english_name"
    t.string "french_name"
    t.string "nl_name"
    t.integer "year"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "media_kind"
    t.string "scripture_kind"
    t.string "film_kind"
    t.bigint "language_id"
    t.index ["language_id"], name: "index_publications_on_language_id"
    t.index ["program_id"], name: "index_publications_on_program_id"
  end

  create_table "regions", id: :serial, force: :cascade do |t|
    t.string "english_name"
    t.string "french_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "country_id"
    t.index ["country_id"], name: "index_regions_on_country_id"
  end

  create_table "reports", id: :serial, force: :cascade do |t|
    t.string "name"
    t.jsonb "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "author_id"
    t.jsonb "report", default: {}
  end

  create_table "stages", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "start_date"
    t.boolean "current", default: false
    t.string "name"
    t.string "kind"
    t.index ["activity_id"], name: "index_stages_on_activity_id"
  end

  create_table "status_parameters", id: :serial, force: :cascade do |t|
    t.string "domain"
    t.string "prompt"
    t.boolean "number_field"
    t.string "number_unit"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "order"
  end

  create_table "status_parameters_surveys", id: :serial, force: :cascade do |t|
    t.integer "status_parameter_id"
    t.integer "survey_id"
    t.index ["status_parameter_id"], name: "index_status_parameters_surveys_on_status_parameter_id"
    t.index ["survey_id"], name: "index_status_parameters_surveys_on_survey_id"
  end

  create_table "survey_completions", id: :serial, force: :cascade do |t|
    t.integer "survey_id"
    t.integer "program_id"
    t.integer "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "language_id"
    t.index ["language_id"], name: "index_survey_completions_on_language_id"
    t.index ["person_id"], name: "index_survey_completions_on_person_id"
    t.index ["program_id"], name: "index_survey_completions_on_program_id"
    t.index ["survey_id"], name: "index_survey_completions_on_survey_id"
  end

  create_table "surveys", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "open", default: false
  end

  create_table "territories", id: :serial, force: :cascade do |t|
    t.integer "region_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["region_id"], name: "index_territories_on_region_id"
  end

  create_table "viewed_reports", id: :serial, force: :cascade do |t|
    t.integer "person_id"
    t.integer "report_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_viewed_reports_on_person_id"
    t.index ["report_id"], name: "index_viewed_reports_on_report_id"
  end

  create_table "workshops", id: :serial, force: :cascade do |t|
    t.integer "number"
    t.string "name"
    t.integer "linguistic_activity_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "event_id"
    t.integer "stage_id"
    t.index ["event_id"], name: "index_workshops_on_event_id"
    t.index ["linguistic_activity_id"], name: "index_workshops_on_linguistic_activity_id"
    t.index ["stage_id"], name: "index_workshops_on_stage_id"
  end

end
