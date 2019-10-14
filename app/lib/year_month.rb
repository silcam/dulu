class YearMonth
  attr_reader :year, :month

  def initialize(year, month)
    @year = year.to_i
    @month = month.to_i
  end

  def YearMonth.from_hash(hash)
    return YearMonth.new(hash[:year], hash[:month])
  end

  def to_s
    "#{@year}-#{zero_pad(@month, 2)}"
  end

  def to_h
    return { year: @year, month: @month }.with_indifferent_access
  end

  def zero_pad(num, len)
    str = num.to_s
    needed = len - str.length
    return str if needed <= 0
    return (1..needed).map { "0" }.join + str
  end
end
