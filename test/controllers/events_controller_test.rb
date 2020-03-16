# frozen_string_literal: true

require 'test_helper'

class EventsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people :Drew
    @kendall = people :Kendall
    @lance = people :Lance
    @olga = people :Olga
    @hdi = languages :Hdi
    @ewondo = languages :Ewondo
    @hdi_gen_check = events :HdiGenesisChecking
    @lance_event = events :LanceMadeAnEvent
    @verb_ws = events :EwondoVerbWS
    @ndop = clusters :Ndop
    @yde_loc = event_locations :Yaounde
  end

  def events_path(rest = '')
    "/api/events#{rest}"
  end

  def period_params(sy, sm, ey, em)
    "?start_year=#{sy}&start_month=#{sm}&end_year=#{ey}&end_month=#{em}"
  end

  test 'Index' do
    api_login
    data = api_get(events_path(period_params(2018, 1, 2018, 12)))
    assert_partial(
      [{
        id: @hdi_gen_check.id,
        name: 'Genesis Checking', 
        start_date: '2018-01-15', 
        end_date: '2018-01-30', 
        domain: 'Translation', 
        language_ids: [@hdi.id], 
        cluster_ids: [],
        note: '',
        category: '',
        subcategory: '',
        location: { name: 'Yaoundé' },
        event_participants: [
          { person_id: @drew.id }
        ]
      }], 
      data[:events]
    )
    assert_includes(data[:languages], id: @hdi.id, name: 'Hdi')
    assert_empty data[:clusters]
    assert_includes(data[:people], id: @drew.id, first_name: 'Drew', last_name: 'Mambo')
    assert_equal 2018, data[:startYear]
    assert_equal({ create: true }, data[:can][:events])
  end

  test 'Most Current Events' do
    api_login
    data = api_get(events_path('?start_year=2019'))
    assert_equal(1, data[:events].length)
  end

  test 'Language Index' do
    api_login
    data = api_get("/api/languages/#{@ewondo.id}/events#{period_params(2018, 1, 2018, 12)}")
    assert_equal(['Workshop: Verb', 'Workshop: Noun'], data[:events].map { |e| e[:name] })
  end

  test 'Person Index' do
    api_login
    data = api_get("/api/people/#{@drew.id}/events#{period_params(2018, 1, 2018, 12)}")
    assert_equal('Genesis Checking', data[:events][0][:name])
    assert_equal(1, data[:events].length)
  end

  test '1517 Events?' do
    api_login
    data = api_get(events_path(period_params(1517, 1, 1517, 12)))
    assert_empty data[:events]
    assert_nil data[:startYear]
  end

  test 'Backfill if none found' do
    api_login
    data = api_get(events_path(period_params(2017, 3, 2017, 3)))
    assert_equal('2017-02', data[:events][0][:end_date])
    assert_equal(1, data[:events].length)
    assert_nil data[:startYear]
  end

  test 'Show' do
    api_login
    data = api_get(events_path("/#{@hdi_gen_check.id}"))
    assert_includes(data[:languages], id: @hdi.id, name: 'Hdi')
    assert_empty data[:clusters]
    assert_includes(data[:people], id: @drew.id, first_name: 'Drew', last_name: 'Mambo')
    assert_empty data[:workshops_activities]
    assert_partial(
      { id: @hdi_gen_check.id, 
        name: 'Genesis Checking', 
        start_date: '2018-01-15', 
        end_date: '2018-01-30', 
        domain: 'Translation', 
        language_ids: [@hdi.id], 
        cluster_ids: [],
        note: '',
        category: '',
        subcategory: '',
        location: { name: 'Yaoundé' },
        event_participants: [
          { person_id: @drew.id }
        ],
        can: {
          update: true,
          destroy: true
        } },
      data[:events][0]
    )
  end

  test 'Show WS Event' do
    api_login
    data = api_get(events_path("/#{@verb_ws.id}"))
    assert_partial(
      [{ type: 'LinguisticActivity', title: 'Grammar Intro' }],
      data[:workshops_activities]
    )
    assert_partial(
      { workshop_id: @verb_ws.workshop.id, workshop_activity_id: @verb_ws.workshop.linguistic_activity_id },
      data[:events][0]
    )
  end

  def new_taco_party
    {
      name: 'Taco Party',
      domain: 'Literacy',
      note: 'Tacos and Reading!',
      start_date: '2020-03-12',
      end_date: '2021-03-12',
      category: 'Class',
      subcategory: 'Primer_1',
      language_ids: [@hdi.id],
      cluster_ids: [@ndop.id],
      event_location_id: @yde_loc.id,
      event_participants_attributes: [person_id: @kendall.id, roles: ['Linguist']]
    }
  end

  test 'Create' do
    api_login @drew
    new_event = new_taco_party
    data = api_post(events_path, event: new_event)
    new_event.delete(:event_participants_attributes)
    new_event[:event_participants] = [{ person_id: @kendall.id }]
    new_event.delete(:event_location_id)
    new_event[:location] = { id: @yde_loc.id, name: 'Yaoundé' }

    assert_partial(new_event, data[:events][0])
    assert_equal @drew, Event.find_by(name: 'Taco Party').creator
  end

  test 'Create Permissions' do
    api_login people(:Kevin)
    api_post(events_path, event: new_taco_party)
    assert_not_allowed
  end

  test 'Update' do
    api_login @drew
    data = api_put(
      events_path("/#{@hdi_gen_check.id}"),
      event: { end_date: '2018-02-06' }
    )
    assert_partial(
      { id: @hdi_gen_check.id, end_date: '2018-02-06' },
      data[:events][0]
    )
    @hdi_gen_check.reload
    assert_equal '2018-02-06', @hdi_gen_check.end_date
    # Creator was not changed:
    assert_equal @olga, @hdi_gen_check.creator
  end

  test 'Update and create event location' do
    api_login @drew
    data = api_put(
      events_path("/#{@hdi_gen_check.id}"),
      event: { new_event_location: 'The Basketball Court' }
      
    )
    assert_equal 'The Basketball Court', data[:events][0][:location][:name]
    assert EventLocation.find_by(name: 'The Basketball Court')
  end

  test 'Update Permissions' do
    api_login @drew
    api_put(events_path("/#{@lance_event.id}"), event: { name: "Drew's Event" })
    assert_not_allowed
  end

  test 'Destroy' do
    api_login @drew
    data = api_delete(events_path("/#{@hdi_gen_check.id}"))
    assert_response 200
    assert_equal({ deletedEvents: [@hdi_gen_check.id] }, data)
    refute_includes Event.all, @hdi_gen_check
  end

  test 'Destroy Workshop Event' do
    api_login @kendall
    data = api_delete(events_path("/#{@verb_ws.id}"))
    assert_response 200
    assert_partial({ workshops_activities: [{ workshops: [{ name: 'Verb', event_id: nil }] }] }, data)
    refute_includes Event.all, @verb_ws
  end

  test 'Destroy permission' do
    api_login @drew
    api_delete(events_path("/#{@lance_event.id}"))
    assert_not_allowed
  end

  test 'Can update/destroy if creator' do
    api_login @lance
    data = api_get(events_path("/#{@lance_event.id}"))
    assert_equal({ update: true, destroy: true }, data[:events][0][:can])

    api_delete(events_path("/#{@lance_event.id}"))
    assert_response 200
  end
end
