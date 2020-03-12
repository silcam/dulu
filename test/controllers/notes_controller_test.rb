# frozen_string_literal: true

require 'test_helper'

class Api::NotesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @hdi = languages :Hdi
    @drew = people :Drew
    @hdi_note1 = notes :HdiNote1
    @rick = people :Rick
  end

  def notes_path(rest = '')
    "/api/notes#{rest}"
  end

  test 'Create' do
    api_login @drew
    note_params = { for_type: 'Language', for_id: @hdi.id, text: 'Why is the ethnologue code xed?' }
    data = api_post(notes_path, note_params)
    @note = Note.all.first
    exp = {
      notes: [{
        id: @note.id,
        text: 'Why is the ethnologue code xed?',
        person_id: @drew.id,
        created_at: @note.created_at.to_i

      }],
      people: [{
        first_name: 'Drew',
        last_name: 'Mambo',
        id: @drew.id
      }]
    }
    assert_equal exp, data
    assert_includes Note.for(@hdi), @note
  end

  test 'Update' do
    api_login @drew
    data = api_put(
      notes_path("/#{@hdi_note1.id}"), 
      text: @hdi_note1.text + "\nMy name is Drew Mambo, and I approve this message."
    )
    exp = {
      notes: [{
        id: @hdi_note1.id,
        text: "Dvi, Dvu, Dva\nMy name is Drew Mambo, and I approve this message."
      }],
      people: [{
        first_name: 'Drew'
      }]
    }
    assert_partial exp, data
    @hdi_note1.reload
    assert_equal "Dvi, Dvu, Dva\nMy name is Drew Mambo, and I approve this message.", @hdi_note1.text
  end

  test 'Update Permissions' do
    api_login @rick
    api_put(
      notes_path("/#{@hdi_note1.id}"), 
      text: @hdi_note1.text + "\nMy name is Rick Conrad, and I approve this message."
    )
    assert_not_allowed
  end

  test 'Destroy' do
    api_login @drew
    api_delete(notes_path("/#{@hdi_note1.id}"))
    assert_response 204
    assert_not_includes Note.all, @hdi_note1
  end

  test 'Destroy Permissions' do
    api_login @rick
    api_delete(notes_path("/#{@hdi_note1.id}"))
    assert_not_allowed
  end
end
