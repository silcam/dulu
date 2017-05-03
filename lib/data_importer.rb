class DataImporter
  
  def self.import_language_statuses
    csv_file = 'lib\csv_files\language_status.csv'
    fields = [:level, :label, :description]
    self.generic_import(csv_file, fields) do |params|
      langstat = LanguageStatus.new(params)
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
          org = Organization.find_by fmid: params[4]
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

  private
    def self.generic_import(csv_file, fields)
      #CSV file must have all fields in double quotes, separated by commas with no double quotes in the data
      unsaved_items = []
      File.open(csv_file, 'r') do |file|
        while line = file.gets
          params = line[1..-2].split('","')
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