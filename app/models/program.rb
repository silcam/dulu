class Program < ApplicationRecord
  has_many :activities
  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
  has_many :publications
  has_many :participants
  has_many :people, through: :participants
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

  def latest_update
    my_stages = Stage.joins(:activity).where(activities: {program: self})
    return nil if my_stages.empty?
    date = my_stages.first.f_start_date
    my_stages.each do |stage|
      stage_date = stage.f_start_date
      date = stage_date if stage_date.after? date
    end
    return date
  end

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
    translation_activities.joins(:bible_book).order('bible_books.usfm_number')
  end

  def sorted_pubs(kind)
    publications.where(kind: kind).order('year DESC')
  end

  def is_translating?(book_id)
    translation_activities.where(bible_book_id: book_id).count > 0
  end

  def self.all_sorted_by_recency
    programs_with_activity = Program.joins(activities: :stages)
                                 .order('stages.start_date DESC')
    programs_without_activity = Program.left_outer_joins(:activities)
                                    .where('activities.id IS NULL')
                                    .joins(:language)
                                    .order('languages.name')

    programs = []
    programs_with_activity.each{|pwa| programs << pwa unless programs.include? pwa}
    programs += programs_without_activity
  end

  def self.search(query)
    programs = Program.joins(:language).where("languages.name LIKE ?", "%#{query}%").includes(:language)
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
end
