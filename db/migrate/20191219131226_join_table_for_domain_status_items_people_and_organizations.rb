# frozen_string_literal: true

class JoinTableForDomainStatusItemsPeopleAndOrganizations < ActiveRecord::Migration[5.1]
  def change
    create_table :domain_status_items_people do |t|
      t.references :person
      t.references :domain_status_item
    end

    create_table :domain_status_items_organizations do |t|
      t.references :organization
      t.references :domain_status_item, index: { name: :index_dsi_organizations_on_dsi_id }
    end
  end
end
