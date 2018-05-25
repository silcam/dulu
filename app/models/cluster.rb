class Cluster < ApplicationRecord
  include ClusterProgram
  include MultiWordSearch

  has_many :languages
  has_many :programs, through: :languages

  audited

  validates :name, presence: true, uniqueness: true

  default_scope { order(:name) }

  alias all_participants participants
  alias all_people people
  alias all_current_participants current_participants
  alias all_current_people current_people
  alias get_lpf lpf

  def display_name
    I18n.t(:Cluster_x, name: name)
  end

  def sorted_activities
    Activity.where(program_id: self.programs).order('program_id, type DESC, bible_book_id')
  end

  def sorted_translation_activities
    TranslationActivity.where(program_id: self.programs).joins(:bible_book).order('activities.program_id, bible_books.usfm_number')
  end

  def self.search(query)
    clusters = Cluster.multi_word_where(query, 'name')
    results = []
    clusters.each do |cluster|
      subresults = []
      cluster.programs.each do |program|
        subresults << {title: program.name,
                       model: program,
                       description: I18n.t(:Language_program)}
      end
      results << {title: I18n.t(:Cluster_x, name: cluster.name),
                  model: cluster,
                  subresults: subresults}
    end
    results
  end
end
