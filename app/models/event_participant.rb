class EventParticipant < ApplicationRecord
  belongs_to :event, required: true
  belongs_to :person, required: true
  belongs_to :program_role, required: false

  audited associated_with: :event

  def full_name
    person.full_name
  end

  def roles
    Role.roles_from_field roles_field
  end

  def add_role(new_role)
    update roles_field: Role.roles_field_with(roles_field, new_role)
  end

  def remove_role(role)
    update roles_field: Role.roles_field_without(roles_field, role)
  end

  def self.build(event, person_params)
    create! event: event, person_id: person_params[:id], roles_field: Role.roles_field(person_params[:roles])
  end
end
