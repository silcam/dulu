class CreatePersonTextNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :person_text_notifications do |t|
      t.references :person
      t.references :text_notification
      t.boolean :read, default: false
      t.boolean :emailed, default: false
      t.timestamps
    end
  end
end
