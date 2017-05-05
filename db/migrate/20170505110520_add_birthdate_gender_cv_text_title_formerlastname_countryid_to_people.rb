class AddBirthdateGenderCvTextTitleFormerlastnameCountryidToPeople < ActiveRecord::Migration[5.0]
  def change
    add_column :people, :birth_date, :date
    add_column :people, :gender, :string, limit: 1
    add_column :people, :cv_text, :text
    add_column :people, :former_last_name, :string 
    add_reference :people, :country
  end
end
