class AddPeopleCountColumnToCountries < ActiveRecord::Migration[5.0]
  def up
    add_column :countries, :people_count, :integer
    Country.all.each do |country|
      Country.reset_counters country.id, :people
    end
  end

  def down
    remove_column :countries, :people_count
  end
end
