class FuzzyDate
  include Comparable
  attr_accessor :year, :month, :day

  def initialize(year, month=nil, day=nil)
    @year = year.to_i
    @month = month.blank? ? nil : month.to_i
    @day = day.blank? ? nil : day.to_i
    validate!
  end

  def validate!
    fd_raise 'Year out of range' unless (1..9999) === @year
    fd_raise 'Day must be nil if month is nil' if(@month.nil? && !@day.nil?)
    return true if @month.nil?
    fd_raise 'Month out of range' unless (1..12) === @month
    return true if @day.nil?
    fd_raise 'Day out of range' unless (1..Time.days_in_month(@month, @year)) === @day
    return true
  end

  def self.from_string(datestring)
    fd_raise 'Year must have 4 digits' unless /^\d{4}/ === datestring

    year = datestring[0,4]
    month = (/^\d{4}-\d{2}/ === datestring) ? datestring[5,2] : nil
    day = (/^\d{4}-\d{2}-\d{2}/ === datestring) ? datestring[8,2] : nil

    FuzzyDate.new(year, month, day)
  end

  def self.from_date(date)
    FuzzyDate.new(date.year, date.month, date.day)
  end

  def self.today
    FuzzyDate.from_date Date.today
  end

  def year= year
    @year = year
    validate!
  end

  def month= month
    @month = month
    validate!
  end

  def day= day
    @day = day
    validate!
  end

  def to_s
    s = set_length_string(@year, 4)
    s += '-' + set_length_string(@month, 2) if @month
    s += '-' + set_length_string(@day, 2) if @day && @month
    s
  end

  def set_length_string(number, len)
    s = number.to_s
    if s.length < len
      (len - s.length).times{ s = '0' + s}
    end
    s
  end

  def to_date
    day = @day ? @day : 1
    month = @month ? @month : 1
    Date.new(@year, month, day)
  end

  def <=>(date2)
    if @year == date2.year
      if @month == date2.month
        return (@day || 0) <=> (date2.day || 0)
      end
      return (@month || 0) <=> (date2.month || 0)
    end
    return @year <=> date2.year
  end

  def before?(date2)
    return (@year < date2.year) unless @year == date2.year
    return false unless @month && date2.month
    return (@month < date2.month) unless @month == date2.month
    return false unless @day && date2.day
    return @day < date2.day
  end

  def after?(date2)
    return date2.before?(self)
  end

  def coincident? date2
    return false unless @year == date2.year
    return true unless @month && date2.month
    return false unless @month == date2.month
    return true unless @day && date2.day
    return @day == date2.day
  end

  def future?
    return after? FuzzyDate.today
  end

  def past?
    return before? FuzzyDate.today
  end

  def pretty_print(options={})
    options[:always_year] = true unless options[:not_always_year]
    if @month.nil?
      I18n.l to_date, format: "%Y"
    elsif @day.nil?
      pretty_print_no_day options
    else
      pretty_print_with_day options
    end
  end

  private

  def pretty_print_no_day(options)
    if @year == Date.today.year && !options[:always_year]
      I18n.l to_date, format: "%b"
    elsif (Date.today..Date.today>>2) === to_date && !options[:always_year]
      I18n.l to_date, format: "%b"
    else
      I18n.l to_date, format: "%b %Y"
    end
  end

  def pretty_print_with_day(options)
    daydiff = (to_date - Date.today).to_i
    if (-4..4) === daydiff and not options[:no_relative_dates]
      pretty_print_close_date daydiff
    elsif !options[:always_year] && (Date.today.year == @year || (Date.today .. Date.today>>2) === to_date)
      I18n.l to_date, format: :month_day
    else
      I18n.l to_date, format: :full
    end
  end

  def pretty_print_close_date(daydiff)
    case daydiff
      when 0
        I18n.t :Today
      when -1
        I18n.t :Yesterday
      when 1
        I18n.t :Tomorrow
      when (2..4)
        I18n.t :In_a_few_days, days: daydiff
      when (-4..-2)
        I18n.t :A_few_days_ago, days: 0-daydiff
    end
  end

  def fd_raise(msg)
    FuzzyDate.fd_raise(msg)
  end

  def self.fd_raise(msg)
    raise FuzzyDateException.new(msg)
  end
end

class FuzzyDateException < Exception

end