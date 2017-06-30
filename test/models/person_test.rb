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

  test "Current Participants" do
    no_participants = people(:FormerHdiTranslator).current_participants
    participants = people(:Drew).current_participants

    assert_empty no_participants
    assert_not_empty participants
  end
end
