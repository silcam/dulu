require "application_system_test_case"

class LingDomainStatusSysTest < ApplicationSystemTestCase
  test "Phonologie DSI" do
    add_item("Phonology")
    go_to_item "Phonology"
  end

  test "Othography DSI" do
    add_item("Orthography") do
      check "Tone Orthography"
    end
    go_to_item "Orthography"
    assert_text "Tone Orthography Yes"
  end

  test "Grammar DSI" do
    add_item("Grammar") do
      check "Noun Phrase"
    end
    go_to_item "Grammar"
    assert_checked_field "Noun Phrase"
    refute_checked_field "Verb Phrase"
  end

  test "Discourse DSI" do
    add_item("Discourse") do
      check "Narrative"
    end
    go_to_item "Discourse"
    assert_checked_field "Narrative"
    refute_checked_field "Hortatory"
  end

  test "Lexicon DSI" do
    add_item("Lexicon") do
      fill_in "Total Words", with: "800"
    end
    click_on "800 words 1995"
    assert_text "800"
    click_on "1995"
    assert_text "Cool Lexicon"
  end

  test "Text DSI" do
    add_item("Texts") do
      fill_in "Total Texts", with: "5"
      fill_in "Narrative", with: "3"
      fill_in "Hortatory", with: "2"
    end
    click_on "5 texts 1995"
    assert_text "1995 5 Draft"
    assert_text "3 Narrative"
    assert_text "2 Hortatory"
    click_on "1995"
    assert_text "Cool Texts"
  end

  def go_to_item(subcategory)
    within(parent(find("h5", text: subcategory))) { click_on "Rick Conrad" }
    assert_text "Cool #{subcategory}"
  end

  def add_item(subcategory)
    log_in people(:Drew)
    visit "#{model_path(languages(:Hdi))}/Linguistics"
    within(parent(find("h3", text: "Status"))) do
      click_icon("addIcon")
      within("label", text: "Subcategory") { find("select").select(subcategory) }
      fill_in "Description", with: "Cool #{subcategory}"
      fill_in "Year", with: "1995"
      within(parent(find("label", text: "People"))) do
        fill_in_search_input("Rick")
      end
      yield if block_given?
      click_on "Save"
    end
  end
end
