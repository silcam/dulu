# frozen_string_literal: true

class Participant < ApplicationRecord
  include HasRoles

  belongs_to :person, required: true
  belongs_to :language, required: false
  belongs_to :cluster, required: false
  has_and_belongs_to_many :activities

  audited associated_with: :language

  validates :start_date, :end_date, fuzzy_date: true
  validates :start_date, presence: true, allow_blank: false
  validate :belongs_to_language_or_cluster
  # validate :end_date_after_start_date

  after_create do |participant|
    if participant.language_id
      participant.person.add_notification_channel(
        NotificationChannel.language_channel(participant.language_id)
      )
    else
      participant.person.add_notification_channel(
        NotificationChannel.cluster_channel(participant.cluster_id)
      )
    end
  end

  def cluster_language
    language || cluster
  end

  def associate_activities(activity_ids)
    activity_ids ||= []
    self.activities = Activity.where(id: activity_ids)
  end

  def full_name
    person.full_name
  end

  def full_name_rev
    person.full_name_rev
  end

  def domains
    roles.map { |role| Role.domain(role) }.uniq.reject(&:nil?)
  end

  def f_start_date
    FuzzyDate.from_string(start_date)
  end

  def f_end_date
    return nil if end_date.blank?
    
    FuzzyDate.from_string(end_date)
  end

  def sorted_activities
    activities.order(
      'activities.language_id, activities.type, bible_book_id'
    )
  end

  def unassoc_activities
    cluster_language.sorted_activities.where.not(id: activities)
  end

  private

  def belongs_to_language_or_cluster
    if cluster.nil? && language.nil?
      errors.add :base, 'Person must be associated with a language or a cluster'
    end
  end

  # def end_date_after_start_date
  #   begin
  #     if end_date and f_end_date.before? f_start_date
  #       errors.add :end_date, I18n.t(:not_before_start)
  #     end
  #   rescue FuzzyDateException => e
  #     # This will fail Fuzzy Date validation
  #   end
  # end
end
