module ApplicationHelper
  include TranslationHelper

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

  def color_from_sym(color)
    case color
      when :white
        '#FFFFFF'
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

  def forecolor_from_sym(color)
    case color
      when :white
        '#000000'
      when :red
        '#ffffff'
      when :orange
        '#000000'
      when :yellow
        '#000000'
      when :light_green
        '#000000'
      when :dark_green
        '#ffffff'
      when :light_blue
        '#000000'
      when :dark_blue
        '#ffffff'
      when :purple
        '#ffffff'
    end
  end

  def revealable_truncate(text, options={})
    length = options[:length] || 30
    return text if text.length <= length
    options[:escape] = false
    truncated = truncate(text, options).chomp('...')
    remainder = text[truncated.length, text.length - truncated.length]
    render 'shared/revealable_truncate', truncated: truncated, remainder: remainder
  end

  MAX_NOTIFICATIONS = 8
  def user_notifications
    notifications = current_user.notifications.where(read: false).to_a
    if notifications.count < MAX_NOTIFICATIONS
      notifications += current_user.notifications.where(read: true).limit(MAX_NOTIFICATIONS - notifications.count)
    end
    notifications
  end

  def strings_json(*keys)
    h = {}
    keys.each{ |key| h.merge!(I18n.t(key)) }
    return JSON.generate(h).html_safe
  end

  def model_path(instance)
    return "/#{instance.class.name.pluralize.underscore}/#{instance.id}"
  end

  def model_url(instance)
    return "dulu.sil.org" + model_path(instance)
  end
end
