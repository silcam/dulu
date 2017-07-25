require 'test_helper'

class EventTest < ActiveSupport::TestCase
  def setup
    @genesis_check = events :HdiGenesisChecking
  end

  test "Relations" do
    hdi_program = programs :HdiProgram
    drew_genesis_check = event_participants :DrewHdiGenesis
    drew = people :Drew

    assert_includes @genesis_check.programs, hdi_program
    assert_includes @genesis_check.event_participants, drew_genesis_check
    assert_includes @genesis_check.people, drew
  end

  test "Presence Validation" do
    params = {kind: :ConsultantCheck, start_date: '2019-04', end_date: '2019-04'}
    model_validation_hack_test Event, params
  end

  test "Validate Kind" do
    assert_raises(Exception){ @genesis_check.update(kind: 'NotARealKind') }
  end

  test "Validate Start Date Fuzzy Date" do
    refute @genesis_check.update(start_date: 'abc'), "Should not save with invalid start date"
  end

  test "Validate End Date not before Start Date" do
    refute @genesis_check.update(end_date: '2017-01'), "Should not save with end date before start date"
  end

  test "Role Of" do
    drew = people :Drew
    rick = people :Rick
    consultant = program_roles :TranslationConsultant
    assert_equal consultant, @genesis_check.role_of(drew)
    assert_nil @genesis_check.role_of(rick)
  end
end
