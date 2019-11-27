# frozen_string_literal: true

require 'test_helper'

class CountryRegionTest < ActiveSupport::TestCase
  def setup
    @far_north = country_regions :FarNorth
  end

  test 'Relations' do
    mayo_tsanaga = territories :MayoTsanaga
    hdi = languages :Hdi
    assert_includes(@far_north.territories, mayo_tsanaga)
    assert_includes(@far_north.languages, hdi)
  end

  test 'Name' do
    I18n.locale = :fr
    assert_equal 'Extrème-Nord', @far_north.name
    I18n.locale = :en
    assert_equal 'Far North', @far_north.name
  end
end
