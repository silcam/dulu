class CreateLanguageStatuses < ActiveRecord::Migration[5.0]
  def change
    create_table :language_statuses do |t|
      t.string :level
      t.string :label
      t.text :description

      t.timestamps
    end
  end
end
