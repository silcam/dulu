require 'test_helper'

class LinguisticActivityTest < ActiveSupport::TestCase

  def setup
    @ewondo = languages(:Ewondo)
    @grammar_ws = linguistic_activities(:EwondoGrammarIntro)
    @le_paper = linguistic_activities(:LePaper)
  end

  test "Workshop stages" do
    exp = %w[ Noun Verb Syntax ]
    assert_equal exp, @grammar_ws.available_stages
  end

  test "Research Stages" do
    exp = Stage::LINGUISTIC_STAGES
    assert_equal exp, @le_paper.available_stages
  end

  test "Progress" do
    percent, color = @grammar_ws.progress
    assert_equal 33, percent
  end

  test "Progress - no progress" do
    @grammar_ws.stages = []
    percent, color = @grammar_ws.progress
    assert_equal 0, percent
  end

  test "Progress - no workshops" do
    @grammar_ws.workshops = []
    percent, color = @grammar_ws.progress
    assert_equal 0, percent
  end

  test "New Research Activity is Empty" do
    assert LinguisticActivity.create!(language: @ewondo, category: 'Research', title: 'Title').empty_activity?
  end

  test "Workshop Activity with a workshop is not Empty" do
    params = ActionController::Parameters.new category: 'Workshops', title: 'T', workshops: ['One']
    refute LinguisticActivity.build(params, @ewondo, []).empty_activity?
  end

  # test "ws_stages" do
  #   exp = [{workshop: workshops(:Noun), stage: stages(:EwondoGrammarNoun)},
  #          {workshop: workshops(:Verb), stage: nil},
  #          {workshop: workshops(:Syntax), stage: nil}]
  #   assert_equal exp, @grammar_ws.ws_stages
  # end

  test "Build Research" do
    params = ActionController::Parameters.new category: 'Research', title: 'Cool Stuff'
    participants = [participants(:KendallEwondo)]
    LinguisticActivity.build(params, @ewondo, participants)
    cool_stuff = LinguisticActivity.find_by title: 'Cool Stuff'
    assert_equal @ewondo, cool_stuff.language
    assert_equal :Research, cool_stuff.category
    assert_includes cool_stuff.participants, participants(:KendallEwondo)
  end

  test "Build Workshops" do
    params = ActionController::Parameters.new category: 'Workshops', title: 'Cool Workshops'
    params['workshops'] = ['ws1', 'ws2']
    LinguisticActivity.build(params, @ewondo, [])
    cool_shops = LinguisticActivity.find_by title: 'Cool Workshops'
    assert_equal @ewondo, cool_shops.language
    assert_equal :Workshops, cool_shops.category
    exp = %w[ ws1 ws2 ]
    assert_equal exp, cool_shops.workshops.collect{|ws| ws.name}
    exp = [1, 2]
    assert_equal exp, cool_shops.workshops.collect{|ws| ws.number}
    assert_equal :Planned, cool_shops.stage_name
  end

  def base_ws_params
    @nounid = workshops(:Noun).id.to_s
    @verbid = workshops(:Verb).id.to_s
    @syntaxid = workshops(:Syntax).id.to_s
    ActionController::Parameters.new(
        'workshops' => {
            @nounid => {
                'name' => 'Noun',
                'number' => '1',
                'completed' => true
            },
            @verbid => {
                'name' => 'Verb',
                'number' => '2'
            },
            @syntaxid => {
                'name' => 'Syntax',
                'number' => '3'
            },
        }
    )
  end

  test "Update Workshop Completion" do
    params = base_ws_params
    params[:workshops][@nounid].delete ('completed')
    @grammar_ws.update_workshops(params)
    assert_empty @grammar_ws.stages
    assert_equal :Planned, @grammar_ws.stage_name
  end

  test "Update Workshop Name" do
    params = base_ws_params
    params[:workshops][@verbid]['name'] = 'Homemade Pizza'
    @grammar_ws.update_workshops(params)
    assert_equal 'Homemade Pizza', @grammar_ws.workshops[1].name
  end

  test "Remove Workshop" do
    # refute_nil Event.find_by(name: 'Workshop: Noun')
    params = base_ws_params
    params[:workshops].delete(@nounid)
    @grammar_ws.update_workshops(params)
    assert_equal 2, @grammar_ws.workshops.count
    assert_empty @grammar_ws.stages
    assert_nil Event.find_by(name: 'Workshop: Noun')
  end

  test "Insert Workshops" do
    params = base_ws_params
    params[:workshops][@nounid]['number'] = '4'
    params['new_workshops'] = ['Taco Party', 'Eat More Tacos']
    params['new_workshop_numbers'] = ['1','5']
    @grammar_ws.update_workshops(params)
    @grammar_ws.reload
    assert_equal 5, @grammar_ws.workshops.count
    assert_equal 'Taco Party', @grammar_ws.workshops.first.name
    assert_equal 'Noun', @grammar_ws.workshops[3].name
  end
end