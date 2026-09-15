# frozen_string_literal: true

require 'test_helper'

class NoteTest < ActiveSupport::TestCase
  test 'Get associated object with `for`' do
    assert_equal languages(:Hdi), notes(:HdiNote1).for
  end

  test 'Set associated object with `for=`' do
    note = notes(:HdiNote1)
    note.update(for: languages(:Ewondo))
    assert_equal note, Note.for(languages(:Ewondo)).first
  end

  test 'Create a note for Drew' do
    note = Note.create(person: people(:Andreas), text: 'This guy is cool, too', for: people(:Drew))
    assert_equal note, Note.all.first
    exp = { 
      'person_id' => people(:Andreas).id, 
      'text' => 'This guy is cool, too', 
      'for_type' => 'Person',
      'for_id' => people(:Drew).id 
    }
    assert_partial exp, note.attributes
  end

  test '`for` refuses a for_type outside the allowlist' do
    # Bypasses validation the way a console write or a pre-existing row would --
    # the read-side guard has to hold on its own.
    note = notes(:HdiNote1)
    note.update_column(:for_type, 'Kernel')

    assert_raises(ActiveRecord::RecordNotFound) { note.for }
  end

  test 'a note cannot be saved with a for_type outside the allowlist' do
    note = Note.new(person: people(:Andreas), text: 'nope',
                    for_type: 'Kernel', for_id: languages(:Hdi).id)

    assert_not note.save
    assert_includes note.errors[:for_type].join, 'not something a note can attach to'
  end

  test 'Get notes for Hdi' do
    exp = [notes(:HdiNote2), notes(:HdiNote1)]
    assert_equal exp, Note.for(languages(:Hdi))
  end

  test 'Note people' do
    exp = [people(:Andreas), people(:Drew)]
    assert_equal exp, Note.people(Note.for(languages(:Hdi)))
  end
end
