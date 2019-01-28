require 'test_helper'

class LinguisticActivityIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    log_in people(:Rick)
    @hdi = programs(:Hdi)
    @ewondo = programs(:Ewondo)
    @grammar_ws = linguistic_activities(:EwondoGrammarIntro)
  end

  # test "Create Research Activity" do
  #   visit new_program_activity_path(@hdi)
  #   select 'Linguistic', from: 'Type of Activity'
  #   find('select[data-ling-category]').select 'Research'
  #   fill_in id: 'activity_title', with: 'Fascinating Phonological Research'
  #   click_on 'Save'
  #   assert_current_path program_path(@hdi)
  #   find('#linguistic-activities-table').assert_text 'Fascinating Phonological Research'
  # end

  # test "Change Title" do
  #   visit activity_path(linguistic_activities(:LePaper))
  #   find('h2').click_on 'Edit'
  #   fill_in id: 'activity_title', with: 'Find Holy Grail'
  #   click_on 'Save'
  #   find('h2').assert_text('Find Holy Grail')
  # end

  # test "Create Workshops Activity" do
  #   visit new_program_activity_path(@hdi)
  #   select 'Linguistic', from: 'Type of Activity'
  #   find('select[data-ling-category]').select 'Workshops'
  #   fill_in id: 'activity_title', with: 'Cooking Yummy Things'
  #   find('#workshop-section').assert_selector('input', count: 1)
  #   click_on '+'
  #   find('#workshop-section').assert_selector('input', count: 2)
  #   click_on '-'
  #   find('#workshop-section').assert_selector('input', count: 1)
  #   click_on '+'
  #   find('div.workshop-group', text: 'Workshop 1').fill_in(name: 'activity[workshops][]', with: 'Pizza!')
  #   find('div.workshop-group', text: 'Workshop 2').fill_in(name: 'activity[workshops][]',  with: 'Spaghetti!')
  #   click_on 'Save'
  #   assert_current_path program_path(@hdi)
  #   within('#linguistic-activities-table') do
  #     assert_text 'Cooking Yummy Things'
  #     click_on 'Planned'
  #     assert_text 'Pizza!'
  #     assert_text 'Spaghetti!'
  #   end
  # end

  # test "Complete Workshops" do
  #   verbid = workshops(:Verb).id
  #   syntaxid = workshops(:Syntax).id
  #   visit program_path(@ewondo)
  #   within('#linguistic-activities-table') do
  #     click_on 'Noun'
  #     find("tr#workshop-#{verbid}").click_on 'Mark Completed'
  #     find('tr', text: 'Grammar Intro').assert_text 'Verb'
  #     find("tr#workshop-#{syntaxid}").click_on 'Mark Completed'
  #     fill_in class: 'fuzzy-year', with: '2019'
  #     click_on 'Save'
  #     find('tr', text: 'Grammar Intro').assert_text 'Syntax'
  #   end
  # end

  # test "Uncomplete Workshop" do
  #   visit activity_path(@grammar_ws)
  #   within('tr', text: 'Noun') do
  #     assert_no_selector('button', text: 'Mark Completed')
  #     find('button.iconButtonWarning').click # Edit button
  #     uncheck 'Completed'
  #     click_on 'Save'
  #     assert_selector('button', text: 'Mark Completed')
  #   end
  # end

  # test "Add Workshop" do
  #   visit activity_path(@grammar_ws)
  #   assert_no_selector('tr', text: 'Taco Party')
  #   click_on 'Add Workshop'
  #   fill_in 'name', with: 'Taco Party'
  #   click_on 'Save'
  #   assert_selector('tr', text: 'Taco Party')
  # end
  
  # test "Remove Workshop" do
  #   visit activity_path(@grammar_ws)
  #   # assert_selector('tr', text: 'Noun')
  #   within('tr', text: 'Noun') do
  #     page.accept_confirm do
  #       find('button.iconButtonDanger').click # Delete button
  #     end
  #   end
  #   assert_no_selector('tr', text: 'Noun')
  # end
end