class Publication < ApplicationRecord
  belongs_to :program, touch: true, required: false

  def self.kinds
    %w[Scripture Linguistic NLPub Media]
  end

  validates :kind, inclusion: {in: Publication.kinds}
  validates :year, numericality: {only_integer: true, greater_than: 0, less_than: 10000, allow_nil: true}
  validate :has_a_name

  def name
    n = I18n.locale==:fr ? french_name : english_name
    n = nl_name if n.blank?
    n = I18n.locale==:fr ? english_name : french_name if n.blank?
    n
  end

  def nl_name_or_name
    nl_name.blank? ? name : nl_name
  end

  private

  def has_a_name
    if english_name.blank? && french_name.blank? && nl_name.blank?
      errors.add(:base, "Publication must have a name")
    end
  end
end
