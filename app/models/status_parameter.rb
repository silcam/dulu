class StatusParameter < ApplicationRecord

  has_many :domain_updates

  def self.domains
    %w[Literacy Scripture_use Mobilization Ethnomusicology Anthropology Community_development Translation Linguistics Media]
  end

  validates :prompt, presence: true, allow_blank: false
  validates :domain, inclusion: {in: domains}
  validate :number_unit_if_number_field

  def self.other_parameter(domain)
    StatusParameter.new(domain: domain, prompt: 'Other')
  end

  private

  def number_unit_if_number_field
    if number_field and number_unit.blank?
      errors.add :number_unit, "can't be blank if a number is requested."
    end
  end
end
