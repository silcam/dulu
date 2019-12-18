# frozen_string_literal: true

require 'application_system_test_case'

class PersonPickerTest < ApplicationSystemTestCase
  def setup
    log_in people(:Olga)
    visit model_path(regions(:NorthRegion))
    action_bar_click_edit
  end

  test 'Create new person in picker' do
    within('label', text: 'LPF') do
      fill_in('query', with: 'charlie mcguffin', fill_options: { clear: :backspace })
      click_on 'Add Person'
      click_on 'Save'
    end
    assert_no_text 'New Person'
    click_on 'Save'
    assert_text('LPF: Charlie Mcguffin')
  end
end
