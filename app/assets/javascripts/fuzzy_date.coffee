valid_day = (year, month, day) ->
  year = 2016 if year == ''
  return false if month=='' and day!=''
  days_in_month = new Date(year, month, 0).getDate(); #Jan=0 for Date constructor
  range = [1..days_in_month]
  return parseInt(day) in range

valid_year = (year) ->
  return false if isNaN(year)
  return false if year < 1
  return false if year > 9999
  return true

window.validate_fuzzy_date_form = (form) ->
  success = true
  form.find('div.fuzzy-div[data-required-date=true]').each ->
    year = $(this).find('.fuzzy-year').val()
    month = $(this).find('.fuzzy-month').val()
    day = $(this).find('.fuzzy-day').val()
    unless valid_year(year)
      $(this).find('span.fd-year').prop('class', 'fd-year has-error')
      $(this).find('div.fuzzy-error-year').show()
      success = false
    unless day=='' or valid_day(year, month, day)
      $(this).find('span.fd-day').prop('class', 'fd-day has-error')
      $(this).find('div.fuzzy-error-day').show()
      success = false
  return success
    
$(document).ready ->    
  $("input.fuzzy-field").blur ->
    # This for changes to year in text box
    top_div = $(this).closest('div.fuzzy-div')
    required = top_div.data('required-date')
    year = $(this).val()
    if (not required and year=='') or valid_year(year)
      $(this).closest('span.fd-year').prop('class', 'fd-year')
      top_div.find('div.fuzzy-error-year').hide()
    else
      $(this).closest('span.fd-year').prop('class', 'fd-year has-error')
      top_div.find('div.fuzzy-error-year').show()

  $('.fuzzy-field').change ->
    top_div = $(this).closest('div.fuzzy-div')
    year = top_div.find('.fuzzy-year').val()
    month = top_div.find('.fuzzy-month').val()
    day = top_div.find('.fuzzy-day').val()
    if month=='' or day=='' or valid_day(year, month, day)
      top_div.find('span.fd-day').prop('class', 'fd-day')
      top_div.find('div.fuzzy-error-day').hide()
    else
      top_div.find('span.fd-day').prop('class', 'fd-day has-error')
      top_div.find('div.fuzzy-error-day').show()


