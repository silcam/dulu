require 'test_helper'

class CameroonRegionTest < ActiveSupport::TestCase
  def setup
    @far_north = cameroon_regions :FarNorth
  end

  test 'Relations' do
    mayo_tsanaga = cameroon_territories :MayoTsanaga
    hdi = languages :Hdi
    assert_includes(@far_north.cameroon_territories, mayo_tsanaga)
    assert_includes(@far_north.languages, hdi)
  end

  test 'Name' do
    I18n.locale = :fr
    assert_equal 'Extrème-Nord', @far_north.name
    I18n.locale = :en
    assert_equal 'Far North', @far_north.name
  end
end
