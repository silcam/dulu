# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer
class NotificationMailerPreview < ActionMailer::Preview

  def welcome
    new_user = Person.find_by(last_name: 'Maust')
    creator = Person.find_by(first_name: 'Rick', last_name: 'Conrad')
    NotificationMailer.welcome(new_user, creator)
  end
end
