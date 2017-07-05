require 'test_helper'

class PersonTest < ActiveSupport::TestCase
  def setup
    @drew = people :Drew
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

  test 'Full Names' do
    assert_equal 'Drew Maust', @drew.full_name
    assert_equal 'Maust, Drew', @drew.full_name_rev
  end

  test 'Roles' do
    kevin = people :Kevin
    olga = people :Olga
    abanda = people :Abanda
    rick = people :Rick

    assert rick.is_admin?, 'Rick should be admin'
    refute olga.is_admin?, 'Olga should not be admin'
    assert olga.is_program_supervisor?, 'Olga should be Program Supervisor'
    refute @drew.is_program_supervisor?, 'Drew should not be Program Supervisor'
    assert @drew.is_program_responsable?, 'Drew should be Program Responsable'
    refute kevin.is_program_responsable?, 'Kevin should not be Program Responsable'
    assert kevin.is_user?, 'Kevin should be User'
    refute abanda.is_user?, 'Abanda should not be User'
  end

  test "Current Participants" do
    no_participants = people(:FormerHdiTranslator).current_participants
    participants = people(:Drew).current_participants

    assert_empty no_participants
    assert_not_empty participants
  end

  test "Roles List" do
    assert_equal 4, Person.roles_for_select.count
    assert_equal 5, Person.roles_for_select(true).count
  end

  test "Search" do
    results = Person.search 'drew'
    assert_equal 1, results.count
    assert_equal 'Drew Maust', results[0][:title]
    hdi_program = programs :HdiProgram
    assert_includes results[0][:subresults],
                    {title: 'Hdi', path: "/programs/#{hdi_program.id}",
                        description: 'Translation Consultant'}
  end
end
