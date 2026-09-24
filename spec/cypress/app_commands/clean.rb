# frozen_string_literal: true
# if defined?(DatabaseCleaner)
#   # cleaning the database using database_cleaner
#   DatabaseCleaner.strategy = :truncation
#   DatabaseCleaner.clean
# else
#   logger.warn "add database_cleaner or update clean_db"
#   Post.delete_all if defined?(Post)
# end

# Marker that log_fail.rb cuts on, so a failing test captures only its own portion of the
# Rails log rather than the last 10,000 lines of everything. It was commented out, which
# combined with log_fail.rb using a macOS-only `tail -r` meant failing tests captured
# nothing useful at all. See UPGRADE_PLAN.md Phase 2.
Rails.logger.info "APPCLEANED"
