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

ActiveRecord::Schema.define(version: 20170509085001) do

  create_table "bible_books", force: :cascade do |t|
    t.string  "name"
    t.integer "number_of_chapters"
    t.integer "number_of_verses"
  end

  create_table "book_translation_consultants", force: :cascade do |t|
    t.integer  "book_in_translation_id"
    t.integer  "person_id"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["book_in_translation_id"], name: "index_book_translation_consultants_on_book_in_translation_id"
    t.index ["person_id"], name: "index_book_translation_consultants_on_person_id"
  end

  create_table "book_translation_statuses", force: :cascade do |t|
    t.integer  "book_in_translation_id"
    t.integer  "translation_stage_id"
    t.date     "start_date"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["book_in_translation_id"], name: "index_book_translation_statuses_on_book_in_translation_id"
    t.index ["translation_stage_id"], name: "index_book_translation_statuses_on_translation_stage_id"
  end

  create_table "books_in_translation", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "bible_book_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["bible_book_id"], name: "index_books_in_translation_on_bible_book_id"
    t.index ["project_id"], name: "index_books_in_translation_on_project_id"
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
    t.index ["country_id"], name: "index_people_on_country_id"
    t.index ["organization_id"], name: "index_people_on_organization_id"
  end

  create_table "projects", force: :cascade do |t|
    t.integer  "language_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.date     "start_date"
    t.date     "finish_date"
    t.index ["language_id"], name: "index_projects_on_language_id"
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

  create_table "translation_stages", force: :cascade do |t|
    t.string "name"
  end

end
