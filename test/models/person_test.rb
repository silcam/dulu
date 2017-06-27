require 'test_helper'

class PersonTest < ActiveSupport::TestCase
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

  test "Current Participants" do
    no_participants = people(:FormerHdiTranslator).current_participants
    participants = people(:Drew).current_participants

    assert_empty no_participants
    assert_not_empty participants
  end
end
