class Period
  attr_reader :start, :finish

  def initialize(hash)
    @start = YearMonth.from_hash hash[:start]
    @finish = YearMonth.from_hash hash[:end]
  end

  def to_h
    return {
      start: @start.to_h,
      end: @finish.to_h
    }
  end
end