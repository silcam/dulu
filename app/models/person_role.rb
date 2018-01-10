class PersonRole < ApplicationRecord

  belongs_to :person, required: true

  validates :role, :start_date, presence: {allow_blank: false}

  def self.current
    where end_date: nil
  end
end
