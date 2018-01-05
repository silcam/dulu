class Person < ApplicationRecord

  belongs_to :organization, required: false
  belongs_to :country, required: false, counter_cache: true
  has_many :participants
  has_many :programs, through: :participants
  has_many :person_roles

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

  def roles
    Role.roles_from_field(roles_field)
  end

  def program_roles
    Role.program_roles(roles)
  end

  def roles_text
    Role.roles_text roles_field
  end

  def add_role(new_role)
    transaction do
      person_roles.create(role: new_role, start_date: Date.today)
      update(roles_field: Role.roles_field_with(roles_field, new_role))
    end
  end

  def remove_role(role)
    transaction do
      person_roles.find_by(role: role, end_date: nil).try(:update, {end_date: Date.today})
      update(roles_field: Role.roles_field_without(roles_field, role))
    end
  end

  def has_role?(role)
    roles.include? role.to_sym
  end

  def has_role_among?(roles)
    Role.roles_overlap?(self.roles, roles)
  end

  # def has_program_role?
  #   Role.has_a_program_role? self
  # end

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
