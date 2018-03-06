class DataImporter
  def self.import_countries
    csv_file = 'lib\csv_files\IP2LOCATION-COUNTRY-MULTILINGUAL.CSV'
    fields = [:langcode, :langname, :country_code, :country_code_bigger, 
              :country_number, :country_name]
    self.generic_import(csv_file, fields) do |params|
      #p params
      #params[:country_name] = params[:country_name][0..-2] #necessary hack, line endings or something
      if(params[:langcode]=="EN")
        country = Country.new
        country.code = params[:country_code]
        country.english_name_name = params[:country_name]
        country
      elsif(params[:langcode]=="FR")
        country = Country.find_by(code: params[:country_code])
        country.french_name_name = params[:country_name]
        country
      end
    end
  end

  def self.import_language_statuses
    csv_file = 'lib\csv_files\language_status.csv'
    fields = [:level, :label, :description]
    self.generic_import(csv_file, fields) do |params|
      LanguageStatus.new(params)
    end
  end

  def self.import_orgs
    csv_file = 'lib\csv_files\orgs.csv'
    #Field order: fmid, name, abbreviation, description, country
    unsaved_orgs = []
    File.open csv_file, 'r'do |f|
      while line = f.gets
        params = line[1..-2].split('","')
        unless org = Organization.find_by(fmid: params[0])
          org = Organization.new 
        end
        org.fmid = params[0]
        org.name = params[1]
        org.abbreviation = params[2]
        org.description = params[3]
        unless org.save
          unsaved_orgs << org.name
        end
      end
    end
    unsaved_orgs.each{|org| p "#{org} not saved"}
    'done'
  end

  def self.import_people 
    csv_file = 'lib\csv_files\people.csv'
    #Field order: email, first_name, last_name, fmid, 
    #organization_fmid, something else
    unsaved_people = []
    File.open csv_file, 'r' do |f|
      while line = f.gets
        params = line.gsub('"','').split(',')
        person = Person.new
        person.fmid = params[3]
        unless Person.find_by fmid: person.fmid
          person.email = params[0]
          person.first_name = params[1]
          person.last_name = params[2]
          org = Organization.find_by fmid: params[4]  #doesn't do anything...needs work
          unless person.save
            unsaved_people << person
          end
        end
      end
    end
    unsaved_people.each do |person|
      p "Failed to save #{person.first_name} #{person.last_name}, #{person.fmid}"
    end
  end

  def self.filter_duplicate_people
    duplicates = []
    Person.find_each do |person|
      if Person.where(first_name: person.first_name, last_name: person.last_name).size  > 1
        duplicates << "#{person.first_name} #{person.last_name}"
        person.destroy
      end
    end
    duplicates. each do |p|
      p "Destroyed: #{p}"
    end
  end

  def self.filter_out_orgs_from_people
    orgs = []
    Person.find_each do |person|
      if person.last_name.count(' ') > 2
        orgs << person.last_name
        person.destroy
      end
    end
    orgs.each{ |name| p name }
  end

  def self.camelcase_names
    Person.find_each do |person|
      if person.first_name.upcase == person.first_name
        n = person.first_name[0] + person.first_name[1..-1].downcase
        person.update first_name: n
      end
      if person.last_name.upcase == person.last_name
        n = person.last_name[0] + person.last_name[1..-1].downcase
        person.update last_name: n
      end
    end
  end

  def self.import_regions
    [ {english_name: 'Adamawa', french_name: 'Adamaoua'},
      {english_name: 'Centre', french_name: 'Centre'},
      {english_name: 'East', french_name: 'Est'},
      {english_name: 'Far North', french_name: 'Extrême-Nord'},
      {english_name: 'Littoral', french_name: 'Littoral'},
      {english_name: 'North', french_name: 'Nord'},
      {english_name: 'Northwest', french_name: 'Nord-Ouest'},
      {english_name: 'South', french_name: 'Sud'},
      {english_name: 'Southwest', french_name: 'Sud-Ouest'},
      {english_name: 'West', french_name: 'Ouest'}].each do |h|
        CameroonRegion.new(h).save
      end
  end

  def self.import_territories
    csv_file = 'lib\csv_files\territories.csv'
    fields = [:camerooregion_id, :name]
    self.generic_import(csv_file, fields) do |params|
      CameroonTerritory.new(params)
    end
  end

  def self.fix_end_quotes
    CameroonTerritory.all.each do |territory|
      territory.name.chomp!('"')
      territory.save
    end

    LanguageStatus.all.each do |status|
      status.description.chomp!('"')
      status.save
    end
  end

  def self.adjust_ls_id(id)
    case(id)
    when (1..6) 
      return id
    when (7..12)
      return id + 1
    when 13
      return id + 3
    end    
  end

  def self.strip_extra_quotes_langs
    Language.all.each do |lang|
      lang.population_description.gsub!('",,"', '')
      lang.save
    end
  end

  def self.update_language_statuses 
    csv_file = 'lib\csv_files\languages_with_statuses.csv'
    fields = [:name, :language_status_id]
    self.generic_import(csv_file, fields) do |params|
      lang = Language.find_by(name: params[:name])
      lang.language_status_id = params[:language_status_id]
      lang
    end
  end
  
  def self.import_languages
    csv_file = 'lib\csv_files\languages.csv'
    fields = [:fmid, :name, :category, :code, :language_status_id,
              :notes, :country_code, :international_language,
              :population, :population_description, :classification,
              :cameroon_region_id]
    self.generic_import(csv_file, fields) do |params|
      params[:language_status_id] = self.adjust_ls_id(params[:language_status_id])
      country = Country.find_by(code: params[:country_code])
      params[:country_id] = country.id if country
      params.delete(:country_code)
      Language.new(params)
    end
  end

  def self.generic_import(csv_file, fields)
    #CSV file must have all fields in double quotes, separated by commas with no double quotes in the data
    unsaved_items = []
    File.open(csv_file, 'r') do |file|
      while line = file.gets
        params = line[1..-3].split('","')
        params_hash = {}
        fields.each_index do |i|
          params_hash[fields[i]] = params[i]
        end
        item = yield(params_hash)  #instantiate item etc.
        unless item.save
          unsaved_items << item.to_s
        end
      end
    end
    unsaved_items.each{|item| p "Failed to save: #{item}"}
  end
end