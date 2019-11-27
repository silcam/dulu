require "test_helper"

class TerritoryTest < ActiveSupport::TestCase
  def setup
    @mayo_tsanaga = territories :MayoTsanaga
  end

  test "Relations" do
    far_north = country_regions :FarNorth
    assert_equal far_north, @mayo_tsanaga.country_region
  end
end
