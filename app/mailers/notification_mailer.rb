class NotificationMailer < ApplicationMailer
  default from: ENV['GMAIL_USERNAME']

  def welcome(person, creator)
    @person = person
    @creator = creator
    mail(to: %("#{@person.full_name}" <#{@person.email}>), subject: 'Welcome to Dulu')
  end
end
