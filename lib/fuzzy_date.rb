class FuzzyDate
  attr_accessor :year, :month, :day

  def initialize(year, month=nil, day=nil)
    @year = year
    @month = month
    @day = day
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
    Date.new(@year, (@month || 1), (@day || 1))
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