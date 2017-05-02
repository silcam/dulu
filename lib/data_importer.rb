class DataImporter

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
end