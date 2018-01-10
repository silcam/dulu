require 'test_helper'

class OrganizationPermissionTest < Capybara::Rails::TestCase
  def setup
    @drew = people :Drew
  end

  test "Drew can't add an organization" do
    log_in @drew
    visit organizations_path
    refute page.has_content?('Add Organization'),
           "Drew shouldn't see Add Organization button"
    visit new_organization_path
    assert_current_path not_allowed_path
  end
end