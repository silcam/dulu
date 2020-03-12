# frozen_string_literal: true

class DsiLocation < ApplicationRecord
  has_many :domain_status_items
  default_scope { order(:name) }
end
