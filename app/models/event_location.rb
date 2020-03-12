# frozen_string_literal: true

class EventLocation < ApplicationRecord
  has_many :events
  default_scope { order(:name) }
end
