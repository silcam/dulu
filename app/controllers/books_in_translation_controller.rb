class BooksInTranslationController < ApplicationController

  def new
    @project = Project.find(params[:project_id])
  end

  def create
    @project = params[:project_id]
    #TODO finish this tomorrow - find books_in_translation already assoc with project
    #add the books_in_translation from params not already assoc
  end

  private
    def book_in_translation_params

    end
end
