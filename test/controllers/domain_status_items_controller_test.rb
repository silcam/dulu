# frozen_string_literal: true

require 'test_helper'

class DomainStatusItemsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @hdi = languages :Hdi
    @hdi_nt = domain_status_items :HdiNT
    @sil = organizations :SIL
    @drew = people :Drew
    @abanda = people :Abanda
    @lance = people :Lance
    @cmb_library = dsi_locations :CMB_Library
  end

  def dsi_path(rest = '')
    "/api/domain_status_items#{rest}"
  end

  def lang_dsi_path(lang_id, rest = '')
    "/api/languages/#{lang_id}/domain_status_items#{rest}"
  end

  test 'Index' do
    api_login
    data = api_get(lang_dsi_path(@hdi.id))
    partial_exp = {
      languages: [
        {
          id: @hdi.id, 
          name: 'Hdi',
          domain_status_items: [
            {
              id: @hdi_nt.id,
              category: 'PublishedScripture',
              subcategory: 'New_testament',
              year: 2005,
              organization_ids: [@sil.id],
              person_ids: [@drew.id, @abanda.id],
              creator_id: @drew.id,
              link: 'http://hdint.com',
              dsiLocation: { id: @cmb_library.id, name: 'CMB Library' }
            }
          ]
        }
      ],
      people: [{ id: @drew.id }],
      organizations: [{ id: @sil.id }]
    }
    assert_partial(partial_exp, data)
  end

  test 'Create' do
    api_login(@drew)
    data = api_post(
      lang_dsi_path(@hdi.id), 
      category: 'Film', subcategory: 'LumoMark', link: 'http://lumomark.com/hdi', dsi_location_id: @cmb_library.id
    )
    partial_exp = {
      languages: [
        {
          domain_status_items: [
            { 
              category: 'Film', 
              subcategory: 'LumoMark', 
              creator_id: @drew.id, 
              link: 'http://lumomark.com/hdi',
              dsiLocation: { id: @cmb_library.id, name: 'CMB Library' } 
            }
          ]
        }
      ]
    }
    assert_partial partial_exp, data
  end

  test 'Update' do
    api_login(@drew)
    data = api_put(dsi_path("/#{@hdi_nt.id}"), description: 'words')
    assert_equal 'words', data[:languages][0][:domain_status_items][0][:description]
  end

  test 'Update with create new DsiLocation' do
    api_login(@drew)
    data = api_put(dsi_path("/#{@hdi_nt.id}"), new_dsi_location: 'Out Back')
    assert_equal 'Out Back', data[:languages][0][:domain_status_items][0][:dsiLocation][:name]
    assert DsiLocation.find_by(name: 'Out Back')
  end

  test 'Update Permission' do
    api_login(@lance)
    api_put(dsi_path("/#{@hdi_nt.id}"), description: 'words')
    assert_not_allowed
  end

  test 'Destroy' do
    api_login(@drew)
    data = api_delete(dsi_path("/#{@hdi_nt.id}"))
    assert_empty data[:languages][0][:domain_status_items]
  end

  test 'Destroy permissions' do
    api_login(@lance)
    api_delete(dsi_path("/#{@hdi_nt.id}"))
    assert_not_allowed
  end
end
