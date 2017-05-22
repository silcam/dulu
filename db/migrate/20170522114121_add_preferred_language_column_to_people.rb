class AddPreferredLanguageColumnToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :ui_language, :string

    Person.all.each do |person|
      person.update ui_language: 'en'
    end
  end
end
