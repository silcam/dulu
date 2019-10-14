require "test_helper"

class TerritoryTest < ActiveSupport::TestCase
  def setup
    @mayo_tsanaga = territories :MayoTsanaga
  end

  test "Relations" do
    far_north = regions :FarNorth
    assert_equal far_north, @mayo_tsanaga.region
  end
end
