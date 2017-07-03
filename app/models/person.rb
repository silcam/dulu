class Person < ApplicationRecord
  ROLES = [:none, :user, :program_responsable, :program_supervisor, :admin]

  belongs_to :organization, required: false
  belongs_to :country
  has_many :participants

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  # validates :fmid, uniqueness: true, allow_blank: true
  validates :gender, inclusion: { in: %w(M F)}

  def full_name
    "#{first_name} #{last_name}"
  end

  def full_name_rev
    "#{last_name}, #{first_name}"
  end


  def is_admin?
    has_role? :admin
  end

  def is_program_supervisor?
    has_role? :program_supervisor
  end

  def is_program_responsable?
    has_role? :program_responsable
  end

  def is_user?
    has_role? :user
  end

  def has_login
    is_user?
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

  private

  def has_role?(the_role)
    i = ROLES.index the_role
    raise "Invalid role provided to Person:has_role?" if i.nil?
    return role >= i
  end

end
