class Language < ApplicationRecord
  belongs_to :cluster, required: false
  belongs_to :language_status, required: false
  has_and_belongs_to_many :countries
  has_and_belongs_to_many :regions
  belongs_to :parent, class_name: 'Language', required: false
  has_one :program

  audited

  validates :name, presence: true, allow_blank: false
  validate :parent_cannot_be_dialect

  default_scope { order(:name) }

  scope :std_includes, -> { includes(:language_status, :countries, :regions, {program: :activities}) }

  def parent_cannot_be_dialect
    if parent.try(:is_dialect?)
      errors.add(:parent_id, 'Cannot add a dialect to a dialect')
    end
  end

  def is_dialect?
    not parent.nil?
  end

  def code_or_parent_code
    is_dialect? ? parent.code : code
  end

  def ethnologue_link
    return "https://www.ethnologue.com/language/#{code_or_parent_code}"
  end

  def alt_names_array
    alt_names.split(', ')
  end

  def update_name(new_name)
    update_alt_names(new_name)
    self.name = new_name
    self.save
  end

  def update_alt_names(new_name)
    new_alt_names = alt_names_array
    new_alt_names.delete(new_name)
    new_alt_names.append(name).sort!
    self.alt_names = new_alt_names.join(', ')
  end

  def self.search(query)
    Program.joins(:language).where("unaccent(languages.name) ILIKE unaccent(?)", "%#{query}%")
  end
end
