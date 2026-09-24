# frozen_string_literal: true

require 'test_helper'

# Asserts the shape of routes that have been deliberately removed. There is a
# catch-all (`get '*route', to: 'web#index'`) at the bottom of routes.rb, so a
# deleted API path does not 404 -- it falls through to the SPA shell and returns
# 200 HTML. That is worth pinning down: an XHR to a dead endpoint gets a 200 of
# HTML, which DuluAxios cannot distinguish from real data.
class RemovedRoutesTest < ActionDispatch::IntegrationTest
  # Api::PermissionsController#check took `params[:type].constantize`.
  # Deleted rather than allowlisted: it had no callers. See UPGRADE_PLAN 8a.1.
  test 'the permissions check endpoint is gone' do
    assert_raises(NameError) { Api::PermissionsController }

    route = Rails.application.routes.recognize_path('/api/permissions/check',
                                                    method: :get)
    assert_equal %w[web index], route.values_at(:controller, :action),
                 'expected the path to fall through to the SPA catch-all'
  end
end
