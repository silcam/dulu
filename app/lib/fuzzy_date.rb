class FuzzyDate
  attr_accessor :year, :month, :day

  def initialize(year, month=nil, day=nil)
    @year = year.to_i
    @month = month.to_i
    @day = day.to_i
  end

  def self.from_string(datestring)
    raise 'FuzzyDate string must start with 4 digits' unless /^\d{4}/ === datestring

    year = datestring[0,4]
    month = (/^\d{4}-\d{2}/ === datestring) ? datestring[5,2] : nil
    day = (/^\d{4}-\d{2}-\d{2}/ === datestring) ? datestring[8,2] : nil

    FuzzyDate.new(year, month, day)
  end

  def self.from_date(date)
    FuzzyDate.new(date.year, date.month, date.day)
  end

  def to_s
    s = @year.to_s
    s += '-' + @month.to_s if @month
    s += '-' + @day.to_s if @day && @month
  end

  def to_date
    day = @day ? @day : 1
    month = @month ? @month : 1
    Date.new(@year, month, day)
  end

  def before? date2
    return (@year < date2.year) unless @year == date2.year
    return false unless @month && date2.month
    return (@month < date2.month) unless @month == date2.month
    return false unless @day && date2.day
    return @day < date2.day
  end

  def after? date2
    return date2.before?(self)
  end

  def coincident? date2
    return false unless @year == date2.year
    return true unless @month && date2.month
    return false unless @month == date2.month
    return true unless @day && date2.day
    return @day == date2.day
  end

  def pretty_print
    if @month.nil?
      I18n.l to_date, "%Y"
    elsif @day.nil?
      pretty_print_no_day
    else
      pretty_print_with_day
    end
  end

  private

  def pretty_print_no_day
    if @year == Date.today.year
      I18n.l to_date, "%B"
    elsif (Date.today..Date.today>>2) === to_date
      I18n.l to_date, "%B"
    else
      I18n.l to_date, "%B %Y"
    end
  end

  def pretty_print_with_day
    daydiff = (to_date - Date.today).to_i
    if (-4..4) === daydiff
      pretty_print_close_date daydiff
    elsif Date.today.year == @year ||
          (Date.today .. Date.today>>2) === to_date
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


  # Cute but misguided attempt
  # def strftime format
  #   unless @day
  #     format.gsub!(/%[dejAauw]/, '')
  #     format.gsub!(/%[+c]/, '%b %Y')
  #     format.gsub!(/%[Dx]/, '%m/%Y')
  #     format.gsub!('%F', '%Y-%m')
  #   end
  # end
end