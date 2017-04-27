class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :hashed_password
      t.references :person, foreign_key: true
      
      t.timestamps
    end
  end
end
