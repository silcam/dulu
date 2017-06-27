require 'test_helper'

class ParticipantTest < ActiveSupport::TestCase
  test "Participant Validations" do
    @rick = people(:Rick)
    @hdi = programs(:HdiProgram)
    @role = program_roles(:Translator)
    model_validation_hack_test(Participant, {person: @rick, program: @hdi, program_role: @role, start_date: '2017'})
  end
end
