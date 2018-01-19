module ApplicationHelper
  def assemble_dates(params, model, *fields)
    fields.each do |field|
      if params[model]["#{field}_y"]
        begin
          fdate = FuzzyDate.new(params[model]["#{field}_y"],
                                params[model]["#{field}_m"],
                                params[model]["#{field}_d"])
          params[model][field] = fdate.to_s
        rescue FuzzyDateException => e
          # Bad Data. Set nothing and allow it to fail validation if the field is required
          # Downside: fields that aren't required will be silently ignored which may surprise the user
          # Solution: JS Validation
        end
      end
    end
  end

  def safe_t(*args)
    begin
      I18n.t(*args)
    rescue Exception
      ''
    end
  end

  def t_select_options(array, selected=nil)
    options_for_select(array.collect{ |item| [t(item), item]}, selected)
  end

  def color_from_sym(color)
    case color
      when :red
        '#A93226'
      when :orange
        '#CA6F1E'
      when :yellow
        '#F4D03F'
      when :light_green
        '#58D68D'
      when :dark_green
        '#1E8449'
      when :light_blue
        '#5DADE2'
      when :dark_blue
        '#21618C'
      when :purple
        '#6C3483'
    end
  end
end
