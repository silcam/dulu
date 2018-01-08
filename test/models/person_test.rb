require 'test_helper'

class PersonTest < ActiveSupport::TestCase
  def setup
    @drew = people :Drew
    I18n.locale = :en
  end

  test 'Relations' do
    sil = organizations :SIL
    usa = countries :USA
    drew_hdi = participants :DrewHdi

    assert_equal sil, @drew.organization
    assert_equal usa, @drew.country
    assert_includes @drew.participants, drew_hdi
  end

  test "Invalid People" do
    cm = countries(:Cameroon)
    invalid_person = Person.new(last_name: 'Jones', gender: 'M', country: cm)
    refute invalid_person.save, "Shouldn't save person with no first name"
    invalid_person = Person.new(first_name: 'Bill', gender: 'M', country: cm)
    refute invalid_person.save, "Shouldn't save person with no last name"
    invalid_person = Person.new(last_name: 'Jones', first_name: 'Bill', gender: 'A', country: cm)
    refute invalid_person.save, "Shouldn't save person with invalid gender"
    valid_person = Person.new(last_name: 'Johnes', first_name: 'Bill', gender: 'M', country: cm)
    assert valid_person.save, "Should save valid person"
  end

  test "Duplicate Email" do
    drew2 = Person.new(last_name: 'Maust', first_name: 'DrewToo', gender: 'M', email: 'drew_maust@sil.org')
    refute drew2.save, "Should not save person with duplicate email"
    drew2.email = "drew_maust_too@sil.org"
    assert drew2.save, "Should save with unique email."
  end

  test 'Full Names' do
    assert_equal 'Drew Maust', @drew.full_name
    assert_equal 'Maust, Drew', @drew.full_name_rev
  end

  test "Has Role" do
    kevin = people :Kevin
    rick = people :Rick
    assert rick.has_role?(:DuluAdmin)
    assert @drew.has_role?(:TranslationConsultant)
    refute kevin.has_role?(:TranslationConsultant)
  end

  test "Has Login" do
    abanda = people :Abanda
    assert @drew.has_login, "Drew should have a login"
    refute abanda.has_login, "Abanda does not have a login"
  end

  test "Current Participants" do
    no_participants = people(:FormerHdiTranslator).current_participants
    participants = people(:Drew).current_participants

    assert_empty no_participants
    assert_not_empty participants
  end

  test "All Sorted" do
    kevin = people :Kevin
    assert_equal kevin, Person.first
  end

  test "Search" do
    results = Person.search 'drew'
    assert_equal 1, results.count
    assert_equal 'Drew Maust', results[0][:title]
    hdi_program = programs :HdiProgram
    assert_includes results[0][:subresults],
                    {title: 'Hdi', model: hdi_program,
                        description: 'Translation Consultant'}
  end

  test "Search for person without Org" do
    assert_nil people(:Abanda).organization
    results = Person.search 'abanda'
    assert_equal 1, results.count
  end
end
