class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.references :language
      t.boolean :is_active
      
      t.timestamps
    end
  end
end
