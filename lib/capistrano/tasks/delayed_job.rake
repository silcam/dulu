namespace :delayed_job do
  desc "Restart the delayed_job process"
  task :restart do
    on roles(:app) do
      within release_path do
        execute *%w[RAILS_ENV=production $HOME/.rbenv/bin/rbenv exec ruby ./bin/delayed_job restart]
      end
    end
  end
end
