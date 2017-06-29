require 'test_helper'

class CountryTest < ActiveSupport::TestCase
  def setup
    @cameroon = countries :Cameroon
  end

  test 'Relations' do
    hdi = languages :Hdi
    assert_includes(@cameroon.languages, hdi)
  end
  
  test 'Name' do
    I18n.locale = :fr
    assert_equal 'Cameroun', @cameroon.name
    I18n.locale = :en
    assert_equal 'Cameroon', @cameroon.name
  end
end
