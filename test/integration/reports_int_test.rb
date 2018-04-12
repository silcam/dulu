require 'test_helper'

class ReportIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
  end

  test 'Generate Report' do
    log_in people(:Rick)
    visit reports_path
    select 'Ndop', from: 'add_cluster'
    find('a[data-add-cluster]').click
    select 'Hdi', from: 'add_program'
    find('a[data-add-program]').click
    click_on 'Generate Report'
    assert page.has_text? 'Language Comparison: Ndop Cluster, Hdi'
  end
end