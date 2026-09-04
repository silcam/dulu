# frozen_string_literal: true

require 'test_helper'

class ErrorMailerTest < ActionMailer::TestCase
  # ErrorMailer's whole addressing -- both to and from -- is the admin address,
  # which used to be Rails.application.secrets.admin_email. That is removed in
  # Rails 7.1, and a nil here would send the report to nobody without raising.
  test 'error report is addressed from and to the configured admin address' do
    admin = Rails.application.config.x.admin_email
    refute_nil admin

    email = ErrorMailer.error_report('boom')
    assert_equal [admin], email.to
    assert_equal [admin], email.from
    assert_equal 'Dulu Javascript Error', email.subject
    assert_includes email.body.to_s, 'boom'
  end
end
