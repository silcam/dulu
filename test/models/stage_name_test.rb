require 'test_helper'

class StageNameTest < ActiveSupport::TestCase
  test 'next stage' do
    stagename = StageName.find_by(level: 1, kind: :translation)
    last_translation_level = StageName.last_stage(:translation).level
    (2..last_translation_level).each do |i|
      stagename = stagename.next_stage
      assert_equal i, stagename.level
    end
    assert_equal stagename.id, stagename.next_stage.id
  end

  test 'first translation stage' do
    assert_equal 'Planned', StageName.first_translation_stage.name
  end

  test "Translation Stages" do
    t_stages = StageName.translation_stages
    planned = stage_names :Planned
    published = stage_names :Published
    assert_equal(planned, t_stages.first)
    assert_equal(published, t_stages.last)
  end
end
