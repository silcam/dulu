require 'test_helper'

class ActivityTest < ActiveSupport::TestCase

  def setup
    @hdi_ezra = translation_activities(:HdiEzraActivity)
  end

  test 'relations' do
    assert_equal(programs(:HdiProgram),
                 @hdi_ezra.program)
    assert_equal(stages(:HdiOne),
                 @hdi_ezra.stages.first)
    assert(@hdi_ezra.participants.include?(participants(:DrewHdi)),
           'expected DrewHdi to be participant to HdiEzraActivity')
    assert(@hdi_ezra.people.include?(people(:Drew)),
           'expected Drew to be in HdiEzraActivity.people')
  end

  test 'validations' do
    no_program = Activity.new(type: 'TranslationActivity')
    no_type = Activity.new(program: programs(:HdiProgram))
    # TODO - Test that we can create an activity with no BibleBook
    # once we have an activity that doesn't require it
    # good = Activity.new(type: 'OtherActivity', program: programs(:HdiProgram))
    refute(no_program.save, 'Should not save activity with no program')
    refute(no_type.save, 'Should not save activity with no type')
    assert_raises (Exception) {Activity.new(program: programs(:HdiProgram), type: 'FakeActivity')}
    # assert(good.save, 'Should save valid Activity')
  end

  test 'current stage' do
    assert_equal(stages(:HdiTwo),
                  @hdi_ezra.current_stage)
  end

  test 'update_current_stage' do
    planned = stages :HdiOne
    drafting = stages :HdiTwo
    planned.update(current: true)
    drafting.update(current: false)
    @hdi_ezra.touch
    planned.reload
    drafting.reload
    refute planned.current, "Planned should no longer be current"
    assert drafting.current, "Drafting shoulde be current"
  end

  test 'progress' do
    percent, color = @hdi_ezra.progress
    assert (0..100) === percent, "Progress should be between 0 and 100"
  end

  test 'stage_name' do
    assert_equal 'Drafting', @hdi_ezra.stage_name
  end

  test 'participants for my stage' do
    stage_participants = @hdi_ezra.participants_for_my_stage
    assert_equal(1, stage_participants.count)
    assert_equal(participants(:AbandaHdi), stage_participants.first)
  end

  test 'current participants' do
    assert(@hdi_ezra.current_participants.include?(participants(:DrewHdi)),
           'Drew should be a HdiEzraActvity participant')
    refute(@hdi_ezra.current_participants.include?(participants(:FormerHdiTranslator)),
           'FormerHdiTranslator should not be a current participant')
  end

  test 'get_stages' do
    stages_asc = @hdi_ezra.stages_ordered_asc
    stages_desc = @hdi_ezra.stages_ordered_desc
    assert_equal(2, stages_asc.count)
    assert_equal(2, stages_desc.count)
    assert_equal(stages(:HdiOne), stages_asc.first)
    assert_equal(stages(:HdiTwo), stages_desc.first)
  end

  # See Build test in TranslationActivityTest

  test 'try to destroy the last stage' do
    @hdi_ezra.stages.each { |s| s.destroy }
    assert_equal(0, @hdi_ezra.stages.count)
  end

  test "Types for select" do
    types = Activity.types_for_select
    assert_equal(1, types.count)
    assert_equal('TranslationActivity',types[0][1])
  end

  test "Search" do
    assert_not_empty Activity.search('Genesis')
  end
end
