class CreateResearchPermits < ActiveRecord::Migration[5.0]
  def change
    create_table :research_permits do |t|
      t.belongs_to :person
      t.belongs_to :language
      t.date :proposal_date
      t.date :issue_date
      t.date :expiration_date
      t.string :permit_number
      t.text :description

      t.timestamps
    end
  end
end
