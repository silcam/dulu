# frozen_string_literal: true

require 'test_helper'

class TagsControllerTest < ActionDispatch::IntegrationTest
  def events_path(rest = '')
    "/api/events#{rest}"
  end

  test 'Index gets fixtures' do
    api_login

    luke_tag = tags :LukeTag

    data = api_get('/api/tags')
    Rails.logger.error("XXX: #{data}")
    assert_partial(
      [{
        name: luke_tag.tagname
      }], 
      data[:tags]
    )
    assert(false, 'continue testing from here')
    assert_includes(data[:languages], id: @hdi.id, name: 'Hdi')
    assert_empty data[:clusters]
    assert_includes(data[:people], id: @drew.id, first_name: 'Drew', last_name: 'Mambo')
    assert_equal 2018, data[:startYear]
    assert_equal({ create: true }, data[:can][:events])
  end

  # test 'Create' do
  #   api_login @drew
  #   new_event = new_taco_party
  #   data = api_post(events_path, event: new_event)
  #   new_event.delete(:event_participants_attributes)
  #   new_event[:event_participants] = [{ person_id: @kendall.id }]
  #   new_event.delete(:event_location_id)
  #   new_event[:location] = { id: @yde_loc.id, name: 'Yaoundé' }

  #   assert_partial(new_event, data[:events][0])
  #   assert_equal @drew, Event.find_by(name: 'Taco Party').creator
  # end

  # TODO
  # test 'Create Permissions' do
  #   api_login people(:Kevin)
  #   api_post(events_path, event: new_taco_party)
  #   assert_not_allowed
  # end

  # TODO
  # test 'Update' do
  #   api_login @drew
  #   data = api_put(
  #     events_path("/#{@hdi_gen_check.id}"),
  #     event: { end_date: '2018-02-06' }
  #   )
  #   assert_partial(
  #     { id: @hdi_gen_check.id, end_date: '2018-02-06' },
  #     data[:events][0]
  #   )
  #   @hdi_gen_check.reload
  #   assert_equal '2018-02-06', @hdi_gen_check.end_date
  #   # Creator was not changed:
  #   assert_equal @olga, @hdi_gen_check.creator
  # end
end
