class Program < ApplicationRecord
  has_many :activities
  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
  has_many :publications
  has_many :participants
  has_many :domain_updates
  has_many :people, through: :participants
  has_and_belongs_to_many :events
  belongs_to :language

  def unassociated_people
    excludes = []
    self.people.each{ |p| excludes << "people.id!=#{p.id}" }
    where_clause = excludes.join(' AND ')
    Person.where(where_clause).order(:last_name, :first_name)
  end

  def name
    language.name
  end

  # Do we still use this?
  # def latest_update
  #   my_stages = Stage.joins(:activity).where(activities: {program: self})
  #   return nil if my_stages.empty?
  #   date = my_stages.first.f_start_date
  #   my_stages.each do |stage|
  #     stage_date = stage.f_start_date
  #     date = stage_date if stage_date.after? date
  #   end
  #   return date
  # end

  def current_participants
    participants.where(end_date: nil)
  end

  def current_people
    people.joins(:participants).where(participants: {end_date: nil})
  end

  def current_organizations
    orgs = []
    current_participants.each do |participant|
      org = participant.person.organization
      orgs << org unless(org.nil? || orgs.include?(org))
    end
    return orgs
  end

  def sorted_activities
    sorted_translation_activities
  end

  def sorted_translation_activities
    translation_activities.joins(:bible_book).order('bible_books.usfm_number')
  end

  def sorted_pubs(kind)
    publications.where(kind: kind).order('year DESC')
  end

  def is_translating?(book_id)
    translation_activities.where(bible_book_id: book_id).count > 0
  end

  # These methods may still be needed later, but I abandoned them when
  # I thought of events_as_hash
  #
  # def current_events
  #
  # end
  #
  # def upcoming_events
  #   self.events.where('start_date > ?', Date.today.to_s).order(:start_date)
  # end
  #
  # def past_events
  #   past = self.events.where('end_date < ?', Date.today.to_s).order(:start_date)
  #   today = FuzzyDate.today
  #   past.delete_if{ |event| event.f_end_date.coincident?(today)}
  #   past
  # end

  def events_as_hash
    Event.events_as_hash(self)
  end

  def percentages
    percents = {}
    translations = translation_activities.loaded? ? translation_activities :
                    translation_activities.includes([:bible_book, :stages => :stage_name]).where(stages: {current: true})
    translations.each do |translation|
      unless translation.stages.first.stage_name == StageName.first_translation_stage
        bible_book = translation.bible_book
        testament = bible_book.testament
        stage_name = translation.stages.first.stage_name.name
        percents[testament] ||= {}
        percents[testament][stage_name] ||= 0.0;
        percents[testament][stage_name] += bible_book.percent_of_testament
      end
    end
    percents
  end

  def self.percentages
    percentages = {}
    programs = Program.includes(:translation_activities => [:bible_book, :stages => :stage_name])
                      .where(stages: {current: true})
    programs.each do |program|
      percentages[program.id] = program.percentages()
    end
    percentages
  end

  def self.all_sorted
    Program.joins(:language).order('languages.name').includes(:language)
  end

  def self.all_sorted_by_recency
    Program.all.order('updated_at DESC').includes(:language)
  end

  def self.search(query)
    programs = Program.joins(:language).where("languages.name ILIKE ? OR languages.alt_names ILIKE ? OR languages.code=?", "%#{query}%", "%#{query}%", query).includes(:language)
    results = []
    programs.each do |program|
      path = Rails.application.routes.url_helpers.dashboard_program_path(program)
      description = "#{I18n.t(:Language_program)}"
      description += " - #{program.activities.count} #{I18n.t(:Activities).downcase}" if program.activities.count > 0
      results << {title: program.name, path: path,
                  description: description}
    end
    results
  end

  private


end
