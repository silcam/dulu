class TryToFixPubAudioToAudioScripture < ActiveRecord::Migration[5.0]
  def up
    Publication
        .where("media_kind='Audio' AND NOT english_name ILIKE '%Song%'")
        .update(media_kind: 'AudioScripture')
  end
end
