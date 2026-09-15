require 'test_helper'

# Guards the two properties `MultiWordSearch#multi_word_where` has to hold that
# nothing else in the suite touches: the query text is bound rather than
# interpolated, and a blank query returns nothing instead of everything.
#
# Before the Phase 8a rewrite a blank query produced an empty WHERE clause -- so a
# one-column caller returned every row, and a two-column caller built a bare " OR "
# and raised PG::SyntaxError. Both are reachable: `Api::PeopleController#search`
# passes `params[:q]` straight through. If `return none` ever looks like a guard
# with no reason behind it, these are the reason.
class MultiWordSearchTest < ActiveSupport::TestCase
  test 'matches every word against every column' do
    assert_includes Person.multi_word_where('drew', 'first_name', 'last_name'),
                    people(:Drew)
    # Second word, second column -- the cross product is the point.
    assert_includes Person.multi_word_where('nobody mambo', 'first_name', 'last_name'),
                    people(:Drew)
  end

  test 'a blank query returns nothing rather than everything' do
    [nil, '', '   '].each do |query|
      assert_empty Person.multi_word_where(query, 'first_name', 'last_name'),
                   "two columns, #{query.inspect}"
      assert_empty Cluster.multi_word_where(query, 'name'),
                   "one column, #{query.inspect}"
    end
  end

  test 'query text is data, not SQL' do
    # Every word is bound, so `1=1` does not become a tautology: the result is
    # whatever happens to contain those words as text, never the whole table.
    # (Do not assert this is empty -- "OR" is a substring of "Translator".)
    tautology = Person.multi_word_where("' OR 1=1 --", 'last_name')
    assert_not_includes tautology, people(:Drew)
    assert_operator tautology.count, :<, Person.count

    before = Person.count
    assert_empty Person.multi_word_where("zzz'; DROP TABLE people; --", 'last_name')
    assert_equal before, Person.count, 'the payload ran as SQL'
  end

  test 'an unknown column is refused rather than interpolated' do
    error = assert_raises(ArgumentError) do
      Person.multi_word_where('drew', 'last_name) OR 1=1 --')
    end
    assert_match 'unknown column', error.message
  end
end
