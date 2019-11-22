# frozen_string_literal: true

class NotificationMailer < ApplicationMailer
  helper ApplicationHelper
  default from: Rails.application.secrets.gmail_username

  def welcome(person, creator)
    @person = person
    @creator = creator
    set_locale person
    mail to: to_field(person), subject: I18n.t('email.welcome.welcome')
  end

  def notify(person_notification)
    @person = person_notification.person
    @notification = person_notification.notification
    if should_email(@person)
      set_locale @person
      mail to: to_field(@person), subject: I18n.t('email.notify.subject')
      person_notification.update(emailed: true)
    end
  end

  def notification_summary(person)
    p_notifications = person.person_notifications.where(read: false, emailed: false)
    @person = person
    @notifications = p_notifications.map(&:notification)
    if should_email(person) && !p_notifications.empty?
      set_locale(person)
      mail to: to_field(person), subject: I18n.t('email.notification_summary.subject')
      p_notifications.update(emailed: true)
    end
  end

  private

  def set_locale(person)
    @locale = person.try(:ui_language) || I18n.default_locale
  end

  def to_field(person)
    %("#{person.full_name}" <#{person.email}>)
  end

  def should_email(person)
    person.has_login && !person.email.blank?
  end
end
