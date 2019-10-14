module MultiWordSearch
  extend ActiveSupport::Concern

  class_methods do
    def multi_word_where(query, *cols)
      where_clauses = []
      all_q_words = []
      cols.each do |col|
        q_words = query.split(" ")
        where_clauses << q_words.collect { |w| "unaccent(#{col}) ILIKE unaccent(?)" }.join(" OR ")
        all_q_words += q_words.collect { |w| "%#{w}%" }
      end
      where(where_clauses.join(" OR "), *all_q_words)
    end
  end
end
