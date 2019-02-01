require 'test_helper'

class ClusterTest < ActiveSupport::TestCase

  def setup
    @ndop = clusters :Ndop
  end

  test "Required attr Validation" do
    model_validation_hack_test Cluster, valid_params
  end

  test "Relations" do
    bangolan = languages :Bangolan
    assert_includes @ndop.languages, bangolan
  end

  test "Sorted Cluster Activities" do
    ndop_activities = @ndop.sorted_activities
    exp = [
        translation_activities(:BangolanGenesis),
        translation_activities(:BangolanExodus),
        translation_activities(:BambalangGenesis),
        translation_activities(:BambalangExodus)
    ]
    assert_equal exp, ndop_activities[0, 4]
  end

  test "Search" do
    results = Cluster.search('ndop')
    assert_equal 1, results.length
    ndop = results.first
    assert_equal 'Ndop Cluster', ndop[:title]
    assert_equal @ndop, ndop[:model]
    assert_equal 2, ndop[:subresults].length
    bangolan = languages :Bangolan
    bang_res = {title: 'Bangolan', model: bangolan, description: 'Language Program'}
    assert_includes ndop[:subresults], bang_res
  end

  private

  def valid_params(prms={})
    {name: 'Misaje'}.merge(prms)
  end
end
