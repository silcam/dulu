class DomainUpdate < ApplicationRecord

  belongs_to :program, required: true, touch: true
  belongs_to :status_parameter, required: false

  audited associated_with: :program

  validates :number, numericality: true, allow_nil: true
  validates :date, presence: true
  validates :date, fuzzy_date: true
  validates :domain, inclusion: {in: StatusParameter.domains}
  validate :number_or_status

  default_scope { order('date DESC')}

  def f_date
    FuzzyDate.from_string date
  end

  def short_version
    s = ""
    if number
      s+= number_to_human(number) + ' ' + status_parameter.number_unit + ' '
    end
    s += status
    s
  end

  def previous
    DomainUpdate.where("program_id=? AND domain=? AND status_parameter_id=? AND date<?",
                       program.id,
                       domain,
                       status_parameter.id,
                       date)
                .first
  end

  private

  def number_or_status
    if status.blank? and number.nil?
      errors.add(:base, "Must provide a number, note or status")
    end
  end
end
