class EventParticipant < ApplicationRecord
  include HasRoles

  belongs_to :event, required: true
  belongs_to :person, required: true
  belongs_to :program_role, required: false

  audited associated_with: :event

  def full_name
    person.full_name
  end

  def self.build(event, person_params)
    create! event: event, person_id: person_params[:id], roles_field: make_roles_field(person_params[:roles])
  end
end
