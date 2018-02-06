# Edit Workshops Form
check_for_last_row = () ->
  remove_btns = $('tr:visible').find('a[data-remove-workshop]')
  if remove_btns.length == 1
    remove_btns.fadeOut()
  else
    remove_btns.fadeIn()

remove_workshop = (btn) ->
  row = $(btn).closest('tr')
  row.removeAttr('class')
  row.find('input').prop('disabled', true)
  row.css('text-decoration', 'line-through')
  row.find('label').fadeOut('fast')
  row.find('a').fadeOut('fast', ->
    $(this).remove()
    check_for_last_row()
  )
  row.nextAll('tr.workshop').each ->
    plus_equals($(this).find('input[type=hidden]'), -1)

remove_added_workshop = (btn) ->
  row = $(btn).closest('tr')
  row.nextAll('tr.workshop').each ->
    plus_equals($(this).find('input[type=hidden]'), -1)
  row.fadeOut('fast', ->
    $(this).remove()
    check_for_last_row()
  )

add_workshop = (btn) ->
  tbody = $(btn).closest('form').find('tbody').first()
  new_tr = $('#components').find('tr.workshop').clone()
  number = tbody.find('tr.workshop').length + 1
  new_tr.find("input[name='new_workshop_numbers[]']").val(number)
  new_tr.find('a[data-move-workshop-up]').click (e) ->
    e.preventDefault()
    move_workshop_up(this)
  new_tr.find('a[data-remove-workshop]').click (e) ->
    e.preventDefault()
    remove_added_workshop(this)
  tbody.append(new_tr)
  new_tr.fadeIn('fast', ->
    check_for_last_row()
  )

plus_equals = (node, increment) ->
  node.val(parseInt(node.val()) + increment)

move_workshop_up = (btn) ->
  move_row = $(btn).closest('tr')
  move_row.insertBefore(move_row.prevAll('.workshop').first())
  plus_equals(move_row.find('input[type=hidden]'), -1)
  plus_equals(move_row.next().find('input[type=hidden]'), 1)
  if move_row.find('input[type=hidden]').val() == '1'
    move_row.find('a[data-move-workshop-up]').hide()
    move_row.next().find('a[data-move-workshop-up]').show()


$(document).ready ->
  page = $('body').data('page-name')
  # Completing workshops
  if page=='activities#show' || page=='programs#show' || page=='programs#dashboard'
    $('a[data-show-workshop-form]').click (e) ->
      e.preventDefault()
      view_row = $(this).closest('tr')
      view_row.fadeOut 'fast', ->
        view_row.next('.hidden-workshop-form').fadeIn('fast')

    $('a[data-cancel-workshop-form]').click (e) ->
      e.preventDefault()
      form_row = $(this).closest('tr')
      form_row.fadeOut 'fast', ->
        form_row.prev().fadeIn('fast')

    $('form.workshop').on('ajax:before', (e) ->
      return window.validate_fuzzy_date_form($(this))
    )

    $('body').on('ajax:success', (e, data, status, xhr) ->
      if data.action == 'workshops#complete'
        row = $('tr#workshop-'+data.id)

        date_node = row.find('.workshop-date').first()
        if date_node.find('a').length
          date_node.find('a').html(data.date)
        else
          date_node.html(data.date)

        row.find('.workshop-completed').html(data.completed_text)

        row.next('tr.hidden-workshop-form').fadeOut 'fast', ->
          row.fadeIn('fast')

        dash_row = $('#activity-row-'+data.activity.id)
        if dash_row.length
          bar = dash_row.find('.progress-bar')
          bar.css('width', "#{data.activity.progress.percent}%")
          bar.css('background-color', data.activity.progress.color)
          dash_row.find('a[data-slide-form-id]').html(data.activity.stage_name)
          dash_row.find('#activity-stage-date-'+data.activity.id).html("(#{data.date})")
          if data.activity.archivable
            dash_row.find('span[data-archive-button]').show()
        else
          td = $('tr#edit-workshop-'+data.id).find('td.workshop-completed-cell')
          label = $('#components').find('label.workshop-completed-check').clone()
          name = label.find('input').attr('name')
          name = name.replace('0', data.id)
          label.find('input').attr('name', name)
          td.html(label)
    )

  if page=='activities#show'
    # Edit workshops form
    $('a[data-remove-workshop]').click (e) ->
      e.preventDefault()
      remove_workshop(this)

    $('a[data-add-workshop]').click (e) ->
      e.preventDefault()
      $(this).blur()
      add_workshop(this)

    $('a[data-move-workshop-up]').click (e) ->
      e.preventDefault()
      move_workshop_up(this)

    $('input[type=submit]', 'form#edit-workshops').click (e) ->
      inputs = $('input[type=text]', 'form#edit-workshops')
      unless window.validate_not_blank(inputs)
        e.preventDefault()