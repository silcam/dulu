namespace :delayed_job do
  desc "Restart the delayed_job process"
  task :restart do
    on roles(:app) do
      execute :sudo, "-n", :systemctl, :restart, "delayed-job"
    end
  end
end
