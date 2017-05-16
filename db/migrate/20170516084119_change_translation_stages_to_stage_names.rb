class ChangeTranslationStagesToStageNames < ActiveRecord::Migration[5.0]
  def change
    rename_table :translation_stages, :stage_names
    rename_column :book_translation_stages, :translation_stage_id, :stage_name_id
  end
end
