if Rails.env == 'production'
  DailyEmailTask.schedule!
end