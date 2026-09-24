module MultiWordSearch
  extend ActiveSupport::Concern

  class_methods do
    # Matches every word of `query` against every column in `cols`, ORed together,
    # accent-insensitively. "jean marie" against first_name/last_name finds a
    # Jean-Marie, a Marie Jean and a plain Jean.
    #
    # `query` is user input from `params[:q]` and is always passed as a bind.
    # `cols` is *not* bindable -- a column name cannot be a placeholder -- so it is
    # checked against `column_names` and then quoted. Both, deliberately: the
    # allowlist is what produces a comprehensible error, and the quoting is what
    # makes the interpolation safe on its own terms rather than safe only for as
    # long as the allowlist above it is right. Every caller today passes a literal.
    #
    # The allowlist rejects table-qualified names ("people.first_name"); no caller
    # needs one yet, and a joined caller that does will get the ArgumentError below
    # rather than a confusing SQL error.
    def multi_word_where(query, *cols)
      cols = cols.map(&:to_s)
      unknown = cols - column_names
      raise ArgumentError, "unknown column(s) for #{name}: #{unknown.join(', ')}" if unknown.any?

      # `String#split` with no argument splits on runs of whitespace, so a blank or
      # whitespace-only query yields []. Returning `none` for that matters: an empty
      # `where` clause used to mean "every row" for a one-column caller, and the
      # two-column callers built a bare " OR " and raised PG::SyntaxError. The UI
      # cannot send one (useSearch enforces a two-character minimum), but the
      # endpoints are reachable directly -- `Person.basic_search(params[:q])`.
      words = query.to_s.split
      return none if words.empty? || cols.empty?

      sql = cols.flat_map { |col|
        quoted = connection.quote_column_name(col)
        words.map { "unaccent(#{quoted}) ILIKE unaccent(?)" }
      }.join(" OR ")

      where(sql, *cols.flat_map { words.map { |w| "%#{w}%" } })
    end
  end
end
