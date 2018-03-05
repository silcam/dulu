# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer
class NotificationMailerPreview < ActionMailer::Preview

  def welcome
    new_user = Person.find_by(last_name: 'Maust')
    creator = Person.find_by(first_name: 'Rick', last_name: 'Conrad')
    NotificationMailer.welcome(new_user, creator)
  end

  def notify
    notification = Notification.last
    NotificationMailer.notify(notification)
  end

  def notification_summary
    person = Person.find(2437)
    NotificationMailer.notification_summary(person)
  end
end
