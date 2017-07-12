module ApplicationHelper
  def assemble_dates(params, model, *fields)
    fields.each do |field|
      if params[model]["#{field}_y"]
        # year = set_length_string(params[model]["#{field}_y"], 4)
        # month = set_length_string(params[model]["#{field}_m"], 2)
        # day = set_length_string(params[model]["#{field}_d"], 2)
        # params[model][field] = "#{year}-#{month}-#{day}"
        begin
          fdate = FuzzyDate.new(params[model]["#{field}_y"],
                                params[model]["#{field}_m"],
                                params[model]["#{field}_d"])
          params[model][field] = fdate.to_s
        rescue FuzzyDateException => e
          # params[model][field] = ''
          # Bad Data. Set nothing and allow it to fail validation if the field is required
          # Downside: fields that aren't required will be silently ignored which may surprise the user
          # Probable Solution: JS Validation
          # TODO: revisit this downside
        end
      end
    end
  end

  # def set_length_string(str, len)
  #   if str.length < len
  #     (len - str.length).times{ str = '0' + str}
  #   end
  #   str
  # end

end
