# frozen_string_literal: true

require 'test_helper'

class ActivitiesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people :Drew
    @hdi = languages :Hdi
    @ewondo = languages :Ewondo
    @hdi_ezra = translation_activities :HdiEzra
    @drew_hdi = participants :DrewHdi
    @abanda_hdi = participants :AbandaHdi
    @ewondo_ws = linguistic_activities :EwondoGrammarIntro
    @ewondo_research = linguistic_activities :LePaper
    @kendall_ewondo = participants :KendallEwondo
    @hdi_audio_john = media_activities :HdiAudioJohn
  end

  def act_path(rest = '')
    "/api/activities#{rest}"
  end

  test 'Index - Hdi' do
    api_login

    # All Domains
    data = api_get(act_path("?language_id=#{@hdi.id}"))
    assert_equal(5, data[:activities].length)

    # Linguistic
    data = api_get(act_path("?language_id=#{@hdi.id}&domain=linguistic"))
    assert_equal(0, data[:activities].length)

    # Media
    data = api_get(act_path("?language_id=#{@hdi.id}&domain=media"))
    assert_equal(2, data[:activities].length)
    assert_equal([{
                   id: 527514428, 
                   type: 'MediaActivity', 
                   category: 'Film', 
                   language_id: 876048951, 
                   bible_book_id: nil, 
                   title: nil, 
                   participant_ids: [], 
                   stage_name: 'Planned',
                   stage_date: nil,
                   scripture: nil,
                   film: 'LukeFilm'
                 }, {
                   id: 376441502, 
                   type: 'MediaActivity',
                   category: 'AudioScripture',
                   language_id: 876048951, 
                   bible_book_id: nil,
                   title: nil, 
                   participant_ids: [],
                   stage_name: 'Planned',
                   stage_date: nil,
                   scripture: 'Other',
                   film: nil
                 }], data[:activities])

    # Translation
    data = api_get(act_path("?language_id=#{@hdi.id}&domain=translation"))
    assert_equal(3, data[:activities].length)
    assert_includes(data[:activities], 
                    id: @hdi_ezra.id,
                    type: 'TranslationActivity',
                    category: nil,
                    language_id: @hdi.id,
                    bible_book_id: 15,
                    title: nil,
                    participant_ids: [@drew_hdi.id, @abanda_hdi.id],
                    name: 'Ezra',
                    stage_name: 'Drafting',
                    stage_date: '2017-02',
                    scripture: nil,
                    film: nil)
  end

  test 'Index - Ewondo Linguistic' do
    api_login
    data = api_get(act_path("?language_id=#{@ewondo.id}&domain=linguistic"))
    assert_equal([{
                   id: @ewondo_ws.id, 
                   type: 'LinguisticActivity', 
                   category: 'Workshops', 
                   language_id: @ewondo.id,
                   bible_book_id: nil, 
                   title: 'Grammar Intro', 
                   participant_ids: [@kendall_ewondo.id], 
                   name: 'Workshops: Grammar Intro', 
                   stage_name: 'Noun',
                   stage_date: '2018-01-21',
                   scripture: nil,
                   film: nil,
                   workshops: [{
                     id: 558284262, 
                     name: 'Noun',
                     event_id: 773726370,
                     completed: true, 
                     activityId: 364981178, 
                     date: '2018-01-21'
                   }, {
                     id: 1066114473,
                     name: 'Verb', 
                     event_id: 535197996,
                     completed: false,
                     activityId: 364981178,
                     date: '2018-03'
                   }, {
                     id: 623098385, 
                     name: 'Syntax', 
                     event_id: nil,
                     completed: false, 
                     activityId: 364981178, 
                     date: ''
                   }]
                 }, {
                   id: @ewondo_research.id,
                   type: 'LinguisticActivity',
                   category: 'Research', 
                   language_id: @ewondo.id, 
                   bible_book_id: nil, 
                   title: 'Lə the Complementizer', 
                   participant_ids: [@kendall_ewondo.id], 
                   name: 'Research: Lə the Complementizer', 
                   stage_name: 'Research',
                   stage_date: '2017-12',
                   scripture: nil,
                   film: nil
                 }], data[:activities])
    
  end

  test 'Show Translation' do
    api_login
    data = api_get(act_path("/#{@hdi_ezra.id}"))
    assert_equal({
                   id: 1071624995,
                   bible_book_id: 15, 
                   type: 'TranslationActivity', 
                   category: nil,
                   title: nil,
                   scripture: nil, 
                   film: nil, 
                   participant_ids: [126806499, 105867163], 
                   stage_name: 'Drafting',
                   language_id: 876048951,
                   stage_date: '2017-02',
                   stages: [
                     { id: 781407540, name: 'Drafting', start_date: '2017-02', activity_id: 1071624995 },
                     { id: 87382440, name: 'Planned', start_date: '2017-01', activity_id: 1071624995 }
                   ],
                   can: { update: true }
                 }, data[:activities][0])
  end

  test 'Show Research' do
    api_login
    data = api_get(act_path("/#{@ewondo_research.id}"))
    assert_equal({
                   id: 252176021, 
                   bible_book_id: nil, 
                   type: 'LinguisticActivity', 
                   category: 'Research', 
                   title: 'Lə the Complementizer', 
                   scripture: nil, 
                   film: nil, 
                   participant_ids: [382867506], 
                   stage_name: 'Research',
                   language_id: 406181303, 
                   stage_date: '2017-12', 
                   stages: [
                     { id: 920173637, name: 'Research', start_date: '2017-12', activity_id: 252176021 }
                   ], 
                   can: { update: false }
                 }, data[:activities][0])
  end

  test 'Show Workshops' do
    api_login
    data = api_get(act_path("/#{@ewondo_ws.id}"))
    assert_equal({
                   id: 364981178,
                   bible_book_id: nil,
                   type: 'LinguisticActivity', 
                   category: 'Workshops', 
                   title: 'Grammar Intro', 
                   scripture: nil,
                   film: nil,
                   participant_ids: [382867506],
                   stage_name: 'Noun',
                   language_id: 406181303,
                   stage_date: '2018-01-21', 
                   stages: [{ id: 537163012, name: 'Noun', start_date: '2018-01-21', activity_id: 364981178 }],
                   can: { update: false }, 
                   workshops: [{
                     id: 558284262, 
                     name: 'Noun',
                     event_id: 773726370,
                     completed: true, 
                     activityId: 364981178, 
                     date: '2018-01-21'
                   }, {
                     id: 1066114473,
                     name: 'Verb', 
                     event_id: 535197996,
                     completed: false,
                     activityId: 364981178,
                     date: '2018-03'
                   }, {
                     id: 623098385, 
                     name: 'Syntax', 
                     event_id: nil,
                     completed: false, 
                     activityId: 364981178, 
                     date: ''
                   }]
                 }, data[:activities][0])
  end

  test 'Show Media' do
    api_login
    data = api_get(act_path("/#{@hdi_audio_john.id}"))
    assert_equal({
                   id: 376441502, 
                   bible_book_id: nil, 
                   type: 'MediaActivity',
                   category: 'AudioScripture',
                   title: nil,
                   scripture: 'Other',
                   film: nil, 
                   participant_ids: [],
                   stage_name: 'Planned',
                   language_id: 876048951,
                   bible_book_ids: [43],
                   stage_date: nil,
                   stages: [], 
                   can: { update: true }
                 }, data[:activities][0])
  end

  test 'Add Drew to Hdi Audio John' do
    api_login @drew
    data = api_put(act_path("/#{@hdi_audio_john.id}"), activity: { participant_ids: [@drew_hdi.id] })
    assert_equal(
      [@drew_hdi.id],
      data[:activities][0][:participant_ids]
    )
  end

  test 'Remove Drew from Hdi Ezra' do
    api_login @drew
    data = api_put(act_path("/#{@hdi_audio_john.id}"), activity: { participant_ids: [@abanda_hdi.id] })
    assert_equal(
      [@abanda_hdi.id],
      data[:activities][0][:participant_ids]
    )
  end
end
  