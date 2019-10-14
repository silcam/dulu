json.person do
  json.call(@person, :id,
            :first_name,
            :last_name,
            :email,
            :has_login,
            :ui_language,
            :email_pref,
            :gender)

  json.isUser @person == current_user

  if @person.country
    json.home_country do
      json.call(@person.country, :id, :name)
    end
  else
    json.home_country nil
  end

  json.roles do
    json.partial! "/api/person_roles/roles", roles: @person.roles
  end
  json.grantable_roles(Role
    .grantable_roles(current_user, @person)
    .collect { |r| { value: r, display: t(r) } }
    .sort_by { |a| a[:display] })

  json.participants @person.participants do |participant|
    json.call(participant, :id, :language_id, :cluster_id)
    json.name participant.cluster_language.display_name
    roles = participant.roles.collect { |r| t(r) }
    json.roles roles
  end

  # json.events do
  #   json.current @person.events.current, partial: 'api/people/event', as: :event
  #   json.upcoming @person.events.upcoming, partial: 'api/people/event', as: :event
  #   json.past @person.events.past.limit(5), partial: 'api/people/event', as: :event
  # end

  json.can do
    json.update can?(:update, @person)
    json.destroy can?(:destroy, @person)
  end

  json.loaded true
end
