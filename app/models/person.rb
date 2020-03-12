# frozen_string_literal: true

class Person < ApplicationRecord
  include HasRoles
  include MultiWordSearch

  belongs_to :country, required: false, counter_cache: true

  has_many :organization_people
  has_many :organizations, through: :organization_people

  has_many :participants, dependent: :destroy
  has_many :languages, through: :participants

  has_many :person_roles, dependent: :destroy

  has_many :event_participants, dependent: :destroy
  has_many :events, through: :event_participants

  has_many :viewed_reports
  has_many :reports, through: :viewed_reports

  has_many :person_notifications
  has_many :notifications, through: :person_notifications
  has_many :created_notifications, class_name: 'Notification', foreign_key: :creator_id

  has_many :regions

  has_many :notes

  audited

  validates :last_name, presence: true, allow_blank: false
  validates :first_name, presence: true, allow_blank: false
  validates :gender, inclusion: { in: %w[M F] }, allow_blank: true
  validates :email, uniqueness: true, allow_blank: true

  default_scope { order(:last_name, :first_name) }

  before_save :normalize_name_email

  enum email_pref: %i[immediate daily weekly]

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
      person_roles.find_by(role: role, end_date: nil).try(:update, end_date: Date.today)
      remove_from_roles_field(role)
    end
  end

  def add_notification_channel(channel)
    update!(
      notification_channels: NotificationChannel.add_channel(notification_channels, channel)
    )
  end

  def remove_notification_channel(channel)
    update!(
      notification_channels: NotificationChannel.remove_channel(notification_channels, channel)
    )
  end

  def current_participants
    participants.where("end_date IS NULL OR end_date=''")
  end

  def current_languages
    languages = []
    current_participants.each do |participant|
      if participant.language
        languages << participant.language
      else
        languages += participant.cluster.languages
      end
    end
    languages
  end

  def to_hash
    roles = self.roles.collect { |r| { role: r, t_role: I18n.t(r) } }
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
        subresults << { title: participant.cluster_language.display_name,
                        model: participant.cluster_language,
                        description: participant.roles_text }
      end
      results << { title: person.name,
                   model: person,
                   description: person.roles_text,
                   subresults: subresults }
    end
    results
  end

  def self.basic_search(query)
    Person.multi_word_where(query, 'first_name', 'last_name')
  end

  private

  def normalize_name_email
    self.first_name = fix_caps(first_name).strip
    self.last_name = fix_caps(last_name).strip
    email&.strip!
  end

  def fix_caps(text)
    return text unless text

    text = text[0].upcase + text[1..-1].downcase if text == text.upcase || text == text.downcase
    text
  end
end
