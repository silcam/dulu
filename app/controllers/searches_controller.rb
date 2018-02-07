class SearchesController < ApplicationController

  def search
    @query = params[:q]
    if(@query.blank?)
      @results = nil
    else
      # Priority search models first
      @results = Program.search(@query) +
                 Person.search(@query) +
                 Organization.search(@query) +
                 Cluster.search(@query)
      if @results.count == 1 && @results[0][:model]
        redirect_to @results[0][:model]
      else
        @results += Activity.search(@query) +
                    Publication.search(@query) +
                    Event.search(@query)
        if @results.count==1 && @results[0][:model]
          redirect_to @results[0][:model]
        end
      end
    end
  end
end
