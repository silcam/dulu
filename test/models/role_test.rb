require 'test_helper'

class RoleTest < ActiveSupport::TestCase

  def setup
    @rick = people :Rick
    @drew = people :Drew
  end

  test "Available" do
    available = Role.available @rick
    assert_includes available, :TranslationConsultant
    refute_includes available, :DuluAdmin

    drew_hdi = participants :DrewHdi
    available = Role.available drew_hdi, @drew.program_roles
    assert_empty available

    drew_bangolan = Participant.new(person: @drew, program: programs(:Bangolan))
    available = Role.available drew_bangolan, @drew.program_roles
    assert_includes available, :TranslationConsultant
  end

  test "Grantable Roles" do
    assert_equal Role::ROLES, Role.grantable_roles(@rick)

    gr_roles = Role.grantable_roles(@rick, @drew)
    assert_includes gr_roles, :DuluAdmin
    refute_includes gr_roles, :TranslationConsultant

    gr_roles = Role.grantable_roles(people(:Olga))
    assert_includes gr_roles, :Administration
    assert_includes gr_roles, :Translator
    assert_includes gr_roles, :LanguageProgramCommittee
    refute_includes gr_roles, :DuluAdmin

    gr_roles = Role.grantable_roles(@drew)
    refute_includes gr_roles, :Administration
    assert_includes gr_roles, :Translator
    assert_includes gr_roles, :LanguageProgramCommittee
    refute_includes gr_roles, :DuluAdmin

    assert_empty Role.grantable_roles(people(:Kevin))
  end

  test "Is a role" do
    assert Role.is_a_role? :Translator
    refute Role.is_a_role? :Starfighter
    assert Role.is_a_role? 'Translator'
  end

  test "Has a program role" do
    assert Role.has_a_program_role? @drew
    refute Role.has_a_program_role? @rick
  end

  test "Roles Overlap" do
    assert Role.roles_overlap? Role::ROLES, Role::SUPERVISOR_ROLES
    assert Role.roles_overlap? Role::NON_PROGRAM_ROLES, Role::SUPERVISOR_ROLES
    assert Role.roles_overlap? @rick.roles, Role::SUPERVISOR_ROLES

    refute Role.roles_overlap? [], Role::SUPERVISOR_ROLES
    refute Role.roles_overlap? Role::SUPERVISOR_ROLES, []
    refute Role.roles_overlap? [], []
    refute Role.roles_overlap? @rick.roles, Role::EVENT_ROLES
    refute Role.roles_overlap? Role::SUPERVISOR_ROLES, Role::EVENT_ROLES
  end
end