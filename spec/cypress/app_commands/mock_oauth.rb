# frozen_string_literal: true

email = command_options.try(:[], 'email') || 'drew_mambo@sil.org'

OmniAuth.config.test_mode = true
OmniAuth.config.add_mock(:google_oauth2, info: { email: email })
