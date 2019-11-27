class Language < ApplicationRecord
  include ClusterProgram

  belongs_to :cluster, required: false
  belongs_to :language_status, required: false
  has_and_belongs_to_many :countries
  has_and_belongs_to_many :country_regions
  belongs_to :parent, class_name: "Language", required: false
  # has_one :program

  has_many :activities
  has_many :translation_activities
  has_many :linguistic_activities
  has_many :media_activities
  has_many :bible_books, through: :translation_activities
  has_many :domain_status_items

  has_many :publications
  has_many :domain_updates

  audited

  validates :name, presence: true, allow_blank: false
  validate :parent_cannot_be_dialect

  default_scope { order(:name) }

  # scope :std_includes, -> { includes(:language_status, :countries, :regions, {program: :activities}) }

  def display_name
    name
  end

  def get_region
    region || cluster.try(:region)
  end

  def parent_cannot_be_dialect
    if parent.try(:is_dialect?)
      errors.add(:parent_id, "Cannot add a dialect to a dialect")
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
    alt_names.split(", ")
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
    self.alt_names = new_alt_names.join(", ")
  end

  def all_participants
    cluster.nil? ?
      participants :
      participants + cluster.participants
  end

  def all_people
    cluster.nil? ?
      people :
      people + cluster.people
  end

  def all_current_participants
    cluster.nil? ?
      current_participants :
      current_participants + cluster.current_participants
  end

  def all_current_people
    cluster.nil? ?
      current_people :
      current_people + cluster.current_people
  end

  def sorted_activities
    activities.order("type DESC, bible_book_id")
  end

  def sorted_translation_activities
    translation_activities.joins(:bible_book).order("bible_books.usfm_number")
  end

  def research_activities
    linguistic_activities.where(category: :Research)
  end

  def workshops_activities
    linguistic_activities.where(category: :Workshops)
  end

  def sorted_pubs(kind)
    publications.where(kind: kind).order("year DESC")
  end

  def is_translating?(book_id)
    translation_activities.where(bible_book_id: book_id).count > 0
  end

  def all_events
    cluster.nil? ?
      events :
      Event.left_outer_joins(:languages, :clusters)
      .where("events_languages.language_id=? or clusters_events.cluster_id=?", id, cluster.id)
  end

  def percentages
    percents = {}
    translations = translation_activities.loaded? ? translation_activities :
      translation_activities.includes([:bible_book, :stages]).where(stages: { current: true })
    translations.each do |translation|
      unless translation.stages.first.name == Stage.first_stage(:Translation)
        bible_book = translation.bible_book
        testament = bible_book.testament
        stage_name = translation.stages.first.name
        percents[testament] ||= {}
        percents[testament][stage_name] ||= 0.0
        percents[testament][stage_name] += bible_book.percent_of_testament
      end
    end
    percents
  end

  def self.percentages(languages = nil)
    percentages = {}
    unless languages
      languages = Language.includes(:translation_activities => [:bible_book, :stages])
        .where(stages: { current: true })
    end
    languages.each do |language|
      percentages[language.id] = language.percentages
    end
    percentages
  end

  def self.all_sorted_by_recency
    Language.all.unscope(:order).order("languages.updated_at DESC")
  end

  def self.basic_search(query)
    where("unaccent(name) ILIKE unaccent(?)", "%#{query}%")
  end

  def self.search(query)
    languages = where("unaccent(name) ILIKE unaccent(?) OR
                       unaccent(alt_names) ILIKE unaccent(?) OR 
                       code=?",
                      "%#{query}%", "%#{query}%", query)
    results = []
    languages.each do |language|
      description = "#{I18n.t(:Language_program)}"
      description += " - #{language.activities.count} #{I18n.t(:Activities).downcase}" if language.activities.count > 0
      results << { title: language.name,
                   model: language,
                   description: description }
    end
    results
  end
end
