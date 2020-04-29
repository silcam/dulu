# frozen_string_literal: true

class Docket < ApplicationRecord
  belongs_to :serial_event, class_name: 'Event', optional: true
  belongs_to :series_event, class_name: 'Event' 
end
