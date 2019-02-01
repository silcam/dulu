class MakeProgramsLanguages < ActiveRecord::Migration[5.1]
  def up
    add_column :languages, :lpf_id, :integer
    add_column :languages, :program_id, :integer

    add_reference :activities, :language
    add_reference :domain_updates, :language
    add_reference :events_programs, :language
    add_reference :participants, :language
    add_reference :publications, :language
    add_reference :survey_completions, :language

    rename_table :events_programs, :events_languages

    set_language_id('activities')
    set_language_id('domain_updates')
    set_language_id('events_languages')
    set_language_id('participants')
    set_language_id('publications')
    set_language_id('survey_completions')

    execute("UPDATE languages
             SET lpf_id = programs.lpf_id, program_id = programs.id
             FROM programs 
             WHERE programs.language_id = languages.id;")
  end

  def down
    rename_table :events_languages, :events_programs

    remove_column :activities, :language_id
    remove_column :domain_updates, :language_id
    remove_column :events_programs, :language_id
    remove_column :participants, :language_id
    remove_column :publications, :language_id
    remove_column :survey_completions, :language_id

    remove_column :languages, :lpf_id
    remove_column :languages, :program_id
  end

  def set_language_id(table_name) 
    execute("UPDATE #{table_name}
             SET language_id = programs.language_id 
             FROM programs 
             WHERE programs.id = #{table_name}.program_id;")
  end
end
