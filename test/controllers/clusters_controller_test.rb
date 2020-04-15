# frozen_string_literal: true

require 'test_helper'

class ClustersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @olga = people(:Olga)
    @rick = people(:Rick)
    @kendall = people(:Kendall)
    @drew = people(:Drew)
    @ndop = clusters(:Ndop)
  end

  def clusters_path(rest = '')
    "/api/clusters#{rest}"
  end

  test 'Index' do
    api_login
    data = api_get(clusters_path)
    assert_equal(
      { clusters: [{ id: 657561020, name: 'Ndop', region_id: 961289125 }], can: { clusters: { create: false } } },
      data
    )
  end

  test 'Index - can create' do
    api_login @olga
    data = api_get(clusters_path)
    assert data[:can][:clusters][:create]
  end
  
  test 'Show' do
    api_login @drew
    data = api_get(clusters_path("/#{@ndop.id}"))
    assert_equal(
      { cluster: { id: 657561020, name: 'Ndop', region_id: 961289125, can: { update: false, destroy: false, manage_participants: true } }, languages: [{ id: 292428285, name: 'Bambalang', cluster_id: 657561020, progress: {} }, { id: 248732538, name: 'Bangolan', cluster_id: 657561020, progress: {} }] },
      data
    )
  end

  test 'Show Permissions' do
    api_login @rick
    data = api_get(clusters_path("/#{@ndop.id}"))
    assert_equal(
      { update: true, destroy: true, manage_participants: true },
      data[:cluster][:can]
    )

    api_login @olga
    data = api_get(clusters_path("/#{@ndop.id}"))
    assert_equal(
      { update: true, destroy: false, manage_participants: true },
      data[:cluster][:can]
    )

    api_login @kendall
    data = api_get(clusters_path("/#{@ndop.id}"))
    assert_equal(
      { update: false, destroy: false, manage_participants: false },
      data[:cluster][:can]
    )
  end

  test 'Create' do
    api_login @olga
    data = api_post(clusters_path, cluster: { name: 'Misaje' })
    assert_equal(
      { cluster: { id: 657561021, name: 'Misaje', region_id: nil, can: { update: true, destroy: false, manage_participants: true } }, languages: [] },
      data
    )
  end

  test 'Create Permissions' do
    api_login @kendall
    api_post(clusters_path, cluster: { name: 'Misaje' })
    assert_not_allowed
  end

  test 'Update' do
    # Change name, keep Bambalang, drop Bangolan and add Ewondo
    api_login @olga
    data = api_put(
      clusters_path("/#{@ndop.id}"),
      cluster: { name: 'Ndop Party', language_ids: [292428285, 406181303] }
    )
    assert_equal(
      { cluster: { id: 657561020, name: 'Ndop Party', region_id: 961289125, can: { update: true, destroy: false, manage_participants: true } }, languages: [{ id: 292428285, name: 'Bambalang', cluster_id: 657561020, progress: {} }, { id: 406181303, name: 'Ewondo', cluster_id: 657561020, progress: {} }, { id: 248732538, name: 'Bangolan', cluster_id: nil, progress: nil }] },
      data
    )
  end

  test 'Update Permission' do
    api_login @kendall
    api_put(
      clusters_path("/#{@ndop.id}"),
      cluster: { name: 'Ndop Party' }
    )
    assert_not_allowed
  end

  test 'Destroy' do
    api_login @rick
    api_delete(clusters_path("/#{@ndop.id}"))
    assert_response 204
    refute Cluster.find_by(id: @ndop.id)
  end

  test 'Destroy Permission' do
    api_login @kendall
    api_delete(clusters_path("/#{@ndop.id}"))
    assert_not_allowed
  end
end
