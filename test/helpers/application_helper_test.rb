require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase
  test 't_hash' do
    exp = {en: 'Name', fr: 'Nom'}
    assert_equal exp, t_hash(:Name)
    
    # For a key that doesn't exist
    exp = {en: 'Pepperoni Pizza', fr: 'Pepperoni Pizza'}
    assert_equal exp, t_hash(:Pepperoni_pizza)
  end
end