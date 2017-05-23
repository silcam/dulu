module ApplicationHelper

  def pretty_format date
    daydiff = (date - Date.today).to_i
    if daydiff == 0
      return today_date

    elsif daydiff == -1
      return yesterday_date

    elsif daydiff == 1
      return tomorrow_date

    elsif (2..4) === daydiff
      return upcoming_date daydiff

    elsif (-4..-2) === daydiff
      return recent_date( 0 - daydiff )

    elsif Date.today.year == date.year
      return date_this_year date

    elsif (0..2) === (date.month - Date.today.month)
      return date_this_year date

    else
      return regular_date date
    end
  end

  def today_date
    return "Aujourd'hui" if I18n.locale == :fr
    return "Today"
  end

  def yesterday_date
    return "Hier" if I18n.locale == :fr
    return "Yesterday"
  end

  def tomorrow_date
    return "Demain" if I18n.locale == :fr
    return "Tomorrow"
  end

  def upcoming_date daydiff
    return "Dans #{daydiff} jours" if I18n.locale == :fr
    return "In #{daydiff} days"
  end

  def recent_date daydiff
    return "Il y a #{daydiff} jours" if I18n.locale == :fr
    return "#{daydiff} days ago"
  end

  def date_this_year date
    return I18n.l(date, format: "%d %B") if I18n.locale == :fr
    return date.strftime("%B %d")
  end

  def regular_date date
    return I18n.l(date, format: "%d %B %Y") if I18n.locale == :fr
    return date.strftime("%B %d, %Y")
  end
end
