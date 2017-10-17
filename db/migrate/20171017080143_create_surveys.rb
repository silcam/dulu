class CreateSurveys < ActiveRecord::Migration[5.0]
  def change
    create_table :surveys do |t|
      t.string :name
      t.timestamps
    end

    create_table :programs_surveys do |t|
      t.references :program
      t.references :survey
    end

    create_table :status_parameters_surveys do |t|
      t.references :status_parameter
      t.references :survey
    end
  end
end
