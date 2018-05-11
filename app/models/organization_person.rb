class OrganizationPerson < ApplicationRecord
  belongs_to :organization, required: true
  belongs_to :person, required: true

  def f_start_date
    FuzzyDate.from_string(start_date)
  end

  def f_end_date
    FuzzyDate.from_string(end_date)
  end

  def self.current
    where("end_date IS NULL OR end_date=''")
  end
end
