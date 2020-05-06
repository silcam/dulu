# frozen_string_literal: true

require 'test_helper'

class WorkshopTest < ActiveSupport::TestCase
  def setup
    @grammar_ws = linguistic_activities(:EwondoGrammarIntro)
    @noun = workshops :Noun
    @verb = workshops :Verb
    @syntax = workshops :Syntax
    I18n.locale = :en
  end

  test 'Required Params Validation' do
    params = { linguistic_activity: @grammar_ws, name: 'Yo' }
    model_validation_hack_test Workshop, params
  end

  test 'Date from event' do
    exp = FuzzyDate.new(2018, 3)
    assert_equal exp, @grammar_ws.workshops[1].f_date
  end

  test 'Date from stage' do
    @noun.event.destroy
    exp = FuzzyDate.new(2018, 1, 21)
    assert_equal exp, @noun.f_date
  end

  test 'No Date' do
    assert_nil @grammar_ws.workshops[2].f_date
  end

  test 'Completed' do
    assert @grammar_ws.workshops.first.completed?
  end

  test 'Not completed' do
    refute @grammar_ws.workshops[1].completed?
  end

  test 'Complete with Event' do
    @verb.complete({})
    @verb.reload
    assert_equal 2, @grammar_ws.stages.count
    assert_equal :Verb, @verb.stage.name
    assert_equal '2018-03', @verb.stage.start_date
  end

  test 'Complete no Event' do
    @syntax.complete date: '2018-02'
    @syntax.reload
    assert_equal 2, @grammar_ws.stages.count
    assert_equal :Syntax, @syntax.stage.name
    assert_equal '2018-02', @syntax.stage.start_date
  end

  test 'Complete without date or event raises' do
    assert_raises(Exception) do
      @syntax.complete({})
    end
  end

  test 'To Hash' do
    Date.stub(:today, Date.new(2018, 1, 31)) do
      exp = {
        id: @noun.id,
        complete: true,
        completed_text: 'Completed',
        date: 'Jan 21, 2018',
        activity: @grammar_ws.to_hash
      }
      assert_equal exp, @noun.to_hash
    end
  end
end
