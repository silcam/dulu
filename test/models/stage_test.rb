require 'test_helper'

class StageTest < ActiveSupport::TestCase
  def setup
    @hdi_drafting = stages :HdiTwo
    @hdi_ezra = translation_activities :HdiEzraActivity
    @drafting = stage_names :Drafting
  end

  test 'Relations' do
    translator = program_roles :Translator

    assert_equal @hdi_ezra, @hdi_drafting.activity
    assert_equal @drafting, @hdi_drafting.stage_name
    assert_includes @hdi_drafting.program_roles, translator
  end

  test 'Validation' do
    consultant_check = stage_names :ConsultantCheck
    params = {activity: @hdi_ezra, stage_name: consultant_check, start_date: Date.today}
    model_validation_hack_test Stage, params

    new_stage = Stage.new(activity: @hdi_ezra, stage_name: consultant_check)
    invalids = [' ', 'abc', '7/1/99', '199-12-31', '-12-31', ' -12-31',
                ' -12-31', '2017-13', '2017-02-29', '2017-1-1']
    invalids.each do |start_date|
      new_stage.start_date = start_date
      refute new_stage.save, "Should not save stage with start date: #{start_date}"
    end
  end

  test 'Default new params' do
    params = {stage_name: stage_names(:Planned), start_date: Date.today}
    assert_equal params, Stage.default_new_params('translation')
  end

  test 'New For Activity' do
    consultant_check = stage_names :ConsultantCheck
    new_stage = Stage.new_for @hdi_ezra
    assert_equal consultant_check, new_stage.stage_name
    assert_equal Date.today.to_s, new_stage.start_date
  end

  test 'Destroy Last Stage for Activity' do
    hdi_planned = stages :HdiOne
    @hdi_drafting.destroy
    assert_equal 1, @hdi_ezra.stages.count
    hdi_planned.destroy # Should not work
    assert_equal 1, @hdi_ezra.stages.count, "Should still have the hdi_planned stage after trying to delete it"
  end

  test 'Progress' do
    percent, color = @hdi_drafting.progress
    assert (0..100) === percent, "Progress should be between 0 and 100"
  end

  test 'Name' do
    assert_equal 'Drafting', @hdi_drafting.name
  end

  test 'f_start_date' do
    assert_equal FuzzyDate.new(2017, 2), @hdi_drafting.f_start_date
  end
end
