require 'test_helper'

class LanguageTest < ActiveSupport::TestCase
  def setup
    @hdi = languages :Hdi
  end

  test 'Relations' do
    developing = language_statuses :Developing
    cameroon = countries :Cameroon
    far_north = cameroon_regions :FarNorth
    hdi_program = programs :HdiProgram

    assert_equal developing, @hdi.language_status
    assert_equal cameroon, @hdi.country
    assert_equal far_north, @hdi.cameroon_region
    assert_includes@hdi.programs, hdi_program
    # TODO assert_equal hdi_program, @hdi.program
  end
end
