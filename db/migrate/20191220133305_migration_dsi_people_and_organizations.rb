class MigrationDsiPeopleAndOrganizations < ActiveRecord::Migration[5.1]
  def up
    DomainStatusItem.where.not(person_id: nil).each do |dsi|
      dsi.people << Person.find(dsi.person_id)
    end

    DomainStatusItem.where.not(organization_id: nil).each do |dsi|
      dsi.organizations << Organization.find(dsi.organization_id)
    end
  end

  def down
    # Do nothing
  end
end
