class NotificationMailer < ApplicationMailer
  default from: 'dulu@dulu.sil.org', reply_to: 'programmer_cameroon@sil.org '

  def welcome(person, creator)
    @person = person
    @creator = creator
    mail(to: %("#{@person.full_name}" <#{@person.email}>), subject: 'Welcome to Dulu')
  end
end
