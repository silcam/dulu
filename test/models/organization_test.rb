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
    fake_sil = Organization.new(abbreviation: 'SIL', fmid: 42)
    refute fake_sil.save, "Shouldn't save Organization with blank name"
    fake_sil.name = 'SIL'
    refute fake_sil.save, "Shouldn't save Organization with non-unique name"
  end

  test 'All in order' do
    orgs = Organization.all_in_order
    assert_equal organizations(:AAA), orgs.first
    assert_equal organizations(:ZZZ), orgs.last
  end
end
