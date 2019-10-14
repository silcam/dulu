require "test_helper"

class ActivityTest < ActiveSupport::TestCase
  def setup
    @hdi_ezra = translation_activities(:HdiEzra)
  end

  test "relations" do
    assert_equal(languages(:Hdi),
                 @hdi_ezra.language)
    assert_equal(stages(:HdiOne),
                 @hdi_ezra.stages.first)
    assert(@hdi_ezra.participants.include?(participants(:DrewHdi)),
           "expected DrewHdi to be participant to HdiEzra")
    assert(@hdi_ezra.people.include?(people(:Drew)),
           "expected Drew to be in HdiEzra.people")
  end

  test "validations" do
    no_language = Activity.new(type: "TranslationActivity")
    no_type = Activity.new(language: languages(:Hdi))
    refute(no_language.save, "Should not save activity with no language")
    refute(no_type.save, "Should not save activity with no type")
    assert_raises (Exception) { Activity.new(language: languages(:Hdi), type: "FakeActivity") }
  end

  test "current stage" do
    assert_equal(stages(:HdiTwo),
                 @hdi_ezra.current_stage)
    planning = translation_activities(:HdiExodus).current_stage
    assert_equal :Planned, planning.name
    assert_equal :Translation, planning.kind
  end

  test "update_current_stage" do
    planned = stages :HdiOne
    drafting = stages :HdiTwo
    planned.update(current: true)
    drafting.update(current: false)
    @hdi_ezra.touch
    planned.reload
    drafting.reload
    refute planned.current, "Planned should no longer be current"
    assert drafting.current, "Drafting shoulde be current"

    # Verify function with no stages
    hdi_exodus = translation_activities(:HdiExodus)
    hdi_exodus.touch
    assert_equal :Planned, hdi_exodus.current_stage.name
  end

  test "kind" do
    assert_equal :Translation, @hdi_ezra.kind
  end

  test "progress" do
    percent, color = @hdi_ezra.progress
    assert (0..100) === percent, "Progress should be between 0 and 100"
  end

  test "stage_name" do
    assert_equal :Drafting, @hdi_ezra.stage_name
  end

  test "Next Stage" do
    stage = @hdi_ezra.next_stage
    assert_equal :Testing, stage.name
    assert_equal :Translation, stage.kind
    assert_equal Date.today.to_s, stage.start_date
  end

  test "participants for my stage" do
    stage_participants = @hdi_ezra.participants_for_my_stage
    assert_equal(1, stage_participants.count)
    assert_equal(participants(:AbandaHdi), stage_participants.first)
  end

  test "current participants" do
    assert(@hdi_ezra.current_participants.include?(participants(:DrewHdi)),
           "Drew should be a HdiEzraActvity participant")
    refute(@hdi_ezra.current_participants.include?(participants(:FormerHdiTranslator)),
           "FormerHdiTranslator should not be a current participant")
  end

  test "get_stages" do
    stages_asc = @hdi_ezra.stages_ordered_asc
    stages_desc = @hdi_ezra.stages_ordered_desc
    assert_equal(2, stages_asc.count)
    assert_equal(2, stages_desc.count)
    assert_equal(stages(:HdiOne), stages_asc.first)
    assert_equal(stages(:HdiTwo), stages_desc.first)
  end

  test "destroy the last stage" do
    @hdi_ezra.stages.each { |s| s.destroy }
    assert_equal(0, @hdi_ezra.stages.count)
  end

  def hdi_john
    hdi = languages(:Hdi)
    john = bible_books(:John)
    TranslationActivity.create!(language: hdi, bible_book: john)
  end

  test "Can delete brand new activity" do
    assert hdi_john.empty_activity?
  end

  test "Can't delete if has a stage" do
    john = hdi_john
    john.stages << john.next_stage
    refute john.empty_activity?
  end

  test "Can't delete if has a participant" do
    john = hdi_john
    john.participants << participants(:DrewHdi)
    refute john.empty_activity?
  end

  test "To Hash" do
    exp = {
      id: @hdi_ezra.id,
      stage_name: :Drafting,
      archivable: false,
      progress: { percent: 10, color: "#A93226" },
    }
    assert_equal exp, @hdi_ezra.to_hash
  end

  test "Types for select" do
    types = Activity.types_for_select
    assert_equal(3, types.count)
    assert_equal("TranslationActivity", types[0][1])
  end

  test "Search" do
    assert_not_empty Activity.search("Genesis")
  end
end
