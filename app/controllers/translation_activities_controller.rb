class TranslationActivitiesController < ApplicationController

  def new
    @program = Program.find(params[:program_id])
  end

  def create
    @program = Program.find(params[:program_id])
    if params[:bible_book_ids]
      params[:bible_book_ids].each do |id|
        unless @program.bible_books.include?(BibleBook.find(id))
          TranslationActivity.add_new_to_program(@program, id)
        end
      end
    end
    redirect_to @program
  end

end
