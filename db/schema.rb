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

ActiveRecord::Schema.define(version: 20171016085745) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.integer  "program_id"
    t.integer  "bible_book_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "type"
    t.text     "note"
    t.index ["bible_book_id"], name: "index_activities_on_bible_book_id", using: :btree
    t.index ["program_id"], name: "index_activities_on_program_id", using: :btree
  end

  create_table "activities_participants", force: :cascade do |t|
    t.integer "activity_id"
    t.integer "participant_id"
    t.index ["activity_id"], name: "index_activities_participants_on_activity_id", using: :btree
    t.index ["participant_id"], name: "index_activities_participants_on_participant_id", using: :btree
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

  create_table "countries", force: :cascade do |t|
    t.string   "code"
    t.string   "english_name"
    t.string   "french_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "people_count"
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
    t.index ["program_id"], name: "index_domain_updates_on_program_id", using: :btree
    t.index ["status_parameter_id"], name: "index_domain_updates_on_status_parameter_id", using: :btree
  end

  create_table "event_participants", force: :cascade do |t|
    t.integer  "event_id"
    t.integer  "person_id"
    t.integer  "program_role_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["event_id"], name: "index_event_participants_on_event_id", using: :btree
    t.index ["person_id"], name: "index_event_participants_on_person_id", using: :btree
    t.index ["program_role_id"], name: "index_event_participants_on_program_role_id", using: :btree
  end

  create_table "events", force: :cascade do |t|
    t.string   "start_date"
    t.string   "end_date"
    t.integer  "kind"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "domain"
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
    t.index ["cameroon_region_id"], name: "index_languages_on_cameroon_region_id", using: :btree
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
    t.integer  "program_role_id"
    t.string   "start_date"
    t.string   "end_date"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["person_id"], name: "index_participants_on_person_id", using: :btree
    t.index ["program_id"], name: "index_participants_on_program_id", using: :btree
    t.index ["program_role_id"], name: "index_participants_on_program_role_id", using: :btree
  end

  create_table "people", force: :cascade do |t|
    t.string   "last_name"
    t.string   "first_name"
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "email"
    t.string   "password"
    t.integer  "organization_id"
    t.date     "birth_date"
    t.string   "gender",                   limit: 1
    t.text     "cv_text"
    t.string   "former_last_name"
    t.integer  "country_id"
    t.string   "ui_language"
    t.boolean  "role_user",                          default: false
    t.boolean  "role_program_responsable",           default: false
    t.boolean  "role_program_supervisor",            default: false
    t.boolean  "role_program_admin",                 default: false
    t.boolean  "role_site_admin",                    default: false
    t.index ["country_id"], name: "index_people_on_country_id", using: :btree
    t.index ["organization_id"], name: "index_people_on_organization_id", using: :btree
  end

  create_table "program_roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "program_roles_stage_names", force: :cascade do |t|
    t.integer "program_role_id"
    t.integer "stage_name_id"
    t.index ["program_role_id"], name: "index_program_roles_stage_names_on_program_role_id", using: :btree
    t.index ["stage_name_id"], name: "index_program_roles_stage_names_on_stage_name_id", using: :btree
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
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["program_id"], name: "index_publications_on_program_id", using: :btree
  end

  create_table "research_permits", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "language_id"
    t.date     "proposal_date"
    t.date     "issue_date"
    t.date     "expiration_date"
    t.string   "permit_number"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["language_id"], name: "index_research_permits_on_language_id", using: :btree
    t.index ["person_id"], name: "index_research_permits_on_person_id", using: :btree
  end

  create_table "stage_names", force: :cascade do |t|
    t.string  "name"
    t.integer "level"
    t.string  "kind"
  end

  create_table "stages", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "stage_name_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "start_date"
    t.boolean  "current",       default: false
    t.index ["activity_id"], name: "index_stages_on_activity_id", using: :btree
    t.index ["stage_name_id"], name: "index_stages_on_stage_name_id", using: :btree
  end

  create_table "status_parameters", force: :cascade do |t|
    t.string   "domain"
    t.string   "prompt"
    t.boolean  "number_field"
    t.string   "number_unit"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

end
