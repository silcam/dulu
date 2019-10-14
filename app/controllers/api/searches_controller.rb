class Api::SearchesController < ApplicationController
  def search
    @query = params[:q]
    if (@query.blank?)
      @results = []
    else
      @results = Language.search(@query) +
                 Person.search(@query) +
                 Organization.search(@query) +
                 Cluster.search(@query) +
                 #  Activity.search(@query) +
                 #  Publication.search(@query) +
                 Event.search(@query)
    end
  end
end
