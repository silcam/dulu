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
    fake_sil = Organization.new(abbreviation: 'SIL')
    refute fake_sil.save, "Shouldn't save Organization with blank name"
    fake_sil.name = 'SIL'
    refute fake_sil.save, "Shouldn't save Organization with non-unique name"
  end

  test 'All in order' do
    orgs = Organization.all_in_order
    assert_equal organizations(:AAA), orgs.first
    assert_equal organizations(:ZZZ), orgs.last
  end

  test 'Current Participants' do
    drew_hdi = participants :DrewHdi
    assert_includes @sil.current_participants, drew_hdi
  end

  test 'Current Programs' do
    hdi_program = programs :Hdi
    assert_includes @sil.current_programs, hdi_program
  end

  test 'Search' do
    orgs = Organization.search('sil')
    assert_equal 1, orgs.count
    assert_equal @sil.name, orgs[0][:title]
    assert_not_empty orgs[0][:subresults]
  end
end
