json.report do
  json.type "Domain"

  if @db_report
    json.call(@db_report, :id, :name)
    json.author do
      json.call(@db_report.author, :id, :full_name)
    end
  end

  json.dataParams do
    json.call(@report, :domain)
    json.period @report.period.to_h
    json.languageIds @report.language_ids
    json.clusterIds @report.cluster_ids
  end

  json.displayParams({})

  json.data do
    json.activityReportItems @report.activity_items

    json.events(@report.events.map do |ev|
      ev.attributes.merge({
        cluster_ids: ev.cluster_ids,
        language_ids: ev.language_ids,
        event_participants: ev.event_participants.map { |ep| { id: ep.id, person_id: ep.person_id } },
      })
    end)

    json.statusItems @report.status_items
  end
end
