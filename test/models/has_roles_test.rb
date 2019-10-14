require "test_helper"

class HasRolesTest < ActiveSupport::TestCase
  def setup
    # EventParticipant includes HasRoles
    @drew_hdi_gen = event_participants :DrewHdiGenesis
    I18n.locale = :en
  end

  test "Roles" do
    exp = [:TranslationConsultant]
    assert_equal exp, @drew_hdi_gen.roles

    @drew_hdi_gen.update roles_field: ""
    assert_equal [], @drew_hdi_gen.roles

    @drew_hdi_gen.update roles_field: "|TranslationConsultant|DuluAdmin|"
    exp = [:TranslationConsultant, :DuluAdmin]
    assert_equal exp, @drew_hdi_gen.roles
  end

  test "Program Roles" do
    @drew_hdi_gen.update roles_field: "|TranslationConsultant|DuluAdmin|"
    exp = [:TranslationConsultant] # Not DuluAdmin
    assert_equal exp, @drew_hdi_gen.program_roles

    @drew_hdi_gen.update roles_field: "|DuluAdmin|"
    assert_equal [], @drew_hdi_gen.program_roles
  end

  test "Roles Text" do
    @drew_hdi_gen.update roles_field: "|TranslationConsultant|DuluAdmin|"
    exp = "Translation Consultant, Dulu Admin"
    assert_equal exp, @drew_hdi_gen.roles_text

    @drew_hdi_gen.update roles_field: ""
    assert_equal "", @drew_hdi_gen.roles_text
  end

  test "Has Role" do
    assert @drew_hdi_gen.has_role? :TranslationConsultant
    assert @drew_hdi_gen.has_role? "TranslationConsultant"
    refute @drew_hdi_gen.has_role? :Translator
    @drew_hdi_gen.update roles_field: "|TranslationConsultantTraining|"
    refute @drew_hdi_gen.has_role? :TranslationConsultant
  end

  test "Has Role Among" do
    various_has_roles_scenarios

    @drew_hdi_gen.update roles_field: "|Translator|TranslationConsultant|Exegete|"
    various_has_roles_scenarios
  end

  def various_has_roles_scenarios
    roles = Role::PARTICIPANT_ROLES
    assert @drew_hdi_gen.has_role_among? roles

    roles = ["TranslationConsultant", "DuluAdmin"]
    assert @drew_hdi_gen.has_role_among? roles

    roles = Role::SUPERVISOR_ROLES
    refute @drew_hdi_gen.has_role_among? roles
  end

  test "Add roles" do
    @drew_hdi_gen.add_role(:Translator)
    assert_includes @drew_hdi_gen.roles, :Translator

    @drew_hdi_gen.add_role "Exegete"
    assert_includes @drew_hdi_gen.roles, :Exegete

    @drew_hdi_gen.update roles_field: ""
    @drew_hdi_gen.add_role :LinguisticConsultant
    exp = [:LinguisticConsultant]
    assert_equal exp, @drew_hdi_gen.roles
  end

  test "Remove Roles" do
    @drew_hdi_gen.remove_role(:TranslationConsultant)
    assert_empty @drew_hdi_gen.roles
    assert_equal "", @drew_hdi_gen.roles_field

    @drew_hdi_gen.update roles_field: "|Translator|"
    @drew_hdi_gen.remove_role("Translator")
    assert_empty @drew_hdi_gen.roles

    @drew_hdi_gen.update roles_field: "|Translator|Exegete|DuluAdmin|"
    @drew_hdi_gen.remove_role :Exegete
    exp = [:Translator, :DuluAdmin]
    assert_equal exp, @drew_hdi_gen.roles
  end

  test "Where Has Role" do
    ab_hdi_gen = event_participants :AbandaHdiGenesis
    ptcpts = EventParticipant.where_has_role :Translator
    ptcpts2 = EventParticipant.where_has_role "Translator"
    assert_equal ptcpts, ptcpts2

    assert_includes ptcpts, ab_hdi_gen
    refute_includes ptcpts, @drew_hdi_gen

    ab_hdi_gen.add_role :TranslationConsultantTraining
    ptcpts = EventParticipant.where_has_role :TranslationConsultant
    assert_includes ptcpts, @drew_hdi_gen
    refute_includes ptcpts, ab_hdi_gen
  end

  test "Where Has Role Among" do
    ab_hdi_gen = event_participants :AbandaHdiGenesis
    ptcpts = EventParticipant.where_has_role_among [:Translator, :TranslationConsultant]
    ptcpts2 = EventParticipant.where_has_role_among ["Translator", "TranslationConsultant"]
    assert_equal ptcpts, ptcpts2

    assert_includes ptcpts, ab_hdi_gen
    assert_includes ptcpts, @drew_hdi_gen

    ab_hdi_gen.add_role :DuluAdmin
    ptcpts = EventParticipant.where_has_role_among [:Exegete, :DuluAdmin]
    assert_includes ptcpts, ab_hdi_gen
    refute_includes ptcpts, @drew_hdi_gen
  end
end
