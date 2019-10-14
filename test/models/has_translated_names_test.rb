require "test_helper"

class HasTranslatedNamesTest < ActiveSupport::TestCase
  test "t_names" do
    exp = { en: "Genesis", fr: "Genèse" }
    assert_equal exp, bible_books(:Genesis).t_names
  end
end
