class Person < ApplicationRecord
  SITE_ROLES = [:role_user, :role_program_responsable, :role_program_supervisor,
                :role_program_admin, :role_site_admin]

  belongs_to :organization, required: false
  belongs_to :country
  has_many :participants

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :gender, inclusion: { in: %w(M F)}

  def full_name
    "#{first_name} #{last_name}"
  end

  def full_name_rev
    "#{last_name}, #{first_name}"
  end

  def has_login
    SITE_ROLES.each do |role|
      return true if self.send(role)
    end
  end

  def current_participants
    participants.where(end_date: nil)
  end

  def self.roles_for_select(include_admin = false)
    roles = []
    ROLES.each_with_index do |role, i|
      roles << [I18n.t(role), i] unless(role==:admin && !include_admin)
    end
    roles
  end

  def self.search(query)
    people = Person.where("first_name || ' ' || last_name LIKE ?", "%#{query}%")
    results = []
    people.each do |person|
      subresults = []
      person.current_participants.each do |participant|
        subresults << {title: participant.program.name,
         path: Rails.application.routes.url_helpers.program_path(participant.program),
        description: I18n.t(participant.program_role.name)}
      end
      results << {title: person.full_name,
                  path: Rails.application.routes.url_helpers.person_path(person),
                  description: person.organization.name,
                  subresults: subresults}
    end
    results
  end

  private

  def has_role?(the_role)
    i = ROLES.index the_role
    raise "Invalid role provided to Person:has_role?" if i.nil?
    return role >= i
  end

end
