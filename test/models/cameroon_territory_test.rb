require 'test_helper'

class CameroonTerritoryTest < ActiveSupport::TestCase
  def setup
    @mayo_tsanaga = cameroon_territories :MayoTsanaga
  end

  test 'Relations' do
    far_north = cameroon_regions :FarNorth
    assert_equal far_north, @mayo_tsanaga.cameroon_region
  end
end
