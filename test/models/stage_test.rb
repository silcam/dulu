require "test_helper"

class StageTest < ActiveSupport::TestCase
  def setup
    @hdi_planned = stages :HdiOne
    @hdi_drafting = stages :HdiTwo
    @hdi_ezra = translation_activities :HdiEzra
  end

  test "Relations" do
    assert_equal @hdi_ezra, @hdi_drafting.activity
  end

  test "Validation Required Params" do
    min_params = valid_params
    min_params.delete(:name)
    model_validation_hack_test Stage, min_params
  end

  test "Validation Start Date" do
    new_stage = Stage.new(valid_params)
    invalids = [" ", "abc", "7/1/99", "199-12-31", "-12-31", " -12-31",
                " -12-31", "2017-13", "2017-02-29", "2017-1-1"]
    invalids.each do |start_date|
      new_stage.start_date = start_date
      refute new_stage.save, "Should not save stage with start date: #{start_date}"
    end
  end

  test "Validation Kind" do
    refute Stage.new(valid_params(kind: "Pizza")).valid?
  end

  test "Destroy Last Stage for Activity" do
    hdi_planned = stages :HdiOne
    @hdi_drafting.destroy
    assert_equal 1, @hdi_ezra.stages.count
    hdi_planned.destroy # Should work
    assert_equal 0, @hdi_ezra.stages.count, "Should still have the hdi_planned stage after trying to delete it"
  end

  test "Progress" do
    percent, color = @hdi_drafting.progress
    assert (0..100) === percent, "Progress should be between 0 and 100"
  end

  test "Name" do
    assert_equal :Drafting, @hdi_drafting.name
  end

  test "f_start_date" do
    assert_equal FuzzyDate.new(2017, 2), @hdi_drafting.f_start_date
  end

  test "Roles" do
    assert_equal [], @hdi_planned.roles

    assert_includes @hdi_drafting.roles, :Translator
  end

  test "First Stage" do
    assert_equal :Planned, Stage.first_stage(:Translation)
    assert_equal :Planned, Stage.first_stage("Translation")
  end

  test "Stage After" do
    assert_equal :Drafting, Stage.stage_after(:Planned, :Translation)
    assert_equal :Drafting, Stage.stage_after("Planned", "Translation")
    assert_equal :Published, Stage.stage_after(:Published, :Translation)
  end

  def valid_params(params = {})
    { activity: @hdi_ezra, name: "Consultant_check", start_date: Date.today, kind: "Translation" }.merge(params)
  end
end
