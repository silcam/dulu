# frozen_string_literal: true

require 'test_helper'

class TranslationHelperTest < ActiveSupport::TestCase
  include TranslationHelper

  test 't_nested' do
    params = t_params(
      'notification.new_stage', 
      user_name: 'Jojo',
      language_name: 'Anglish',
      stage_name: t_params(:Drafting),
      activity_name: t_params(
        :Audio_x,
        x: t_params(:New_testament)
      )
    )
    assert_equal(
      'Jojo updated Audio New Testament to the Drafting stage for the Anglish program.',
      t_nested(params, :en)
    )
  end
end
