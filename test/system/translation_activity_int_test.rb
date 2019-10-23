require "application_system_test_case"

class TranslationActivityIntTest < ApplicationSystemTestCase
  def setup
    @hdi = languages(:Hdi)
    @zulgo = languages(:Zulgo)
  end

  test "New Translation Activity" do
    log_in(people(:Olga))
    visit "#{model_path(@zulgo)}/Translation"
    safe_assert_no_selector("tr", text: "Genesis Planned")
    within("h3", text: "Activities") { click_icon("addIcon") }
    find("select").select "Genesis"
    click_on "Save"
    assert_selector("tr", text: "Genesis Planned")
  end

  test "Rick Deletes Hdi Exodus" do
    log_in people(:Rick)
    visit model_path(translation_activities(:HdiExodus))
    skip "Need to test deleting activities once we can do that"
    # assert_selector('input[value="Delete Exodus"]')
    # click_on 'Delete Exodus'
    # # accept_js_confirm
    # assert_current_path model_path(@hdi)
    # page.assert_no_text 'Exodus'
  end

  test "Kendall can't delete Exodus" do
    log_in people(:Kendall)
    visit model_path(translation_activities(:HdiExodus))
    skip "Need to test deleting activities once we can do that"
    safe_assert_no_selector('input[value="Delete Exodus"]')
  end

  test "Drew updates stage for Hdi Ezra" do
    log_in people(:Drew)
    visit model_path @hdi
    find("tr", text: "Ezra").find("button", text: "Drafting").click
    within("tr", text: "Update Stage:") do
      find("select").select("Ready for Consultant Check")
      click_on("Update")
    end
    find("tr", text: "As of").click_on("Save")
    find("tr", text: "Ezra").assert_text("Ready for Consultant Check")
  end

  test "Kendall can't update Hdi Ezra" do
    log_in people(:Kendall)
    visit model_path @hdi
    find("tr", text: "Ezra").assert_no_selector("button", text: "Drafting")
  end

  test "Update Stage Date" do
    log_in people(:Drew)
    visit model_path @hdi
    click_on "Ezra"
    within("tr", text: "Drafting") do
      click_icon "editIcon"
      fill_in_date FuzzyDate.new(2018, 4, 2)
      click_on "Save"
      assert_no_selector("button", text: "Save")
      assert_text "2018-04-02"
    end
  end

  test "Delete stage" do
    log_in people(:Drew)
    visit model_path @hdi
    click_on "Ezra"
    within("tr", text: "Drafting") do
      page.accept_confirm { click_icon "deleteIcon" }
    end
    assert_text "Ezra Planned"
    safe_assert_no_text "Drafting"
  end
end
