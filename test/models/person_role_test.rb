require 'test_helper'

class PersonRoleTest < ActiveSupport::TestCase

  def setup
    @drew = people :Drew
  end

  test "Required params" do
    params = {person: @drew, role: 'Exegete', start_date: '2018-01-01'}
    model_validation_hack_test PersonRole, params
  end

  test "Current" do
    person_roles = @drew.person_roles
    assert_includes person_roles, person_roles(:DrewTranslationConsultant)
    assert_includes person_roles, person_roles(:DrewTCTraining)

    person_roles = @drew.person_roles.current
    assert_includes person_roles, person_roles(:DrewTranslationConsultant)
    refute_includes person_roles, person_roles(:DrewTCTraining)
  end

end
