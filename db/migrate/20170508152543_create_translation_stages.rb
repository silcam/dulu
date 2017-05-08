class CreateTranslationStages < ActiveRecord::Migration[5.0]
  def change
    create_table :translation_stages do |t|
      t.string :name
    end
  end
end
