require 'test_helper'

class UpdateStageTest < Capybara::Rails::TestCase
  def setup
    log_in(people(:Drew))
    @activity = translation_activities(:HdiEzraActivity)
  end

  test 'update stage' do

    visit translation_activity_path(@activity)
    click_button 'Update'
    click_button 'Save'
    assert_equal(stage_names(:ConsultantCheck),
                @activity.current_stage.stage_name)
  end
end