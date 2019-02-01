require 'test_helper'

class HasParticipantsTest < ActiveSupport::TestCase

  def setup
    # Program model uses this concern
    @hdi = languages :Hdi
  end

  test 'Unassociated People' do
    drew = people :Drew
    rick = people :Rick
    unassoc = @hdi.unassociated_people
    assert_includes unassoc, rick
    refute_includes unassoc, drew
  end

  test 'Current Participants and People and Orgs' do
    drew_hdi = participants :DrewHdi
    drew = people :Drew
    former_hdi = participants :FormerHdiTranslator
    former = people :FormerHdiTranslator
    sil = organizations :SIL
    assert_includes @hdi.current_participants, drew_hdi
    refute_includes @hdi.current_participants, former_hdi
    assert_includes @hdi.current_people, drew
    refute_includes @hdi.current_people, former
    # assert_includes @hdi.current_organizations, sil
    # refute_includes @hdi.current_organizations, nil
    assert_empty @hdi.current_organizations
  end
end