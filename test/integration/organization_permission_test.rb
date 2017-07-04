require 'test_helper'

class OrganizationPermissionTest < Capybara::Rails::TestCase
  def setup
    @olga = people :Olga
  end

  test "Olga can't add an organization" do
    log_in @olga
    visit organizations_path
    refute page.has_content?('Add Organization'),
           "Olga shouldn't see Add Organization button"
    visit new_organization_path
    assert_current_path not_allowed_path
  end
end