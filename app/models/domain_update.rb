class DomainUpdate < ApplicationRecord

  belongs_to :program
  belongs_to :status_parameter, required: false

  validates :number, numericality: true, allow_nil: true
  validates :date, presence: true
  validates :date, fuzzy_date: true
  validate :number_or_status

  default_scope { order('date DESC')}

  def f_date
    FuzzyDate.from_string date
  end

  def short_version
    s = ""
    if number
      s+= number.to_s + ' ' + status_parameter.number_unit + ' '
    end
    s += status
    s
  end

  private

  def number_or_status
    if status.blank? and number.nil?
      errors.add(:status, "can't be blank")
    end
  end
end
