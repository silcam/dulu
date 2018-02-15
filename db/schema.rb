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

ActiveRecord::Schema.define(version: 20180215132351) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "activities", force: :cascade do |t|
    t.integer  "program_id"
    t.integer  "bible_book_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "type"
    t.text     "note"
    t.string   "category"
    t.string   "title"
    t.string   "scripture"
    t.string   "film"
    t.boolean  "archived",      default: false
    t.index ["bible_book_id"], name: "index_activities_on_bible_book_id", using: :btree
    t.index ["program_id"], name: "index_activities_on_program_id", using: :btree
  end

  create_table "activities_bible_books", force: :cascade do |t|
    t.integer "media_activity_id"
    t.integer "bible_book_id"
    t.index ["bible_book_id"], name: "index_activities_bible_books_on_bible_book_id", using: :btree
    t.index ["media_activity_id"], name: "index_activities_bible_books_on_media_activity_id", using: :btree
  end

  create_table "activities_participants", force: :cascade do |t|
    t.integer "activity_id"
    t.integer "participant_id"
    t.index ["activity_id"], name: "index_activities_participants_on_activity_id", using: :btree
    t.index ["participant_id"], name: "index_activities_participants_on_participant_id", using: :btree
  end

  create_table "audits", force: :cascade do |t|
    t.integer  "auditable_id"
    t.string   "auditable_type"
    t.integer  "associated_id"
    t.string   "associated_type"
    t.integer  "user_id"
    t.string   "user_type"
    t.string   "username"
    t.string   "action"
    t.jsonb    "audited_changes"
    t.integer  "version",         default: 0
    t.string   "comment"
    t.string   "remote_address"
    t.string   "request_uuid"
    t.datetime "created_at"
    t.index ["associated_id", "associated_type"], name: "associated_index", using: :btree
    t.index ["auditable_id", "auditable_type"], name: "auditable_index", using: :btree
    t.index ["created_at"], name: "index_audits_on_created_at", using: :btree
    t.index ["request_uuid"], name: "index_audits_on_request_uuid", using: :btree
    t.index ["user_id", "user_type"], name: "user_index", using: :btree
  end

  create_table "bible_books", force: :cascade do |t|
    t.string  "english_name"
    t.integer "number_of_chapters"
    t.integer "number_of_verses"
    t.string  "french_name"
    t.integer "usfm_number"
  end

  create_table "cameroon_regions", force: :cascade do |t|
    t.string   "english_name"
    t.string   "french_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "cameroon_territories", force: :cascade do |t|
    t.integer  "cameroon_region_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "name"
    t.index ["cameroon_region_id"], name: "index_cameroon_territories_on_cameroon_region_id", using: :btree
  end

  create_table "clusters", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clusters_events", id: false, force: :cascade do |t|
    t.integer "cluster_id", null: false
    t.integer "event_id",   null: false
  end

  create_table "countries", force: :cascade do |t|
    t.string   "code"
    t.string   "english_name"
    t.string   "french_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "people_count"
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree
  end

  create_table "domain_updates", force: :cascade do |t|
    t.integer  "program_id"
    t.integer  "status_parameter_id"
    t.float    "number"
    t.string   "status"
    t.text     "note"
    t.string   "date"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "domain"
    t.integer  "author_id"
    t.index ["program_id"], name: "index_domain_updates_on_program_id", using: :btree
    t.index ["status_parameter_id"], name: "index_domain_updates_on_status_parameter_id", using: :btree
  end

  create_table "event_participants", force: :cascade do |t|
    t.integer  "event_id"
    t.integer  "person_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "roles_field"
    t.index ["event_id"], name: "index_event_participants_on_event_id", using: :btree
    t.index ["person_id"], name: "index_event_participants_on_person_id", using: :btree
  end

  create_table "events", force: :cascade do |t|
    t.string   "start_date"
    t.string   "end_date"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "domain"
    t.text     "note"
    t.integer  "creator_id"
  end

  create_table "events_programs", force: :cascade do |t|
    t.integer "event_id"
    t.integer "program_id"
    t.index ["event_id"], name: "index_events_programs_on_event_id", using: :btree
    t.index ["program_id"], name: "index_events_programs_on_program_id", using: :btree
  end

  create_table "language_statuses", force: :cascade do |t|
    t.string   "level"
    t.string   "label"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "languages", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.string   "code"
    t.integer  "language_status_id"
    t.text     "notes"
    t.integer  "country_id"
    t.string   "international_language"
    t.integer  "population"
    t.string   "population_description"
    t.string   "classification"
    t.integer  "cameroon_region_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "alt_names"
    t.integer  "parent_id"
    t.integer  "cluster_id"
    t.index ["cameroon_region_id"], name: "index_languages_on_cameroon_region_id", using: :btree
    t.index ["cluster_id"], name: "index_languages_on_cluster_id", using: :btree
    t.index ["country_id"], name: "index_languages_on_country_id", using: :btree
    t.index ["language_status_id"], name: "index_languages_on_language_status_id", using: :btree
    t.index ["parent_id"], name: "index_languages_on_parent_id", using: :btree
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "abbreviation"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.text     "description"
  end

  create_table "participants", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "program_id"
    t.string   "start_date"
    t.string   "end_date"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "cluster_id"
    t.string   "roles_field"
    t.index ["cluster_id"], name: "index_participants_on_cluster_id", using: :btree
    t.index ["person_id"], name: "index_participants_on_person_id", using: :btree
    t.index ["program_id"], name: "index_participants_on_program_id", using: :btree
  end

  create_table "people", force: :cascade do |t|
    t.string   "last_name"
    t.string   "first_name"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.string   "email"
    t.string   "password"
    t.integer  "organization_id"
    t.date     "birth_date"
    t.string   "gender",           limit: 1
    t.text     "cv_text"
    t.string   "former_last_name"
    t.integer  "country_id"
    t.string   "ui_language"
    t.date     "last_access"
    t.string   "roles_field"
    t.boolean  "has_login",                  default: false
    t.index ["country_id"], name: "index_people_on_country_id", using: :btree
    t.index ["organization_id"], name: "index_people_on_organization_id", using: :btree
  end

  create_table "person_roles", force: :cascade do |t|
    t.integer  "person_id"
    t.string   "role"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_person_roles_on_person_id", using: :btree
  end

  create_table "programs", force: :cascade do |t|
    t.integer  "language_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["language_id"], name: "index_programs_on_language_id", using: :btree
  end

  create_table "publications", force: :cascade do |t|
    t.integer  "program_id"
    t.string   "kind"
    t.string   "english_name"
    t.string   "french_name"
    t.string   "nl_name"
    t.integer  "year"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.string   "media_kind"
    t.string   "scripture_kind"
    t.string   "film_kind"
    t.index ["program_id"], name: "index_publications_on_program_id", using: :btree
  end

  create_table "reports", force: :cascade do |t|
    t.string   "name"
    t.jsonb    "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "stages", force: :cascade do |t|
    t.integer  "activity_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "start_date"
    t.boolean  "current",     default: false
    t.string   "name"
    t.string   "kind"
    t.index ["activity_id"], name: "index_stages_on_activity_id", using: :btree
  end

  create_table "status_parameters", force: :cascade do |t|
    t.string   "domain"
    t.string   "prompt"
    t.boolean  "number_field"
    t.string   "number_unit"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "order"
  end

  create_table "status_parameters_surveys", force: :cascade do |t|
    t.integer "status_parameter_id"
    t.integer "survey_id"
    t.index ["status_parameter_id"], name: "index_status_parameters_surveys_on_status_parameter_id", using: :btree
    t.index ["survey_id"], name: "index_status_parameters_surveys_on_survey_id", using: :btree
  end

  create_table "survey_completions", force: :cascade do |t|
    t.integer  "survey_id"
    t.integer  "program_id"
    t.integer  "person_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_survey_completions_on_person_id", using: :btree
    t.index ["program_id"], name: "index_survey_completions_on_program_id", using: :btree
    t.index ["survey_id"], name: "index_survey_completions_on_survey_id", using: :btree
  end

  create_table "surveys", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "open",       default: false
  end

  create_table "viewed_reports", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "report_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["person_id"], name: "index_viewed_reports_on_person_id", using: :btree
    t.index ["report_id"], name: "index_viewed_reports_on_report_id", using: :btree
  end

  create_table "workshops", force: :cascade do |t|
    t.integer  "number"
    t.string   "name"
    t.integer  "linguistic_activity_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "event_id"
    t.integer  "stage_id"
    t.index ["event_id"], name: "index_workshops_on_event_id", using: :btree
    t.index ["linguistic_activity_id"], name: "index_workshops_on_linguistic_activity_id", using: :btree
    t.index ["stage_id"], name: "index_workshops_on_stage_id", using: :btree
  end

end
