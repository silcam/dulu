module EventsHelper
  def ctxt_events_path(program)
    if program
      program_events_path(program)
    else
      events_path
    end
  end

  def ctxt_event_path(program, event)
    if program
      program_event_path(program, event)
    else
      event_path(event)
    end
  end
end
