require 'test_helper'

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @sil = organizations :SIL
    @rick = people :Rick
  end

  test 'Relations' do
    assert_includes @sil.people, @rick
  end

  test 'Validations' do
    fake_sil = Organization.new(long_name: 'SIL')
    refute fake_sil.save, "Shouldn't save Organization with blank name"
    fake_sil.short_name = 'SIL'
    refute fake_sil.save, "Shouldn't save Organization with non-unique name"
  end

  # test 'Current Participants' do
  #   drew_hdi = participants :DrewHdi
  #   assert_includes @sil.current_participants, drew_hdi
  # end

  test 'Search' do
    orgs = Organization.search('sil')
    assert_equal 1, orgs.count
    assert_equal @sil.name, orgs[0][:title]
    # assert_not_empty orgs[0][:subresults]
  end
end
