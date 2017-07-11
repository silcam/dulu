class FuzzyDateValidator < ActiveModel::EachValidator

  # For Testing see stage_test.rb

  def validate_each(record, attribute, value)
    return if value.blank?
    begin
      fdate = FuzzyDate.from_string value
      unless value == fdate.to_s
        record.errors.add(attribute, "Invalid Date")
      end
    rescue FuzzyDateException => e
      record.errors.add(attribute, "Invalid Date")
    end
  end
end