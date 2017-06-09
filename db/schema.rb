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

ActiveRecord::Schema.define(version: 20170609084522) do

  create_table "activities", force: :cascade do |t|
    t.integer  "program_id"
    t.integer  "bible_book_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "type"
    t.index ["bible_book_id"], name: "index_activities_on_bible_book_id"
    t.index ["program_id"], name: "index_activities_on_program_id"
  end

  create_table "activities_pers_prog_rels", force: :cascade do |t|
    t.integer "activity_id"
    t.integer "pers_prog_rel_id"
    t.index ["activity_id"], name: "index_activities_pers_prog_rels_on_activity_id"
    t.index ["pers_prog_rel_id"], name: "index_activities_pers_prog_rels_on_pers_prog_rel_id"
  end

  create_table "bible_books", force: :cascade do |t|
    t.string  "english_name"
    t.integer "number_of_chapters"
    t.integer "number_of_verses"
    t.string  "french_name"
  end

  create_table "book_translation_consultants", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "person_id"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["activity_id"], name: "index_book_translation_consultants_on_activity_id"
    t.index ["person_id"], name: "index_book_translation_consultants_on_person_id"
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
    t.index ["cameroon_region_id"], name: "index_cameroon_territories_on_cameroon_region_id"
  end

  create_table "countries", force: :cascade do |t|
    t.string   "code"
    t.string   "english_name"
    t.string   "french_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
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
    t.integer  "fmid"
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
    t.index ["cameroon_region_id"], name: "index_languages_on_cameroon_region_id"
    t.index ["country_id"], name: "index_languages_on_country_id"
    t.index ["language_status_id"], name: "index_languages_on_language_status_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.string   "abbreviation"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "fmid"
    t.text     "description"
  end

  create_table "people", force: :cascade do |t|
    t.string   "last_name"
    t.string   "first_name"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.string   "email"
    t.boolean  "has_login",                  default: false
    t.string   "password"
    t.integer  "organization_id"
    t.integer  "fmid"
    t.date     "birth_date"
    t.string   "gender",           limit: 1
    t.text     "cv_text"
    t.string   "former_last_name"
    t.integer  "country_id"
    t.string   "ui_language"
    t.index ["country_id"], name: "index_people_on_country_id"
    t.index ["organization_id"], name: "index_people_on_organization_id"
  end

  create_table "pers_prog_rels", force: :cascade do |t|
    t.integer  "person_id"
    t.integer  "program_id"
    t.integer  "program_role_id"
    t.string   "start_date"
    t.string   "end_date"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["person_id"], name: "index_pers_prog_rels_on_person_id"
    t.index ["program_id"], name: "index_pers_prog_rels_on_program_id"
    t.index ["program_role_id"], name: "index_pers_prog_rels_on_program_role_id"
  end

  create_table "program_roles", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "program_roles_stage_names", force: :cascade do |t|
    t.integer "program_role_id"
    t.integer "stage_name_id"
    t.index ["program_role_id"], name: "index_program_roles_stage_names_on_program_role_id"
    t.index ["stage_name_id"], name: "index_program_roles_stage_names_on_stage_name_id"
  end

  create_table "programs", force: :cascade do |t|
    t.integer  "language_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.date     "start_date"
    t.date     "finish_date"
    t.string   "name"
    t.index ["language_id"], name: "index_programs_on_language_id"
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
    t.index ["language_id"], name: "index_research_permits_on_language_id"
    t.index ["person_id"], name: "index_research_permits_on_person_id"
  end

  create_table "stage_names", force: :cascade do |t|
    t.string  "name"
    t.integer "level"
    t.string  "kind"
  end

  create_table "stages", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "stage_name_id"
    t.date     "start_date"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["activity_id"], name: "index_stages_on_activity_id"
    t.index ["stage_name_id"], name: "index_stages_on_stage_name_id"
  end

end
