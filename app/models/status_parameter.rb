class StatusParameter < ApplicationRecord
  has_many :domain_updates

  default_scope { order(:order) }

  validates :prompt, presence: true, allow_blank: false
  validates :domain, inclusion: { in: Domain.domains }
  validate :number_unit_if_number_field

  def self.other_parameter(domain)
    StatusParameter.new(domain: domain, prompt: "Other")
  end
  #
  # def self.parameters_with_other(domain)
  #   StatusParameter.where(domain: domain).to_a.push(other_parameter(domain))
  # end

  def self.sorted_domains
    Domain.domains.sort { |a, b| I18n.t(a) <=> I18n.t(b) }
  end

  private

  def number_unit_if_number_field
    if number_field and number_unit.blank?
      errors.add :number_unit, "can't be blank if a number is requested."
    end
  end
end
