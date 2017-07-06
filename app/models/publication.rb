class Publication < ApplicationRecord
  belongs_to :program, required: false

  validates :kind, inclusion: {in: %w[Bible Linguistic NLPub Media]}
  validates_each :english_name do |publication, attr, english_name|
    if(english_name.blank? && publication.french_name.blank? && publication.nl_name.blank?)
      publication.errors.add(attr, "Publication must have a name")
    end
  end

  def name
    n = I18n.locale==:fr ? french_name : english_name
    n = nl_name if n.blank?
    n = I18n.locale==:fr ? english_name : french_name if n.blank?
    n
  end

  def nl_name_or_name
    nl_name.blank? ? name : nl_name
  end
end
