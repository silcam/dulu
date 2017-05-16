require 'test_helper'

class StageNameTest < ActiveSupport::TestCase
  test 'next stage' do
    stagename = StageName.find_by(level: 1, kind: 'Translation')
    (2..StageName::LAST_TRANSLATION_STAGE).each do |i|
      stagename = stagename.next_stage
      assert_equal i, stagename.level
    end
    assert_equal stagename.id, stagename.next_stage.id
  end

end
