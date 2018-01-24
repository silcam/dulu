class Person < ApplicationRecord
  include HasRoles

  belongs_to :organization, required: false
  belongs_to :country, required: false, counter_cache: true
  has_many :participants, dependent: :destroy
  has_many :programs, through: :participants
  has_many :person_roles, dependent: :destroy

  audited

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :gender, inclusion: { in: %w(M F)}
  validates :email, uniqueness: true, allow_blank: true

  default_scope{ order(:last_name, :first_name) }

  def full_name
    "#{first_name} #{last_name}"
  end
  alias name full_name

  def full_name_rev
    "#{last_name}, #{first_name}"
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
    participants.where(end_date: nil)
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
    people = Person.where("first_name || ' ' || last_name ILIKE ?", "%#{query}%")
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
                  description: person.organization.try(:name),
                  subresults: subresults}
    end
    results
  end

end
