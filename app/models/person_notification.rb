# frozen_string_literal: true

class PersonNotification < ApplicationRecord
  belongs_to :notification
  belongs_to :person

  default_scope { order(id: :desc) }

  def unread
    !read
  end

  def email
    NotificationMailer.delay.notify(self) if person.email_pref == 'immediate'
  end
end
