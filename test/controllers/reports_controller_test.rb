# frozen_string_literal: true

require 'test_helper'

class ReportsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people(:Drew)
  end

  # The frontend sends `period` as a nested object. axios 0.x serialised that by
  # JSON.stringify-ing it, so the server used to JSON.parse a string; axios 1
  # serialises it the Rails way (period[start][year]=2017) and the parse raised,
  # 500ing the endpoint. Nothing covered it -- this test file was a `skip
  # 'Implement'` placeholder -- so the wire format is pinned here.
  test 'Domain report accepts a nested period' do
    api_login @drew
    data = api_get(
      '/api/reports/domain_report?domain=Translation' \
      '&period%5Bstart%5D%5Byear%5D=2017&period%5Bstart%5D%5Bmonth%5D=1' \
      '&period%5Bend%5D%5Byear%5D=2017&period%5Bend%5D%5Bmonth%5D=12'
    )
    assert_response :success
    assert_equal(
      { start: { year: 2017, month: 1 }, end: { year: 2017, month: 12 } },
      data[:report][:dataParams][:period]
    )
    assert_equal 'Translation', data[:report][:dataParams][:domain]
  end

  test 'Domain report requires a period' do
    api_login @drew
    get('/api/reports/domain_report?domain=Translation', xhr: true)
    assert_response :bad_request
  end
end
