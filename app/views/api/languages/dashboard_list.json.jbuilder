participants = current_user.participants
cluster_participants = participants.select { |p| p.cluster_id }
language_participants = participants.select { |p| p.language_id }

selection = current_user.view_prefs['dashboardSelection'] || 'current_user'

json.user do
  json.name current_user.full_name
  json.selectionTag 'current_user'
  json.startExpanded true
  json.startSelected selection == 'current_user'

  json.clusters cluster_participants do |participant|
    json.call(participant.cluster, :id, :display_name)
    c_tag = "current_user>cluster#{participant.cluster.id}"
    json.partial! 'selection_params', tag: c_tag, selection: selection

    json.languages participant.cluster.languages do |language|
      json.call(language, :id, :name)
      p_tag = c_tag + ">language#{language.id}"
      json.partial! 'selection_params', tag: p_tag, selection: selection
    end
  end
  json.languages language_participants do |participant|
    json.call(participant.language, :id, :name)
    tag = "current_user>language#{participant.language.id}"
    json.partial! 'selection_params', tag: tag, selection: selection
  end
end

user_countries = [Country.find_by(english_name: 'Cameroon')]
json.countries user_countries do |country|
  json.call(country, :id, :name)
  country_tag = "country#{country.id}"
  json.selectionTag country_tag
  json.startSelected selection == country_tag
  json.startExpanded true

  lpfs = Lpf.all
  json.sections lpfs do |lpf|
    json.call(lpf, :id, :name)
    lpf_tag = country_tag + ">lpf#{lpf.id}"
    json.partial! 'selection_params', tag: lpf_tag, selection: selection

    json.clusters lpf.clusters do |cluster|
      json.call(cluster, :id, :display_name)
      c_tag = lpf_tag + ">cluster#{cluster.id}"
      json.partial! 'selection_params', tag: c_tag, selection: selection

      json.languages cluster.languages do |language|
        json.call(language, :id, :name)
        p_tag = c_tag + ">language#{language.id}"
        json.partial! 'selection_params', tag: p_tag, selection: selection
      end
    end

    json.languages lpf.languages do |language|
      json.call(language, :id, :name)
      p_tag = lpf_tag + ">language#{language.id}"
      json.partial! 'selection_params', tag: p_tag, selection: selection
    end
  end
end
