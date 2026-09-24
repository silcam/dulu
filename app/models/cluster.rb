class Cluster < ApplicationRecord
  include ClusterProgram
  include MultiWordSearch

  has_many :languages, dependent: :nullify

  audited

  validates :name, presence: true, uniqueness: true

  default_scope { order(:name) }

  alias all_participants participants
  alias all_people people
  alias all_current_participants current_participants
  alias all_current_people current_people
  alias get_region region

  def display_name
    I18n.t(:Cluster_x, name: name)
  end

  def sorted_activities
    Activity.where(language_id: self.languages).order("language_id, type DESC, bible_book_id")
  end

  def sorted_translation_activities
    TranslationActivity.where(language_id: self.languages).joins(:bible_book).order("activities.language_id, bible_books.usfm_number")
  end

  def self.search(query)
    Cluster.multi_word_where(query, "name").map do |cluster|
      { title: I18n.t(:Cluster_x, name: cluster.name), model: cluster }
    end
  end

  def self.basic_search(query)
    Cluster.where("unaccent(name) ILIKE unaccent(?)", "%#{query}%")
  end
end
