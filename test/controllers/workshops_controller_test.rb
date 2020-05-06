# frozen_string_literal: true

require 'test_helper'

class WorkshopsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @kendall = people :Kendall
    @drew = people :Drew
    @activity = linguistic_activities :EwondoGrammarIntro
    @noun = workshops :Noun
    @syntax = workshops :Syntax
  end

  test 'Create Workshop' do
    api_login @kendall
    data = api_post("/api/activities/#{@activity.id}/workshops", workshop: { name: 'Word Order' })
    workshop = Workshop.find_by(name: 'Word Order')
    assert_equal(
      { id: workshop.id, name: 'Word Order', event_id: nil, completed: false, activityId: 364981178, date: '' },
      data[:activities][0][:workshops][3]
    )
    # assert_equal '', data
  end

  test 'Create Permission' do
    api_login @drew
    api_post("/api/activities/#{@activity.id}/workshops", workshop: { name: 'Word Order' })
    assert_not_allowed
  end

  test 'Update Noun Workshop' do
    api_login @kendall
    data = api_put(
      "/api/workshops/#{@noun.id}", 
      workshop: { name: 'Nounz', completed: true, date: '2018-01-21' } # Only the name is actually a change
    )
    assert_equal(
      { id: @noun.id, name: 'Nounz', event_id: 773726370, completed: true, activityId: 364981178, date: '2018-01-21' },
      data[:activities][0][:workshops][0]
    )
  end

  test 'Uncomplete Noun Workshop' do
    api_login @kendall
    data = api_put(
      "/api/workshops/#{@noun.id}", 
      workshop: { completed: false }
    )
    assert_equal(
      { id: @noun.id, name: 'Noun', event_id: 773726370, completed: false, activityId: 364981178, date: '2018-01-21' },
      data[:activities][0][:workshops][0]
    )
  end

  test 'Complete Syntax Workshop' do
    api_login @kendall
    data = api_put(
      "/api/workshops/#{@syntax.id}", 
      workshop: { completed: true, date: '2020-04' }
    )
    assert_equal(
      { id: @syntax.id, name: 'Syntax', event_id: nil, completed: true, activityId: 364981178, date: '2020-04' },
      data[:activities][0][:workshops][2]
    )
  end

  test 'Update Permission' do
    api_login @drew
    api_put(
      "/api/workshops/#{@noun.id}", 
      workshop: { name: 'Nounz', completed: true, date: '2018-02' }
    )
    assert_not_allowed
  end

  test 'Destroy NounShop' do
    api_login @kendall
    data = api_delete("/api/workshops/#{@noun.id}")
    assert_equal(
      2,
      data[:activities][0][:workshops].length
    )
  end

  test 'Delete Permission' do
    api_login @drew
    api_delete("/api/workshops/#{@noun.id}")
    assert_not_allowed
  end
end
