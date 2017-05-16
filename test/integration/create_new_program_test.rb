require 'test_helper'

class CreateNewProgramTest < ActionDispatch::IntegrationTest
  def setup
    @language = get_language_without_project
    log_in_jiminy
  end

  def get_language_without_project
    Language.all.each do |language|
      return language unless language.programs.first
    end
  end

  test "create new program" do
    get new_program_path
    assert_response :success

    post programs_path,
      params: {program: {language_id: @language.id, start_date: Date.today, name: 'Name'}}
    assert_redirected_to program_path(Program.last)
    follow_redirect!
    assert_response :success

    @program = Program.last
    get program_path(@program)
    assert_response :success

    get new_program_translation_activity_path(@program)
    assert_response :success

    post program_translation_activities_path,
      params: {program_id: @program.id, bible_book_ids: 
                [BibleBook.get_new_testament.first.id,
                BibleBook.get_old_testament.first.id]}
    assert_redirected_to program_path(@program)
    follow_redirect!
    assert_response :success

    assert_equal 2,  @program.translation_activities.length
    @genesis = @program.translation_activities.first
    assert_equal 1, @genesis.current_translation_stage.stage_name.level
    assert_equal Date.today, @genesis.current_translation_stage.start_date

    get new_translation_activity_translation_stage_path(@genesis)
    assert_response :success

    post translation_activity_translation_stages_path,
      params: {translation_stage: {
                stage_name_id: @genesis.current_translation_stage.stage_name.next_stage.id,
                start_date: Date.today}}
    assert_redirected_to program_path(@program)
    follow_redirect!
    assert_response :success

    assert_equal 2, @genesis.current_translation_stage.stage_name.level
  end
end
