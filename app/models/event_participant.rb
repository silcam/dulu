class EventParticipant < ApplicationRecord
  belongs_to :event, required: true
  belongs_to :person, required: true
  belongs_to :program_role, required: false

  audited associated_with: :event
end
