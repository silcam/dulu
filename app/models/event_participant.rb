class EventParticipant < ApplicationRecord
  belongs_to :event
  belongs_to :person
  belongs_to :program_role
end
