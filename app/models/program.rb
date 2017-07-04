class Program < ApplicationRecord
  has_many :activities
  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
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
end
