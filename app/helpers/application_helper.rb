module ApplicationHelper

  def fdate_from_params(params, field)
    params["#{field}_y"] + '-' +
        params["#{field}_m"] + '-' +
        params["#{field}_d"]
  end

  def assemble_dates(params, model, *fields)
    fields.each do |field|
     params[model][field] = params[model]["#{field}_y"] + '-' +
                            params[model]["#{field}_m"] + '-' +
                            params[model]["#{field}_d"]
    end
  end

end
