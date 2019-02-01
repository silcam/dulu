json.report do
  json.author do
    json.call(@report.author, :id, :full_name)
  end

  json.call(@report, :id, :name)
  json.type @report.report['type']
  json.elements @report.report['elements']

  json.clusters(@report.report['clusters'].collect{ |c_id| Report.lc_cluster_report(Cluster.find(c_id)) })

  json.languages(@report.report['languages'].collect{ |p_id| Report.lc_language_report(Language.find(p_id)) })
end
