# Be sure to restart your server when you modify this file.

# The options are keyword arguments, not a positional hash. Ruby 3 stopped
# auto-converting a trailing hash into keywords, so wrapping these in braces
# raises `wrong number of arguments (given 2, expected 0..1)` at boot against
# Rails' `session_store(new_session_store = nil, **options)`.
Rails.application.config.session_store :cookie_store,
                                       key: "_dulu_session",
                                       expire_after: 7.days
