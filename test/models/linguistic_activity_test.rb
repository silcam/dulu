require 'test_helper'

class LinguisticActivityTest < ActiveSupport::TestCase

  def setup
    @ewondo = programs(:Ewondo)
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
    assert_equal @ewondo, cool_stuff.program
    assert_equal :Research, cool_stuff.category
    assert_includes cool_stuff.participants, participants(:KendallEwondo)
  end

  test "Build Workshops" do
    params = ActionController::Parameters.new category: 'Workshops', title: 'Cool Workshops'
    params['workshops'] = ['ws1', 'ws2']
    LinguisticActivity.build(params, @ewondo, [])
    cool_shops = LinguisticActivity.find_by title: 'Cool Workshops'
    assert_equal @ewondo, cool_shops.program
    assert_equal :Workshops, cool_shops.category
    exp = %w[ ws1 ws2 ]
    assert_equal exp, cool_shops.workshops.collect{|ws| ws.name}
    exp = [1, 2]
    assert_equal exp, cool_shops.workshops.collect{|ws| ws.number}
    assert_equal :Planned, cool_shops.stage_name
  end
end