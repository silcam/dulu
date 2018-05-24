class MigrateLanguageCountryData < ActiveRecord::Migration[5.1]
  def up
    Language.all.each do |language|
      if language.country_id
        q = "INSERT INTO countries_languages(country_id, language_id) 
             VALUES(#{language.country_id}, #{language.id});"
        ActiveRecord::Base.connection.exec_query(q)
      end

      if language.region_id
        q = "INSERT INTO languages_regions(language_id, region_id) 
             VALUES(#{language.id}, #{language.region_id});"
        ActiveRecord::Base.connection.exec_query(q)
      end
    end
  end

  def down
    ActiveRecord::Base.connection.exec_query("DELETE FROM countries_languages;")
    ActiveRecord::Base.connection.exec_query("DELETE FROM languages_regions;")
  end
end
