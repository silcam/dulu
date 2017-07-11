class TranslationActivitiesController < ApplicationController

  # def new
  #   @program = Program.find(params[:program_id])
  #   authorize! :create_activity, @program
  # end
  #
  # def create
  #   @program = Program.find(params[:program_id])
  #   authorize! :create_activity, @program
  #   if params[:bible_book_ids]
  #     params[:bible_book_ids].each do |id|
  #       unless @program.bible_books.include?(BibleBook.find(id))
  #         TranslationActivity.add_new_to_program(@program, id)
  #       end
  #     end
  #   end
  #   redirect_to @program
  # end
  #
  def show
    @translation_activity = TranslationActivity.find(params[:id])
    @program = @translation_activity.program
  end
end
