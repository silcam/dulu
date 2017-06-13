class Program < ApplicationRecord

  #TODO - Fix here when we add support for other types of activities
  has_many :translation_activities
  has_many :bible_books, through: :translation_activities
  has_many :pers_prog_rels
  has_many :people, through: :pers_prog_rels
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

  def current_pers_prog_rels
    pers_prog_rels.where(end_date: nil)
  end

  def sorted_activities
    translation_activities.order :bible_book_id
  end
end
