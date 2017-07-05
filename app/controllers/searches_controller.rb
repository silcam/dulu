class SearchesController < ApplicationController

  def search
    @query = params[:q]
    @results = @query.blank? ? nil : Program.search(@query) +
    Activity.search(@query) +
    Person.search(@query) +
    Organization.search(@query)
    if @results.count==1 && @results[0][:path]
      redirect_to @results[0][:path]
    end
  end
end
