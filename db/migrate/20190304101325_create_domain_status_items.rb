class CreateDomainStatusItems < ActiveRecord::Migration[5.1]
  def change
    create_table :domain_status_items do |t|
      t.string :category
      t.string :subcategory
      t.integer :year
      t.string :platforms
      t.references :language
      t.integer :creator_id
      t.references :organization
      t.references :person
    end

    create_join_table :bible_books, :domain_status_items
  end
end
