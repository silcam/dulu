json.report do
  json.author do
    json.call(@db_report.author, :id, :full_name)
  end

  json.call(@db_report, :id, :name)
  json.type @db_report.report['type']
  json.elements @db_report.report['elements']

  json.clusters(@db_report.report['clusters'].collect{ |c_id| Report.lc_cluster_report(Cluster.find(c_id)) })

  json.languages(@db_report.report['languages'].collect{ |p_id| Report.lc_language_report(Language.find(p_id)) })
end
