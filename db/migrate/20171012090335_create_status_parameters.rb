class CreateStatusParameters < ActiveRecord::Migration[5.0]
  def change
    create_table :status_parameters do |t|
      t.string :domain
      t.string :prompt
      t.boolean :number_field
      t.string :number_unit
      t.timestamps
    end
  end
end
