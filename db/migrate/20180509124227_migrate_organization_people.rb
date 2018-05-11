class MigrateOrganizationPeople < ActiveRecord::Migration[5.1]
  def up
    # Organization.all.each do |org|
    #   org.people.each do |person|
    #     OrganizationPerson.create!(person: person, organization: org)
    #   end
    # end
    Person.all.each do |person|
      org = Organization.find_by(id: person.organization_id)
      if org
        OrganizationPerson.create!(person: person, organization: org)
      end
    end
  end
end
