require "application_system_test_case"

class ReportsIntTest < ApplicationSystemTestCase
  test "Generate Report" do
    log_in people(:Rick)
    visit "/reports"
    click_on "Translation Progress"
    within(parent(find("label", text: "Clusters"))) { fill_in_search_input("Ndop") }
    assert_selector("h3", text: "Ndop")
    assert_selector("h4", text: "Bambalang")
    within(parent(find("label", text: "Languages"))) { fill_in_search_input("Ewondo") }
    assert_selector("h4", text: "Ewondo")

    click_on "Save"
    fill_in "name", with: "Ndop-Ewondo"
    click_on "Save"
    assert_selector("h2", text: "Ndop-Ewondo")
    assert_text "Created by Rick Conrad"
  end

  test "Domain Report" do
    log_in people(:Rick)
    visit "/reports"
    click_on "Domain"
    select "Translation", from: "Domain"
    within(parent(find("label", text: "Start"))) { select "2017", from: "year" }
    within(parent(find("label", text: "End"))) { select "2017", from: "year" }
    assert_text "Hdi Ezra Drafting 2017-02"
    assert_text "Zulgo Ezra Consultant Check in Progress 2017-05-29"
    assert_text "Check a book now 2017-07 2017-07 Hdi"
    within("div#languageSelect") { fill_in_search_input("Zulgo") }
    safe_assert_no_text "Hdi"
    assert_text "Zulgo Ezra Consultant Check in Progress 2017-05-29"

    click_on "Save"
    fill_in "name", with: "Zulgo Translation 2017"
    click_on "Save"
    assert_selector("h2", text: "Zulgo Translation 2017")
    assert_text "Created by Rick Conrad"
    visit "/reports"
    assert_selector("a", text: "Zulgo Translation 2017")
  end
end
