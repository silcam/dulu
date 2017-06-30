require 'test_helper'

class ProgramRoleTest < ActiveSupport::TestCase
  def setup
    @translator = program_roles :Translator
  end

  test 'Relations' do
    abanda_hdi = participants :AbandaHdi
    abanda = people :Abanda
    drafting = stage_names :Drafting

    assert_includes @translator.participants, abanda_hdi
    assert_includes @translator.people, abanda
    assert_includes @translator.stage_names, drafting
  end

  test 'Translated Name' do
    I18n.locale = :en
    assert_equal 'Translator', @translator.t_name
    I18n.locale = :fr
    assert_equal 'Traducteur', @translator.t_name
  end
end
