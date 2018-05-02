json.person do
  json.call(@person, :id, 
                     :first_name, 
                     :last_name, 
                     :email, 
                     :has_login,
                     :ui_language,
                     :email_pref)

  json.isUser (@person == current_user)

  if @person.country
    json.home_country do
      json.call(@person.country, :id, :name)
    end
  else
    json.home_country nil
  end

  orgs = []
  orgs << @person.organization if @person.organization
  json.organizations orgs do |org|
    json.call(org, :id, :name, :abbreviation)
  end

  roles = @person.roles.collect { |r| {value: r, display: t(r) } }
  json.roles roles
  json.grantable_roles Role
                        .grantable_roles(current_user, @person)
                        .collect{ |r| { value: r, display: t(r) } }
                        .sort{ |a, b| a[:display] <=> b[:display] }

  json.participants @person.participants do |participant|
    json.call(participant, :id, :program_id, :cluster_id)
    json.name participant.cluster_program.display_name
    roles = participant.roles.collect { |r| t(r) }
    json.roles roles
  end

  json.events do
    json.current @person.events.current, partial: 'api/people/event', as: :event
    json.upcoming @person.events.upcoming, partial: 'api/people/event', as: :event
    json.past @person.events.past.limit(5), partial: 'api/people/event', as: :event
  end
end

json.can do
  json.update can?(:update, @person)
  json.destroy can?(:destroy, @person)
end