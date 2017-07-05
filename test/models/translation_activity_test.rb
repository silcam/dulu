require 'test_helper'

class TranslationActivityTest < ActiveSupport::TestCase
  def setup
    @hdi_ezra = translation_activities :HdiEzraActivity
  end

  test "Name" do
    I18n.locale = :en
    assert_equal 'Ezra', @hdi_ezra.name
  end

  test "Search" do
    t_acs = TranslationActivity.search('ezra')
    ezra_list = t_acs[t_acs.index{|r| r[:title]=='Ezra'}][:subresults]
    hdi_ezra_result = ezra_list[ezra_list.index{|r| r[:title]=='Hdi'}]
    refute_nil hdi_ezra_result
  end
end
