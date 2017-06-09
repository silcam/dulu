class RenameTranslationStagesToStages < ActiveRecord::Migration[5.0]
  def change
    rename_table :translation_stages, :stages
  end
end
