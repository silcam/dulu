require 'test_helper'

class EventParticipantTest < ActiveSupport::TestCase
  def setup
    @genesis_check = events :HdiGenesisChecking
    @drew_genesis_check = event_participants :DrewHdiGenesis
  end

  test "Relations" do
    drew = people :Drew
    consultant = program_roles :TranslationConsultant
    assert_equal @genesis_check, @drew_genesis_check.event
    assert_equal drew, @drew_genesis_check.person
    assert_equal consultant, @drew_genesis_check.program_role
  end

  test "Validation Hack Test" do
    rick = people :Rick
    consultant = program_roles :TranslationConsultant
    params = {event: @genesis_check, person: rick}
    model_validation_hack_test EventParticipant, params
  end
end
