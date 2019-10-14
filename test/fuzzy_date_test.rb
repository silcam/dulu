require "test_helper"

class FuzzyDateTest < ActiveSupport::TestCase
  test "Some Valid Dates" do
    assert FuzzyDate.new(2017).validate!
    assert FuzzyDate.new(2017, 6).validate!
    assert FuzzyDate.new(1, 1, 1).validate!
    assert FuzzyDate.new(9999, 12, 31).validate!
    assert FuzzyDate.new(2016, 2, 29).validate!
  end

  test "Some Invalid Dates" do
    assert_raises(Exception) { FuzzyDate.new }
    assert_raises(Exception) { FuzzyDate.new(0) }
    assert_raises(Exception) { FuzzyDate.new(10000) }
    assert_raises(Exception) { FuzzyDate.new(2017, 0) }
    assert_raises(Exception) { FuzzyDate.new(2017, 13) }
    assert_raises(Exception) { FuzzyDate.new(2017, 2, 29) }
    assert_raises(Exception) { FuzzyDate.new(2017, 1, 0) }
  end

  test "Some Valid Dates From Strings" do
    assert FuzzyDate.from_string("2017").validate!
    assert FuzzyDate.from_string("2017-06").validate!
    assert FuzzyDate.from_string("0001-01-01").validate!
    assert FuzzyDate.from_string("9999-12-31").validate!
  end

  test "Some Invalid Dates From Strings" do
    assert_raises(Exception) { FuzzyDate.from_string(nil) }
    assert_raises(Exception) { FuzzyDate.from_string("") }
    assert_raises(Exception) { FuzzyDate.from_string("abc") }
    assert_raises(Exception) { FuzzyDate.from_string("99-01-01") }
    assert_raises(Exception) { FuzzyDate.from_string(" 2017-01-01") }
  end

  test "Some Messy String Input" do
    assert_equal(FuzzyDate.new(1999),
                 FuzzyDate.from_string("1999-1-01"))
    assert_equal(FuzzyDate.new(1999, 1),
                 FuzzyDate.from_string("1999-01-1"))
    assert_equal(FuzzyDate.new(2017),
                 FuzzyDate.from_string("2017/06/29"))
    assert_equal(FuzzyDate.new(2017, 6),
                 FuzzyDate.from_string("2017-06-2 "))
  end

  test "FDate from Date" do
    reformation_day = Date.new(1517, 10, 31)
    assert_equal(FuzzyDate.new(1517, 10, 31),
                 FuzzyDate.from_date(reformation_day))
    assert_raises(Exception) { FuzzyDate.from_date(nil) }
  end

  test "FDate Today" do
    assert FuzzyDate.today.validate!
  end

  test "FDate to String" do
    first_christmas = FuzzyDate.new(1, 12, 25)
    assert_equal("0001-12-25", first_christmas.to_s)
    first_easter = FuzzyDate.new(33, 4)
    assert_equal("0033-04", first_easter.to_s)
    columbus_sailed_the_ocean_blue = FuzzyDate.new 1492
    assert_equal("1492", columbus_sailed_the_ocean_blue.to_s)
  end

  test "FDate to Date" do
    assert_equal(Date.new(1611, 1, 1),
                 FuzzyDate.new(1611).to_date)
    assert_equal(Date.new(1917, 10, 1),
                 FuzzyDate.new(1917, 10).to_date)
    assert_equal(Date.new(1944, 6, 6),
                 FuzzyDate.new(1944, 6, 6).to_date)
  end

  test "Equal Dates" do
    assert FuzzyDate.new(1776, 7, 4) == FuzzyDate.new(1776, 7, 4)
    assert FuzzyDate.new(1987, 7) == FuzzyDate.new(1987, 7)
    assert FuzzyDate.new(1066) == FuzzyDate.new(1066)
  end

  test "Unequal Dates" do
    refute FuzzyDate.new(1939, 9, 1) == FuzzyDate.new(1939, 9)
    refute FuzzyDate.new(1984, 5) == FuzzyDate.new(1984)
    refute FuzzyDate.new(1234) == FuzzyDate.new(5678)
    refute FuzzyDate.new(1234, 5) == FuzzyDate.new(1234, 6)
    refute FuzzyDate.new(1234, 5, 6) == FuzzyDate.new(1234, 5, 7)
  end

  test "Lesser and Greater Dates" do
    assert Date.new(2017, 7, 1) < Date.new(2017, 7, 2)
    assert Date.new(2017, 7, 2) > Date.new(2017, 7, 1)
    assert Date.new(2017, 7, 31) < Date.new(2017, 8)
    assert Date.new(2017, 12, 31) < Date.new(2018)
    assert Date.new(2017, 7) < Date.new(2017, 7, 2)
    refute Date.new(2017, 7, 2) < Date.new(2017, 7)
    assert Date.new(2017) < Date.new(2017, 2)
    refute Date.new(2017, 2) < Date.new(2017)
  end

  test "FDates Before" do
    assert FuzzyDate.new(2017, 12, 31).before?(
      FuzzyDate.new(2018)
    )
    assert FuzzyDate.new(2017, 11, 30).before?(
      FuzzyDate.new(2017, 12)
    )
    assert FuzzyDate.new(2017, 11, 29).before?(
      FuzzyDate.new(2017, 11, 30)
    )
    assert FuzzyDate.new(2017, 4).before?(
      FuzzyDate.new(2017, 5, 1)
    )
    assert FuzzyDate.new(2017).before?(
      FuzzyDate.new(2018, 1)
    )
  end

  test "FDates Not Before" do
    refute FuzzyDate.new(2018, 1, 1).before?(
      FuzzyDate.new(2017, 12, 31)
    )
    refute FuzzyDate.new(2018, 2, 1).before?(
      FuzzyDate.new(2018, 1, 31)
    )
    refute FuzzyDate.new(2018, 2, 2).before?(
      FuzzyDate.new(2018, 2, 2)
    )
    refute FuzzyDate.new(2018, 2).before?(
      FuzzyDate.new(2018, 2, 28)
    )
    refute FuzzyDate.new(2018).before?(
      FuzzyDate.new(2018, 12, 31)
    )
  end

  test "FDates After and Not" do
    assert FuzzyDate.new(2017).after?(FuzzyDate.new(2016))
    refute FuzzyDate.new(2017).after?(FuzzyDate.new(2017, 1, 1))
  end

  test "Coincidental FDates" do
    fdate = FuzzyDate.new(2017, 6, 29)
    assert fdate.coincident? FuzzyDate.new(2017, 6, 29)
    assert fdate.coincident? FuzzyDate.new(2017, 6)
    assert fdate.coincident? FuzzyDate.new(2017)
    refute fdate.coincident? FuzzyDate.new(2017, 6, 28)
    refute fdate.coincident? FuzzyDate.new(2017, 5)
    refute fdate.coincident? FuzzyDate.new(2019)
  end

  test "The Future" do
    assert FuzzyDate.new(3000).future?
    refute FuzzyDate.new(2017).future?
  end

  test "The Past" do
    assert FuzzyDate.new(2017, 6, 28).past?
    refute FuzzyDate.new(3000).past?
  end

  test "FDate Pretty Print! Just Year" do
    I18n.locale = :en
    assert_equal "2017", FuzzyDate.new(2017).pretty_print
  end

  test "FDate Pretty Print! No Day" do
    I18n.locale = :en
    # Not applicable with current pretty print logic
    # assert_equal 'Jan 2017', FuzzyDate.new(Date.today.year, 1).pretty_print
    # Date.stub :today, Date.new(2017, 12, 1) do
    #   assert_equal 'Feb 2018', FuzzyDate.new(2018, 2).pretty_print
    # end
    assert_equal "Jan 2016", FuzzyDate.new(2016, 1).pretty_print
  end

  test "FDate Pretty Print! With Day" do
    I18n.locale = :en
    # Not applicable with current pretty print logic
    # assert_equal 'Dec 31, 2017', FuzzyDate.new(Date.today.year, 12, 31).pretty_print
    # Date.stub :today, Date.new(2017, 11, 15) do
    #   assert_equal 'Jan 15, 2018', FuzzyDate.new(2018, 1, 15).pretty_print
    # end
    assert_equal "Sep 25, 2010", FuzzyDate.new(2010, 9, 25).pretty_print
  end

  test "FDate Pretty Print! Close" do
    I18n.locale = :en
    Date.stub :today, Date.new(2017, 7, 1) do
      assert_equal "Today", FuzzyDate.new(2017, 7, 1).pretty_print
      assert_equal "Yesterday", FuzzyDate.new(2017, 6, 30).pretty_print
      assert_equal "Tomorrow", FuzzyDate.new(2017, 7, 2).pretty_print
      assert_equal "In 4 days", FuzzyDate.new(2017, 7, 5).pretty_print
      assert_equal "4 days ago", FuzzyDate.new(2017, 6, 27).pretty_print
    end
  end

  test "Invalid Editing" do
    fdate = FuzzyDate.new(2017, 6, 29)
    assert_raises(Exception) { fdate.year = 0 }
    assert_raises(Exception) { fdate.month = 13 }
    assert_raises(Exception) { fdate.day = 31 }

    fdate = FuzzyDate.new(2017)
    assert_raises(Exception, "Shouldn't set day without month") { fdate.day = 1 }
  end
end
