add_cluster_program = (type, id, name) ->
  add_me = "<span>"
  input_name = type + "_ids[]" # eg cluster => cluster_ids[]
  add_me += "<input type='hidden' name='#{input_name}' value='#{id}'>"
  add_me += name + ' '
  add_me += "<a href='#' class='btn btn-xs btn-danger'>X</a>"
  add_me += "</span> "
  $('#report-languages-none').hide()
  $('#report-languages').append(add_me)

remove_cluster_program = (element) ->
  $(element).closest('span').fadeOut 'fast', ->
    $(this).remove()

$(document).ready ->
  if $('body').data('page-name') == 'reports#index' or $('body').data('page-name') == 'reports#show'
    $('#recently_viewed_reports').change ->
      path = "/reports/" + $(this).val()
      $(this).closest('div').find('a').attr('href', path)

  if $('body').data('page-name') == 'reports#index' or $('body').data('page-name') == 'reports#edit'
    $('a[data-add-cluster]').click (e) ->
      e.preventDefault()
      $(this).blur()
      select = $('#add_cluster')
      id = select.val()
      name = select.find('option:selected').text()
      add_cluster_program('cluster', id, name)

    $('a[data-add-program]').click (e) ->
      e.preventDefault()
      $(this).blur()
      select = $('#add_program')
      id = select.val()
      name = select.find('option:selected').text()
      add_cluster_program('program', id, name)


    $('#report-languages').click (e) ->
      if(e.target.nodeName.toLowerCase() == 'a')
        e.preventDefault()
        remove_cluster_program(e.target)

    $('.masterbox input:checkbox').change ->
      slavebox_container = $(this).closest('.form-group').find('.slaveboxes')
      if this.checked
        slavebox_container.removeClass('disabled')
        slavebox_container.find('input').prop('disabled', false)
      else
        slavebox_container.addClass('disabled')
        slavebox_container.find('input').prop('disabled', true)