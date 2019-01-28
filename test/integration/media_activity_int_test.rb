require 'test_helper'

class MediaActivityIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    log_in people(:Rick)
    @hdi = programs(:Hdi)
  end

  # test "Create Film Activity" do
  #   visit new_program_activity_path(@hdi)
  #   select 'Media', from: 'Type of Activity'
  #   find('select[data-media-category]').select 'Film'
  #   find('select#activity_film').select 'Genesis Film'
  #   click_on 'Save'
  #   assert_current_path program_path(@hdi)
  #   find('#media-activities-table').assert_text 'Genesis Film'
  # end

  # test "Create Audio New Testament" do
  #   visit new_program_activity_path(@hdi)
  #   select 'Media', from: 'Type of Activity'
  #   find('select[data-media-category]').select 'Audio Scripture'
  #   find('select#activity_scripture').select 'New Testament'
  #   click_on 'Save'
  #   assert_current_path program_path(@hdi)
  #   find('#media-activities-table').assert_text 'Audio New Testament'
  # end

  # test "Create Audio John" do
  #   visit new_program_activity_path(@hdi)
  #   select 'Media', from: 'Type of Activity'
  #   find('select[data-media-category]').select 'Audio Scripture'
  #   find('select#activity_scripture').select 'Other'
  #   check 'John'
  #   click_on 'Save'
  #   assert_current_path program_path(@hdi)
  #   find('#media-activities-table').click_link('Audio Scripture')
  #   find('h2').assert_text 'John'
  # end
end