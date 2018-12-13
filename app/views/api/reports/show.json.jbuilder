json.report do
  json.author do
    json.call(@report.author, :id, :full_name)
  end

  json.call(@report, :id, :name)
  json.type @report.report['type']
  json.elements @report.report['elements']

  json.clusters(@report.report['clusters'].collect{ |c_id| Report.lc_cluster_report(Cluster.find(c_id)) })

  json.programs(@report.report['programs'].collect{ |p_id| Report.lc_program_report(Program.find(p_id)) })
end
