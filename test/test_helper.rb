begin
  `rails db:migrate`
rescue
  `rails db:schema:load`
end

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/reporters'
require 'minitest/rails/capybara'
require 'capybara-screenshot/minitest'
Minitest::Reporters.use!

Delayed::Worker.delay_jobs = false

Capybara::Webkit.configure do |config|
  config.raise_javascript_errors = false # true
end

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def simulate_oauth(user)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(:google_oauth2, {info: {email: user.email}})
  end

  def log_in(user)
    simulate_oauth user
    visit '/auth/google_oauth2'
  end

  # Requires Javascript
  def log_out
    click_on 'show-user-menu'
    click_link_to logout_path
  end

  def model_validation_hack_test(model, params)
    params.each_key do |param|
      test_params = params.clone
      test_params.delete(param)
      shouldnt_save = model.new(test_params)
      refute shouldnt_save.save, "Should not save #{model} without #{param}"
    end
    should_save = model.new(params)
    assert should_save.save, "Should save #{model} with valid params"
  end

  def page_has_link?(path)
    page.has_css? "a[href='#{path}']"
  end

  def click_link_to(path)
    find(:css, "a[href='#{path}']").click
  end

  def fill_in_date(prefix, date)
    fill_in "#{prefix}_y", with: date.year
    sel_month = date.month.nil? ? I18n.t(:Month) : I18n.t('date.abbr_month_names')[date.month]
    sel_day = date.day.nil? ? I18n.t(:Day) : date.day
    select sel_month, from: "#{prefix}_m"
    select sel_day, from: "#{prefix}_d"
  end

  def error_message_with(content)
    find(:css, 'div#error-explanation').has_content? content
  end

  def accept_js_confirm
    page.driver.browser.accept_js_confirms
  end

  def click_editable_text(text)
    if text
      find('.editableText', text: text).click
    else
      find('.addIconButton').click
    end
  end

  def edit_editable_text(field, text, new_text)
    click_editable_text(text)
    within('.editableTextInput') do
      fill_in(field, with: new_text)
      find('input[type="text"]').send_keys(:enter)
      # fill_in(currently_with: text, with: new_text)
    end
  end

  def edit_editable_search_text(text, new_text)
    click_editable_text(text)
    edit_search_input(new_text)
  end

  def edit_search_input(text)
    within('.searchTextInput') do
      fill_in('query', with: text)
      find('li', text: text).click
    end
  end

  def edit_editable_text_area(field, text, new_text)
    click_editable_text(text)
    within('.editableTextInput') do
      fill_in(field, with: new_text)
      click_button 'Save'
    end
  end

  def click_danger_button
    within('.dangerButton') do
      check 'dangerButtonCheckbox'
      find('button.btn-danger').click
    end
  end

  def assert_changes_saved
    assert find('p', text: 'All changes saved.')
  end
end

# Some kind of hack to avoid SQLite::BusyExceptions
# class ActiveRecord::Base
#   mattr_accessor :shared_connection
#   @@shared_connection = nil
#   def self.connection
#     @@shared_connection || retrieve_connection
#   end
# end
# ActiveRecord::Base.shared_connection = ActiveRecord::Base.connection
