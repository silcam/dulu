class Publication < ApplicationRecord
  include MultiWordSearch

  belongs_to :program, touch: true, required: false

  audited associated_with: :program

  default_scope{ order(:year, :created_at)}

  def self.kinds
    %w[Scripture Linguistic NLPub Media Literacy]
  end

  def self.media_kinds
    %w[AudioScripture Audio Video App]
  end

  def self.film_kinds
    %w[JesusFilm LukeFilm Other]
  end

  def self.scripture_kinds
    %w[Bible New_testament Old_testament Portions]
  end

  validates :kind, inclusion: {in: Publication.kinds}
  validates :media_kind, inclusion: {in: Publication.media_kinds}, allow_blank: true
  validates :scripture_kind, inclusion: {in: Publication.scripture_kinds}, allow_blank: true
  # validates :film_kind, inclusion: {in: Publication.film_kinds}, allow_blank: true
  validates :year, numericality: {only_integer: true, greater_than: 0, less_than: 10000, allow_nil: true}
  validate :has_a_name

  # Intl languages are first choices
  def name
    name_priorities.each do |method|
      n = send(method)
      return n unless n.blank?
    end
  end

  def nl_name_or_name
    nl_name.blank? ? name : nl_name
  end

  def names
    names = name_priorities.collect{ |method| send(method) }
    names.delete_if{ |n| n.blank? }
  end

  def self.search(query)
    pubs = Publication.multi_word_where(query, 'english_name', 'french_name', 'nl_name').includes(:program)
    results = []
    pubs.each do |pub|
      title = "#{pub.name} : #{pub.program.name}"
      description = I18n.t(pub.kind)
      description += ' - ' + pub.year.to_s if pub.year
      results << {title: title, description: description, model: pub}
    end
    results
  end

  private

  def has_a_name
    if english_name.blank? && french_name.blank? && nl_name.blank?
      errors.add(:base, "Publication must have a name")
    end
  end

  def name_priorities
    I18n.locale==:en ?
        [:english_name, :french_name, :nl_name] :
        [:french_name, :english_name, :nl_name]
  end
end
