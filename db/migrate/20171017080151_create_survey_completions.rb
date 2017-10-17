class CreateSurveyCompletions < ActiveRecord::Migration[5.0]
  def change
    create_table :survey_completions do |t|
      t.references :survey
      t.references :program
      t.references :person
      t.timestamps
    end
  end
end
