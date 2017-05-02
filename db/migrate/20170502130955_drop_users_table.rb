class DropUsersTable < ActiveRecord::Migration[5.0]
  def up
    drop_table :users
  end

  def down
    create_table "users", force: :cascade do |t|
      t.string   "email"
      t.string   "hashed_password"
      t.integer  "person_id"
      t.datetime "created_at",      null: false
      t.datetime "updated_at",      null: false
      t.index ["person_id"], name: "index_users_on_person_id"
    end
  end
end
