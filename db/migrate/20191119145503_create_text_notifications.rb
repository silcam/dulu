class CreateTextNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :text_notifications do |t|
      t.string :english, default: ""
      t.string :french, default: ""
      t.timestamps
    end
  end
end
