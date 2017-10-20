class Publication < ApplicationRecord
  belongs_to :program, touch: true, required: false

  def self.kinds
    %w[Scripture Linguistic NLPub Media]
  end

  def self.media_kinds
    %w[Audio Video App]
  end

  validates :kind, inclusion: {in: Publication.kinds}
  validates :media_kind, inclusion: {in: Publication.media_kinds}, allow_blank: true
  validates :year, numericality: {only_integer: true, greater_than: 0, less_than: 10000, allow_nil: true}
  validate :has_a_name

  # Primary intl lang is first choice, nl is second
  def name
    n = I18n.locale==:fr ? french_name : english_name
    n = nl_name if n.blank?
    n = I18n.locale==:fr ? english_name : french_name if n.blank?
    n
  end

  def nl_name_or_name
    nl_name.blank? ? name : nl_name
  end

  def names(options={})
    names = []
    intl_lang_1 = I18n.locale==:fr ? french_name : english_name
    intl_lang_2 = I18n.locale==:fr ? english_name : french_name

    first = options[:prefer_nl] ? nl_name : intl_lang_1
    names << first unless first.blank?

    second = options[:prefer_nl] ? intl_lang_1 : nl_name
    names << second unless second.blank?

    names << intl_lang_2 unless intl_lang_2.blank?

    names
  end

  private

  def has_a_name
    if english_name.blank? && french_name.blank? && nl_name.blank?
      errors.add(:base, "Publication must have a name")
    end
  end
end
