namespace :recurring do

  desc 'Schedule the recurring delayed jobs'
  task :init do
    on roles(:app) do
      DailyEmailTask.schedule!
    end
  end
end
