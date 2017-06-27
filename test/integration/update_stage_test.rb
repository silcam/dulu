require 'test_helper'

class UpdateStageTest < Capybara::Rails::TestCase
  def setup
    log_in(people(:Drew))
  end

  test 'update stage' do

    visit '/programs'
    assert_current_path '/programs'
  end
end