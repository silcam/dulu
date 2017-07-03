class Organization < ApplicationRecord

  has_many :people

  validates :name, presence: true, allow_blank: false, uniqueness: true
  validates :fmid, uniqueness: true

  def self.all_in_order
    all.order(:name)
  end
end
