# frozen_string_literal: true

require 'test_helper'

class RegionTest < ActiveSupport::TestCase
  def setup
    @south = regions :SouthRegion
    @olga = people :Olga
    @ewondo = languages :Ewondo
    @ndop = clusters :Ndop
  end

  test 'lpf' do
    assert_equal @olga, @south.lpf
  end

  test 'clusters' do
    assert_includes @south.clusters, @ndop
  end

  test 'languages' do
    assert_includes @south.languages, @ewondo
  end
end
