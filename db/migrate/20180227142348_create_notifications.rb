class CreateNotifications < ActiveRecord::Migration[5.0]
  def change
    create_table :notifications do |t|
      t.references :person
      t.string :kind
      t.json :details_json
      t.string :link
      t.string :assoc_class
      t.integer :assoc_model_id
      t.boolean :read, default: false

      t.timestamps
    end
  end
end
