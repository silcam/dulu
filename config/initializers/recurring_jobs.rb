# Deferred to after_initialize rather than run at initializer time. Referencing
# an autoloadable constant (DailyEmailTask lives in app/interactors) while
# initializers are still running was deprecated in Rails 6 and is a hard error
# in 7.1 -- it raised `uninitialized constant DailyEmailTask` on every
# production boot, including `assets:precompile`.
#
# after_initialize runs once, after eager loading, which preserves the previous
# behaviour exactly: production schedules the recurring job on boot.
Rails.application.config.after_initialize do
  DailyEmailTask.schedule! if Rails.env.production?
end
