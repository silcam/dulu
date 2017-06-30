class Person < ApplicationRecord

  belongs_to :organization, required: false
  belongs_to :country
  has_many :participants


  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  # validates :fmid, uniqueness: true, allow_blank: true
  validates :gender, inclusion: { in: %w(M F)}

  def full_name
    "#{first_name} #{last_name}"
  end

  def full_name_rev
    "#{last_name}, #{first_name}"
  end

  def current_participants
    participants.where(end_date: nil)
  end
end
