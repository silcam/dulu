namespace :recurring

task init: :environment do
  DailyEmailTask.schedule!
end
