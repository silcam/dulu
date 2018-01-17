class Workshop < ApplicationRecord
  belongs_to :linguistic_activity

  validates :number, numericality: {only_integer: true}
  validates :name, presence: true, allow_blank: false
end
