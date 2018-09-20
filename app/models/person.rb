class Person < ApplicationRecord
  include HasRoles
  include MultiWordSearch

  belongs_to :country, required: false, counter_cache: true

  has_many :organization_people
  has_many :organizations, through: :organization_people

  has_many :participants, dependent: :destroy
  has_many :programs, through: :participants

  has_many :person_roles, dependent: :destroy

  has_many :event_participants, dependent: :destroy
  has_many :events, through: :event_participants

  has_many :viewed_reports
  has_many :reports, through: :viewed_reports

  has_many :notifications
  has_many :lpfs

  audited

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :gender, inclusion: { in: %w(M F)}
  validates :email, uniqueness: true, allow_blank: true

  default_scope{ order('LOWER(last_name) ASC', 'LOWER(first_name) ASC', 'id ASC') }

  before_validation :normalize_name

  enum email_pref: [:immediate, :daily, :weekly]

  def full_name
    "#{first_name} #{last_name}"
  end
  alias name full_name

  def full_name_rev
    "#{last_name}, #{first_name}"
  end

  def current_orgs
    organization_people.current.map(&:organization)
  end

  def add_role(new_role)
    transaction do
      person_roles.create(role: new_role, start_date: Date.today)
      add_to_roles_field(new_role)
    end
  end

  def remove_role(role)
    transaction do
      person_roles.find_by(role: role, end_date: nil).try(:update, {end_date: Date.today})
      remove_from_roles_field(role)
    end
  end

  def current_participants
    participants.where("end_date IS NULL OR end_date=''")
  end

  def current_programs
    programs = []
    current_participants.each do |participant|
      if participant.program
        programs << participant.program
      else
        programs += participant.cluster.programs
      end
    end
    programs
  end

  def to_hash
    roles = self.roles.collect{ |r| {role: r, t_role: I18n.t(r)}}
    {
        id: id,
        first_name: first_name,
        last_name: last_name,
        roles: roles
    }
  end

  def self.search(query)
    people = Person.multi_word_where(query, 'first_name', 'last_name')
    results = []
    people.each do |person|
      subresults = []
      person.current_participants.each do |participant|
        subresults << {title: participant.cluster_program.display_name,
                       model: participant.cluster_program,
                       description: participant.roles_text}
      end
      results << {title: person.name,
                  model: person,
                  description: person.roles_text,
                  subresults: subresults}
    end
    results
  end

  private

  def normalize_name
    self.first_name = fix_caps(self.first_name)
    self.last_name = fix_caps(self.last_name)
  end

  def fix_caps(text)
    return text unless text
    if text == text.upcase || text == text.downcase
      text = text[0].upcase + text[1..-1].downcase
    end
    text
  end
end
