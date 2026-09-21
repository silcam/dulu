class Api::SearchesController < ApplicationController
  def search
    @query = params[:q]
    if (@query.blank?)
      @results = []
    else
      # Activities and publications are absent from global search, each for its own
      # reason, neither of them the original one. Both were commented out in 91819c6
      # (Dec 2018) because a concurrent refactor had broken Activity.search; that is
      # long fixed. They stay out because Activity.search returns its results as
      # subresults under a route-less BibleBook and search is a flat list now (see
      # TranslationActivity.search), and because Publication.search links to
      # /publications/:id, which no React route matches -- MainRouter's `path="*"`
      # would swallow it and render the dashboard instead.
      @results = Language.search(@query) +
                 Person.search(@query) +
                 Organization.search(@query) +
                 Cluster.search(@query) +
                 Event.search(@query)
    end
  end
end
