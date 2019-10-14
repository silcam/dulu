class DailyEmailTask
  include Delayed::RecurringJob
  run_every 1.day
  run_at "12:12am"
  timezone "UTC"

  def perform
    if Date.today.monday?
      people = Person.where(email_pref: [:daily, :weekly])
    else
      people = Person.where(email_pref: :daily)
    end

    people.each do |person|
      NotificationMailer.delay.notification_summary(person)
    end
  end
end
