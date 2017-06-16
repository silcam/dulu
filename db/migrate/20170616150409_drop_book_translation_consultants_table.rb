class DropBookTranslationConsultantsTable < ActiveRecord::Migration[5.0]
  def up
    drop_table :book_translation_consultants
  end

  def down
    create_table :book_translation_consultants do |t|
      t.references :activity
      t.references :person
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
