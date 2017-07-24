require 'test_helper'

class LanguageTest < ActiveSupport::TestCase
  def setup
    @hdi = languages :Hdi
  end

  test 'Relations' do
    developing = language_statuses :Developing
    cameroon = countries :Cameroon
    far_north = cameroon_regions :FarNorth
    hdi_program = programs :HdiProgram
    hdi_dialect = languages :HdiDialect

    assert_equal developing, @hdi.language_status
    assert_equal cameroon, @hdi.country
    assert_equal far_north, @hdi.cameroon_region
    assert_equal hdi_program, @hdi.program
    assert_equal @hdi, hdi_dialect.parent
  end

  test "Validations" do
    params = {name: 'Frank'}
    model_validation_hack_test Language, params
    blank_name = Language.new(name: ' ')
    refute blank_name.save, "Should not save language with blank name"
    hdi_dialect = languages :HdiDialect
    new_hdi_dialect = Language.new(name: 'HiXiDi', parent: @hdi)
    assert new_hdi_dialect.save, "Should save valid dialect"
    hdi_dialect_dialect = Language.new(name: 'Frank', parent: hdi_dialect)
    refute hdi_dialect_dialect.save, "Should not save a dialect of a dialect"
  end

  test "Is Dialect" do
    hdi_dialect = languages :HdiDialect
    assert hdi_dialect.is_dialect?, "Hdi Dialect is a dialect"
    refute @hdi.is_dialect?, "Hdi is not a dialect"
  end

  test "Code or Parent Code" do
    hdi_dialect = languages :HdiDialect
    assert_equal 'xed', @hdi.code_or_parent_code
    assert_equal 'xed', hdi_dialect.code_or_parent_code
    assert_nil hdi_dialect.code
  end

  test 'Ethnologue Link' do
    assert_equal 'https://www.ethnologue.com/language/xed', @hdi.ethnologue_link
  end

  test 'Alt Names Array' do
    array = %w[Hedi Hide Turu-Hide Xadi Xdi Xedi]
    assert_equal(array, @hdi.alt_names_array)
  end

  test 'Update Name' do
    @hdi.update_name 'Xdi'
    @hdi.reload
    assert_equal 'Xdi', @hdi.name
    alts = 'Hdi, Hedi, Hide, Turu-Hide, Xadi, Xedi'
    assert_equal alts, @hdi.alt_names
  end
end
