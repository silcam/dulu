require "test_helper"

class LanguageTest < ActiveSupport::TestCase
  def setup
    @hdi = languages :Hdi
    @drew_hdi = participants :DrewHdi

    @bangolan = languages :Bangolan
    @drew_ndop = participants :DrewNdop
    @freddie = participants :Freddie
  end

  test "Relations" do
    developing = language_statuses :Developing
    cameroon = countries :Cameroon
    far_north = country_regions :FarNorth
    hdi_language = languages :Hdi
    hdi_dialect = languages :HdiDialect
    hdi_ezra = translation_activities :HdiEzra
    ezra = bible_books :Ezra
    drew_hdi = participants :DrewHdi
    drew = people :Drew
    genesis_check = events :HdiGenesisChecking
    ewondo_language = languages :Ewondo
    ewondo_nt = publications :EwondoNT

    assert_equal developing, @hdi.language_status
    assert_equal cameroon, @hdi.countries.first
    assert_equal far_north, @hdi.country_regions.first
    # assert_equal hdi_language, @hdi.language
    assert_equal @hdi, hdi_dialect.parent
    assert_includes @hdi.translation_activities, hdi_ezra
    assert_includes @hdi.bible_books, ezra
    assert_includes @hdi.participants, drew_hdi
    assert_includes @hdi.people, drew

    assert_includes @hdi.events, genesis_check

    assert_includes ewondo_language.publications, ewondo_nt
  end

  test "Validations" do
    params = { name: "Frank" }
    model_validation_hack_test Language, params
    blank_name = Language.new(name: " ")
    refute blank_name.save, "Should not save language with blank name"
    hdi_dialect = languages :HdiDialect
    new_hdi_dialect = Language.new(name: "HiXiDi", parent: @hdi)
    assert new_hdi_dialect.save, "Should save valid dialect"
    hdi_dialect_dialect = Language.new(name: "Frank", parent: hdi_dialect)
    refute hdi_dialect_dialect.save, "Should not save a dialect of a dialect"
  end

  test "Is Dialect" do
    hdi_dialect = languages :HdiDialect
    assert hdi_dialect.is_dialect?, "Hdi Dialect is a dialect"
    refute @hdi.is_dialect?, "Hdi is not a dialect"
  end

  test "Code or Parent Code" do
    hdi_dialect = languages :HdiDialect
    assert_equal "xed", @hdi.code_or_parent_code
    assert_equal "xed", hdi_dialect.code_or_parent_code
    assert_nil hdi_dialect.code
  end

  test "Ethnologue Link" do
    assert_equal "https://www.ethnologue.com/language/xed", @hdi.ethnologue_link
  end

  test "Alt Names Array" do
    array = %w[Hedi Hide Turu-Hide Xadi Xdi Xedi]
    assert_equal(array, @hdi.alt_names_array)
  end

  test "Update Name" do
    @hdi.update_name "Xdi"
    @hdi.reload
    assert_equal "Xdi", @hdi.name
    alts = "Hdi, Hedi, Hide, Turu-Hide, Xadi, Xedi"
    assert_equal alts, @hdi.alt_names
  end

  test "Name" do
    assert_equal "Hdi", @hdi.name
  end

  test "All Participants" do
    ptcpts = @hdi.all_participants
    assert_includes ptcpts, @drew_hdi
    assert_includes ptcpts, participants(:FormerHdiTranslator)

    ptpcts = @bangolan.all_participants
    assert_includes ptpcts, @drew_ndop
    assert_includes ptpcts, @freddie
  end

  test "All Current Participants" do
    ptcpts = @hdi.all_current_participants
    assert_includes ptcpts, @drew_hdi
    refute_includes ptcpts, participants(:FormerHdiTranslator)

    ptpcts = @bangolan.all_current_participants
    assert_includes ptpcts, @drew_ndop
    assert_includes ptpcts, @freddie
  end

  test "All People" do
    ptcpts = @hdi.all_people
    assert_includes ptcpts, @drew_hdi.person
    assert_includes ptcpts, people(:FormerHdiTranslator)

    ptpcts = @bangolan.all_people
    assert_includes ptpcts, @drew_ndop.person
    assert_includes ptpcts, @freddie.person
  end

  test "All Current People" do
    ptcpts = @hdi.all_current_people
    assert_includes ptcpts, @drew_hdi.person
    refute_includes ptcpts, people(:FormerHdiTranslator)

    ptpcts = @bangolan.all_current_people
    assert_includes ptpcts, @drew_ndop.person
    assert_includes ptpcts, @freddie.person
  end

  test "Sorted Activities" do
    ewondo_nt = publications :EwondoNT
    hdi_genesis = translation_activities :HdiGenesis
    assert_equal hdi_genesis, @hdi.sorted_activities.first
  end

  test "Sorted Pubs" do
    ewondo_language = languages :Ewondo
    ewondo_nt = publications :EwondoNT
    assert_includes ewondo_language.sorted_pubs("Scripture"), ewondo_nt
  end

  test "Is translating" do
    ezra = bible_books :Ezra
    john = bible_books :John
    assert @hdi.is_translating?(ezra.id), "Hdi are translating Ezra"
    refute @hdi.is_translating?(john.id), "Hdi are not translating John"
  end

  test "Percentages" do
    percents = @hdi.percentages
    percentage_assertions percents
  end

  def percentage_assertions(percents)
    assert_in_delta 1.2, percents[:Old_testament][:Drafting], 0.1
    assert_in_delta 6.6, percents[:Old_testament][:Consultant_check], 0.1
  end

  test "All Percentages" do
    percentages = Language.percentages
    percentage_assertions percentages[@hdi.id]
  end

  # test 'Programs Sorted by Recency' do
  #   no_activity = languages :NoActivity
  #   really_old = languages :ReallyOld

  #   languages = Language.all_sorted_by_recency
  #   assert_includes languages, @hdi
  #   assert_includes languages, no_activity
  #   assert_includes languages, really_old
  #   assert languages.index(@hdi) < languages.index(really_old),
  #          "Recent activity should come before old activity"
  #   assert languages.index(really_old) < languages.index(no_activity),
  #          "Old activity comes before no activity"
  # end

  test "Program Search" do
    results = Language.search("ewondo")
    assert_equal 1, results.count
    assert_equal "Ewondo", results[0][:title]
    assert_equal languages(:Ewondo), results[0][:model]
  end
end
