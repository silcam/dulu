require 'test_helper'

class BibleBookTest < ActiveSupport::TestCase

  test "testament getters" do
    ot = BibleBook.get_old_testament
    assert_equal 39, ot.length 
    assert_equal "Genesis", ot.first.name
    assert_equal "Malachi", ot.last.name

    nt = BibleBook.get_new_testament
    assert nt.length == 27
    assert nt.first.name = "Matthew"
    assert nt.last.name = "Revelation"
  end

  test "verse counters" do
    assert BibleBook.verses_in_bible == 30986
    assert BibleBook.verses_in_old_testament == 23029
    assert BibleBook.verses_in_new_testament == 7957
  end

end
