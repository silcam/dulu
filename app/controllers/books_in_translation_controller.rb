class BooksInTranslationController < ApplicationController

  def new
    @project = Project.find(params[:project_id])
  end

  def create
    @project = Project.find(params[:project_id])
    if params[:bible_book_ids]
      params[:bible_book_ids].each do |id|
        unless @project.bible_books.include?(BibleBook.find(id))
          BookInTranslation.add_new_to_project(@project, id)
        end
      end
    end
    redirect_to @project
  end

end
